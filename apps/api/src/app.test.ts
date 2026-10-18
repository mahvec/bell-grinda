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
});
