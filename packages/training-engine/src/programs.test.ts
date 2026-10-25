import { describe, expect, it } from "vitest";
import type { UserProfile } from "@bellgrinda/domain";
import { generateProgramWorkout } from "./programs";

const profile = (trainingLevel: UserProfile["trainingLevel"]): UserProfile => ({ id: "program-user", name: "Test", trainingLevel, phase: 2, equipment: ["kettlebell_12", "mat"], createdAt: "2026-10-01T00:00:00.000Z" });
const green = { score: 90, status: "green" as const, reasonCodes: [], guidance: "Train" };

describe("program generation", () => {
  it.each(["advanced_novice", "intermediate", "advanced", "grandmaster"] as const)("generates a distinct %s versioned program", (level) => {
    const workout = generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), green, profile(level));
    expect(workout).toMatchObject({ rounds: level === "grandmaster" ? 4 : 5, engineVersion: expect.stringContaining(level.replaceAll("_", "-")) });
    expect(workout.reasonCodes).toContain(`LEVEL_${level.toUpperCase()}`);
    expect(workout.exercises).toHaveLength(5);
  });
  it("uses level-specific movements instead of scaling one shared template", () => {
    const date = new Date("2026-10-19T09:00:00.000Z");
    expect(generateProgramWorkout(date, green, profile("advanced_novice")).exercises.map((item) => item.id)).toContain("tempo-push-up");
    expect(generateProgramWorkout(date, green, profile("intermediate")).exercises.map((item) => item.id)).toContain("suitcase-march");
    expect(generateProgramWorkout(date, green, profile("advanced")).exercises.map((item) => item.id)).toContain("front-rack-squat");
    expect(generateProgramWorkout(date, green, profile("grandmaster")).exercises.map((item) => item.id)).toContain("suitcase-march");
  });
  it("changes prescriptions across a level's three phases", () => {
    const phase1 = { ...profile("intermediate"), phase: 1 as const };
    const phase3 = { ...profile("intermediate"), phase: 3 as const };
    const date = new Date("2026-10-19T09:00:00.000Z");
    expect(generateProgramWorkout(date, green, phase1).exercises[0]?.target).toBe("10–12 reps");
    expect(generateProgramWorkout(date, green, phase3).exercises[0]?.target).toBe("12–15 reps");
  });
  it("keeps recovery and readiness reductions above program volume", () => {
    expect(generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), { ...green, status: "yellow" }, profile("intermediate")).rounds).toBe(3);
    expect(generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), { ...green, status: "red" }, profile("advanced"))).toMatchObject({ title: "Recovery session", rounds: 1 });
  });
  it("uses the user's configured kettlebell weight", () => {
    const customProfile = { ...profile("novice"), defaultKettlebellKg: 16 };
    const workout = generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), green, customProfile);
    expect(workout.exercises.filter((exercise) => exercise.loadKg !== null).every((exercise) => exercise.loadKg === 16)).toBe(true);
  });
  it("replaces the workout with low-fatigue activation on high-intensity football days", () => {
    const workout = generateProgramWorkout(new Date("2026-10-23T09:00:00.000Z"), { ...green, status: "yellow", reasonCodes: ["FOOTBALL_HIGH_INTENSITY_DAY"] }, profile("advanced"));
    expect(workout).toMatchObject({ title: "Football-day activation", rounds: 2, estimatedMinutes: 12 });
    expect(workout.reasonCodes).toContain("FOOTBALL_ACTIVATION");
    expect(workout.exercises.every((item) => item.loadKg === null)).toBe(true);
  });
});
