import { describe, expect, it } from "vitest";
import { classifyReadiness } from "./readiness";
import { generateNoviceWorkout } from "./workout-generator";

const green = classifyReadiness({ energy: "normal", sleep: "good", soreness: "none", pain: "none", football: "none" });

describe("generateNoviceWorkout", () => {
  it("is deterministic for identical inputs", () => {
    const date = new Date("2026-10-19T08:00:00.000Z");
    expect(generateNoviceWorkout(date, green)).toEqual(generateNoviceWorkout(date, green));
  });

  it("generates the Monday Novice template", () => {
    const result = generateNoviceWorkout(new Date("2026-10-19T08:00:00.000Z"), green);
    expect(result).toMatchObject({ title: "Full-body strength", rounds: 5, estimatedMinutes: 40 });
    expect(result.exercises).toHaveLength(5);
  });

  it("replaces normal training with recovery on red readiness", () => {
    const red = classifyReadiness({ energy: "normal", sleep: "good", soreness: "none", pain: "severe", football: "none" });
    const result = generateNoviceWorkout(new Date("2026-10-19T08:00:00.000Z"), red);
    expect(result.title).toBe("Recovery session");
    expect(result.rounds).toBe(1);
    expect(result.exercises.every((item) => item.loadKg === null)).toBe(true);
  });
});
