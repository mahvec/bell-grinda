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
  it("uses owned exercise-specific loads without automatically selecting the heaviest bell", () => {
    const now = "2026-10-01T00:00:00.000Z";
    const equipped: UserProfile = { ...profile("novice"), defaultKettlebellKg: 12, equipmentItems: [12, 16, 20].map((weightKg) => ({ id: `kb-${weightKg}`, equipmentType: "kettlebell", weightKg, quantity: weightKg === 12 ? 2 : 1, active: true, createdAt: now, updatedAt: now })), exerciseWorkingLoadsKg: { "goblet-squat": 16, "one-arm-row": 16, "overhead-press": 12 } };
    const monday = generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), green, equipped);
    expect(monday.exercises.find((item) => item.id === "goblet-squat")?.loadKg).toBe(16);
    expect(monday.exercises.find((item) => item.id === "one-arm-row")?.loadKg).toBe(16);
    expect(monday.exercises.find((item) => item.id === "kb-deadlift")?.loadKg).toBe(12);
    expect(monday.exercises.every((item) => item.loadKg === null || [12, 16, 20].includes(item.loadKg))).toBe(true);
  });
  it("never upgrades an unavailable approved working load to a heavier owned bell", () => {
    const now = "2026-10-01T00:00:00.000Z";
    const equipped: UserProfile = { ...profile("novice"), defaultKettlebellKg: 16, equipmentItems: [{ id: "kb-16", equipmentType: "kettlebell", weightKg: 16, quantity: 1, active: true, createdAt: now, updatedAt: now }], exerciseWorkingLoadsKg: { "overhead-press": 12 } };
    const workout = generateProgramWorkout(new Date("2026-10-21T09:00:00.000Z"), green, equipped);
    expect(workout.exercises.find((item) => item.id === "overhead-press")).toMatchObject({ loadKg: null, note: expect.stringContaining("No owned kettlebell is approved") });
  });
  it("caps workout duration and reduces sore lower-body work from structured readiness", () => {
    const readiness = { ...green, reasonCodes: ["READINESS_MODERATE_SORENESS", "READINESS_LOWER_BODY_SORENESS", "TIME_LIMIT_20"], input: { energy: "normal" as const, sleep: "good" as const, soreness: "moderate" as const, pain: "none" as const, football: "none" as const, sorenessLocations: ["knee" as const], painLocations: [], availableMinutes: 20 as const } };
    const workout = generateProgramWorkout(new Date("2026-10-19T09:00:00.000Z"), readiness, profile("novice"));
    expect(workout).toMatchObject({ rounds: 2, estimatedMinutes: 20 });
    expect(workout.reasonCodes).toEqual(expect.arrayContaining(["LOWER_BODY_VOLUME_REDUCED", "TIME_CAPPED"]));
    expect(workout.exercises.find((item) => item.id === "goblet-squat")?.note).toContain("soreness");
  });
});
