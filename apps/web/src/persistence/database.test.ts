import { afterEach, describe, expect, it } from "vitest";
import type { PainEvent, UserProfile } from "@bellgrinda/domain";
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
