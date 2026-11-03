import { coachRequestSchema, coachResponseSchema, painEventSchema, userProfileSchema, workoutSessionSchema, type CoachContext } from "@bellgrinda/domain";
import cors from "cors";
import { eq } from "drizzle-orm";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import type { AppConfig } from "./config.js";
import type { Database } from "./database/client.js";
import { painEvents, profiles, users, workoutSessions } from "./database/schema.js";

type Dependencies = { config: AppConfig; db?: Database | undefined };

const syncPayloadSchema = z.object({
  profile: userProfileSchema.optional(),
  sessions: z.array(workoutSessionSchema).default([]),
  painEvents: z.array(painEventSchema).default([])
});

const success = <T>(data: T) => ({ success: true as const, data });
const failure = (code: string, message: string, requestId: string) => ({ success: false as const, error: { code, message, requestId } });

function requestId(request: Request, response: Response, next: NextFunction) {
  const id = request.header("x-request-id") ?? crypto.randomUUID();
  response.locals.requestId = id;
  response.setHeader("x-request-id", id);
  next();
}

function databaseRequired(response: Response, db: Database | undefined) {
  if (db) return db;
  response.status(503).json(failure("DATABASE_UNAVAILABLE", "The sync service is not configured yet.", response.locals.requestId));
  return undefined;
}

function deterministicCoachAnswer(question: string, context: CoachContext) {
  if (context.todayWorkout) {
    const reasons = context.todayWorkout.reasonCodes.filter((reason) => ["VOLUME_REDUCED", "LOWER_BODY_VOLUME_REDUCED", "TIME_CAPPED", "FOOTBALL_ACTIVATION", "DELOAD_ACTIVE"].includes(reason)).map((reason) => reason.replaceAll("_", " ").toLowerCase());
    return `Today's ${context.todayWorkout.title} has ${context.todayWorkout.rounds} rounds and focuses on ${context.todayWorkout.focus.toLowerCase()}.${reasons.length ? ` Adjustments: ${reasons.join(", ")}.` : ""} The deterministic engines selected the prescription; the Coach cannot change it.`;
  }
  return context.recentSessions.length ? `BellGrinda found ${context.recentSessions.length} recent sessions relevant to “${question}”. The current level is ${context.currentTrainingLevel.replaceAll("_", " ")} phase ${context.currentPhase}.` : "BellGrinda does not have enough recorded history to answer that confidently yet.";
}

