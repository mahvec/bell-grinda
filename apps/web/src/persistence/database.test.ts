import { afterEach, describe, expect, it } from "vitest";
import Dexie from "dexie";
import { DEFAULT_GOAL_PRIORITIES, type Assessment, type PainEvent, type UserProfile } from "@bellgrinda/domain";
import { BellGrindaDatabase } from "./database";

const profile: UserProfile = {
  id: "profile-test",
  name: "Ada",
  trainingLevel: "novice",
  phase: 1,
  equipment: ["kettlebell_12", "mat"],
  createdAt: "2026-10-18T12:00:00.000Z"
};

let database: BellGrindaDatabase | null = null;

afterEach(async () => {
  if (database) {
    database.close();
    await database.delete();
    database = null;
  }
});

describe("BellGrindaDatabase", () => {
  it("preserves a local training profile", async () => {
    database = new BellGrindaDatabase(`bellgrinda-test-${crypto.randomUUID()}`);
    await database.profiles.put(profile);
    await expect(database.profiles.get(profile.id)).resolves.toEqual(profile);
  });

  it("adds goal priorities without removing existing profile or progress records", async () => {
    const name = `bellgrinda-migration-test-${crypto.randomUUID()}`;
    const legacy = new Dexie(name);
    legacy.version(6).stores({ profiles: "id, createdAt", sessions: "id, status, startedAt, updatedAt, completedAt", painEvents: "id, sessionId, exerciseId, bodyLocation, severity, occurredAt", progressionDecisions: "id, sessionId, scope, exerciseId, decision, createdAt", assessments: "id, date, type, createdAt", personalRecords: "id, exerciseId, recordType, sessionId, date", performanceSnapshots: "id, calculatedAt, sourceSessionId, sourceAssessmentId", readinessRecords: "id, date, createdAt", levelReviews: "id, currentLevel, result, requestedAt", levelHistory: "id, previousLevel, newLevel, changedAt" });
    const assessment: Assessment = { id: "assessment-before-update", date: "2026-11-01", type: "baseline", bodyweightKg: 95, waistCm: 92, chestCm: 105, maxStandardPushups: 20, notes: "Before app update", createdAt: "2026-11-01" };
    await legacy.open();
    await legacy.table("profiles").put(profile);
    await legacy.table("assessments").put(assessment);
    legacy.close();

    database = new BellGrindaDatabase(name);
    await database.open();
    await expect(database.profiles.get(profile.id)).resolves.toEqual({ ...profile, goalPriorities: DEFAULT_GOAL_PRIORITIES });
    await expect(database.assessments.get(assessment.id)).resolves.toEqual(assessment);
  });

  it("stores pain events as append-only session records", async () => {
    database = new BellGrindaDatabase(`bellgrinda-test-${crypto.randomUUID()}`);
    const event: PainEvent = {
      id: crypto.randomUUID(),
      sessionId: "session-1",
      exerciseId: "kb-swing",
      bodyLocation: "lower_back",
      severity: "moderate",
      source: "workout",
      round: 2,
      notes: "Discomfort during the hinge.",
      occurredAt: "2026-10-18T12:00:00.000Z"
    };

    await database.painEvents.add(event);
    await expect(database.painEvents.get(event.id)).resolves.toEqual(event);
  });
});
