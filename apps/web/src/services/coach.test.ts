import { describe, expect, it } from "vitest";
import type { GeneratedWorkout } from "@bellgrinda/domain";
import { deterministicWorkoutExplanation } from "./coach";

describe("deterministic Coach fallback", () => {
  it("explains the actual generated workout and its reason codes", () => {
    const workout: GeneratedWorkout = { id: "today", date: "2026-11-02", title: "Upper-body strength", focus: "Pressing and pulling", rounds: 3, estimatedMinutes: 30, readiness: { score: 68, status: "yellow", reasonCodes: ["READINESS_POOR_SLEEP"], guidance: "Reduce volume" }, exercises: [{ id: "overhead-press", name: "Press", category: "push", target: "5 per arm", loadKg: 12 }], reasonCodes: ["VOLUME_REDUCED", "EQUIPMENT_LOADS_VALIDATED"], engineVersion: "test" };
    const explanation = deterministicWorkoutExplanation(workout);
    expect(explanation).toContain("Upper-body strength");
    expect(explanation).toContain("3 rounds");
    expect(explanation).toContain("equipment");
    expect(workout.exercises[0]?.loadKg).toBe(12);
  });
});
