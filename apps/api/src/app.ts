import { painEventSchema, userProfileSchema, workoutSessionSchema } from "@bellgrinda/domain";
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