async function createCoachAnswer(config: AppConfig, question: string, context: CoachContext) {
  if (!config.NVIDIA_API_KEY) return coachResponseSchema.parse({ answer: deterministicCoachAnswer(question, context), source: "deterministic", uncertainty: context.recentSessions.length === 0 && !context.todayWorkout });
  const aiResponse = await fetch(`${config.NVIDIA_API_BASE_URL.replace(/\/$/, "")}/chat/completions`, { method: "POST", headers: { authorization: `Bearer ${config.NVIDIA_API_KEY}`, accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({
    model: config.NVIDIA_MODEL,
    messages: [
      { role: "system", content: "You are BellGrinda Coach. Explain only the supplied structured BellGrinda data. The deterministic workout, readiness, safety, progression, and level-review engines are authoritative. Never invent history, diagnose injury, remove restrictions, change a prescription, or promote a user. Express uncertainty when evidence is missing. Return only valid JSON with exactly two fields: answer (a string under 180 words) and uncertainty (a boolean)." },
      { role: "user", content: `Question: ${question}\nStructured BellGrinda context:\n${JSON.stringify(context)}` }
    ],
    temperature: 0.2,
    top_p: 0.95,
    max_tokens: 1200,
    reasoning_budget: 512,
    stream: false
  }) });
  if (!aiResponse.ok) throw new Error(`Coach provider returned ${aiResponse.status}`);
  const payload = await aiResponse.json() as { choices?: { message?: { content?: string | null } }[] };
  const text = payload.choices?.[0]?.message?.content?.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  if (!text) throw new Error("Coach provider returned no text output");
  const parsed = JSON.parse(text) as { answer: string; uncertainty: boolean };
  return coachResponseSchema.parse({ ...parsed, source: "ai" });
}

export function createApp({ config, db }: Dependencies) {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors({ origin: config.CORS_ORIGIN ?? false }));
  app.use(express.json({ limit: "1mb" }));
  app.use(requestId);

  app.get("/api/v1/health", (_request, response) => {
    response.json(success({ status: "ok", version: "0.1.0", databaseConfigured: Boolean(db) }));
  });

  app.get("/api/v1/health/ready", async (_request, response) => {
    const database = databaseRequired(response, db);
    if (!database) return;
    try {
      await database.execute("select 1");
      response.json(success({ status: "ready" }));
    } catch {
      response.status(503).json(failure("DATABASE_UNAVAILABLE", "The database is not ready.", response.locals.requestId));
    }
  });

  app.post("/api/v1/ai/coach", async (request, response) => {
    const parsed = coachRequestSchema.safeParse(request.body);
    if (!parsed.success) { response.status(422).json(failure("VALIDATION_ERROR", "The Coach request is invalid.", response.locals.requestId)); return; }
    try { response.json(success(await createCoachAnswer(config, parsed.data.question, parsed.data.context))); }
    catch { response.json(success(coachResponseSchema.parse({ answer: deterministicCoachAnswer(parsed.data.question, parsed.data.context), source: "deterministic", uncertainty: true }))); }
  });

  app.get("/api/v1/profile", async (_request, response, next) => {
    const database = databaseRequired(response, db);
    if (!database) return;
    try {
      const [profile] = await database.select({ payload: profiles.payload }).from(profiles).where(eq(profiles.userId, config.LOCAL_USER_ID)).limit(1);
      if (!profile) {
        response.status(404).json(failure("PROFILE_NOT_FOUND", "No synced profile was found.", response.locals.requestId));
        return;
      }
      response.json(success(profile.payload));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/v1/sync", async (request, response, next) => {
    const database = databaseRequired(response, db);
    if (!database) return;

    const parsed = syncPayloadSchema.safeParse(request.body);
    if (!parsed.success) {
      response.status(422).json(failure("VALIDATION_ERROR", "The sync payload is invalid.", response.locals.requestId));
      return;
    }

    try {
      await database.transaction(async (transaction) => {
        await transaction.insert(users).values({ id: config.LOCAL_USER_ID }).onConflictDoNothing();

        if (parsed.data.profile) {
          await transaction.insert(profiles).values({ userId: config.LOCAL_USER_ID, payload: parsed.data.profile, updatedAt: new Date() })
            .onConflictDoUpdate({ target: profiles.userId, set: { payload: parsed.data.profile, updatedAt: new Date() } });
        }

        for (const session of parsed.data.sessions) {
          await transaction.insert(workoutSessions).values({ id: session.id, userId: config.LOCAL_USER_ID, payload: session, updatedAt: new Date(session.updatedAt) })
            .onConflictDoUpdate({ target: workoutSessions.id, set: { payload: session, updatedAt: new Date(session.updatedAt) } });
        }

        for (const painEvent of parsed.data.painEvents) {
          await transaction.insert(painEvents).values({ id: painEvent.id, userId: config.LOCAL_USER_ID, sessionId: painEvent.sessionId, payload: painEvent, occurredAt: new Date(painEvent.occurredAt) }).onConflictDoNothing();
        }
      });

      response.status(200).json(success({ profile: Boolean(parsed.data.profile), sessions: parsed.data.sessions.length, painEvents: parsed.data.painEvents.length }));
    } catch (error) {
      next(error);
    }
  });

  app.use((request, response) => {
    response.status(404).json(failure("NOT_FOUND", "The requested API route does not exist.", response.locals.requestId ?? "unknown"));
  });

  app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
    void next;
    console.error(error);
    response.status(500).json(failure("INTERNAL_ERROR", "An unexpected server error occurred.", response.locals.requestId ?? "unknown"));
  });

  return app;
}
