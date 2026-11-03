import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { loadConfig } from "./config.js";

const app = createApp({ config: loadConfig({ NODE_ENV: "test" }) });

describe("BellGrinda API", () => {
  it("reports health without requiring a database connection", async () => {
    const response = await request(app).get("/api/v1/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: { status: "ok", version: "0.1.0", databaseConfigured: false } });
    expect(response.headers["x-request-id"]).toBeTruthy();
  });

  it("keeps sync unavailable until PostgreSQL is configured", async () => {
    const response = await request(app).post("/api/v1/sync").send({});
    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe("DATABASE_UNAVAILABLE");
  });

  it("returns a deterministic Coach explanation without cloud AI configuration", async () => {
    const response = await request(app).post("/api/v1/ai/coach").send({ question: "Why this workout?", context: { currentTrainingLevel: "novice", currentPhase: 1, availableEquipment: [], recentSessions: [], safetyRestrictions: [], todayWorkout: { id: "today", date: "2026-11-02", title: "Upper-body strength", focus: "Pressing strength", rounds: 3, estimatedMinutes: 30, readiness: { score: 70, status: "yellow", reasonCodes: ["READINESS_POOR_SLEEP"], guidance: "Reduce volume" }, exercises: [], reasonCodes: ["VOLUME_REDUCED"], engineVersion: "test" } } });
    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({ source: "deterministic", uncertainty: false });
    expect(response.body.data.answer).toContain("deterministic engines");
  });
});
