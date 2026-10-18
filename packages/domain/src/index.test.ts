import { describe, expect, it } from "vitest";
import {
  createSession,
  generatedWorkoutSchema,
  readinessInputSchema,
  workoutSessionSchema,
  type GeneratedWorkout
} from "./index";

const workout: GeneratedWorkout = generatedWorkoutSchema.parse({
  id: "2026-10-19-novice",
  date: "2026-10-19",
  title: "Foundation strength",
  focus: "Hinge and carry",
  rounds: 3,
  estimatedMinutes: 28,
  readiness: {
    score: 82,
    status: "green",
    reasonCodes: ["ready"],
    guidance: "Train as planned."
  },
  exercises: [
    {
      id: "deadlift",
      name: "Kettlebell deadlift",
      category: "strength",
      target: "8 reps",
      loadKg: 12
    }
  ],
  reasonCodes: ["monday_template"],
  engineVersion: "novice-v1"
});

describe("domain contracts", () => {
  it("rejects incomplete readiness input", () => {
    expect(
      readinessInputSchema.safeParse({
        energy: "normal",
        sleep: "good",
        soreness: "none",
        pain: "none"
      }).success
    ).toBe(false);
  });

  it("creates a valid resumable workout session", () => {
    const session = createSession(workout, new Date("2026-10-19T06:00:00.000Z"));

    expect(workoutSessionSchema.safeParse(session).success).toBe(true);
    expect(session.status).toBe("active");
    expect(session.exerciseLogs).toEqual([
      {
        exerciseId: "deadlift",
        completedRounds: 0,
        skipped: false,
        actualTarget: null
      }
    ]);
  });
});
