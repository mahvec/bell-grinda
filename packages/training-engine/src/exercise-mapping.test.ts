import { describe, expect, it } from "vitest";
import type { ReadinessResult, UserProfile } from "@bellgrinda/domain";
import { getEligibleMappedExercises, supplementalExerciseMappings } from "./exercise-mapping";

const now = "2026-11-03T00:00:00.000Z";
const readiness: ReadinessResult = { score: 90, status: "green", reasonCodes: [], guidance: "Train", input: { energy: "normal", sleep: "good", soreness: "none", pain: "none", football: "none", sorenessLocations: [], painLocations: [], availableMinutes: 40 } };
const profile = (overrides: Partial<UserProfile> = {}): UserProfile => ({ id: "mapping-user", name: "Test", trainingLevel: "advanced_novice", phase: 2, equipment: [], equipmentItems: [{ id: "kb-8", equipmentType: "kettlebell", weightKg: 8, quantity: 1, active: true, createdAt: now, updatedAt: now }], exerciseWorkingLoadsKg: { "kb-rdl": 8 }, createdAt: now, ...overrides });

describe("supplemental exercise mapping", () => {
  it("maps every requested exercise with deterministic eligibility data", () => {
    expect(supplementalExerciseMappings).toHaveLength(20);
    for (const mapping of supplementalExerciseMappings) {
      expect(mapping.minimumLevel).toBeTruthy();
      expect(mapping.blockedPainLocations.length).toBeGreaterThan(0);
      expect(mapping.eligibleDays.length).toBeGreaterThan(0);
      expect(mapping.eligiblePhases.length).toBeGreaterThan(0);
      expect(mapping.loadRule.requiresExerciseApproval).toBe(true);
      expect(mapping.easierVariation).toBeTruthy();
      expect(mapping.harderVariation).toBeTruthy();
    }
  });

  it("admits only level-, phase-, equipment-, and load-approved movements", () => {
    expect(getEligibleMappedExercises(profile(), readiness, 1).map((item) => item.exercise.id)).toContain("kb-rdl");
    expect(getEligibleMappedExercises(profile({ trainingLevel: "novice" }), readiness, 1).map((item) => item.exercise.id)).not.toContain("kb-rdl");
    expect(getEligibleMappedExercises(profile({ exerciseWorkingLoadsKg: {} }), readiness, 1)).toHaveLength(0);
    expect(getEligibleMappedExercises(profile({ equipmentItems: [{ id: "kb-16", equipmentType: "kettlebell", weightKg: 16, quantity: 1, active: true, createdAt: now, updatedAt: now }] }), readiness, 1)).toHaveLength(0);
  });

  it("blocks relevant pain, soreness, and match-day activity before generation", () => {
    const backPain: ReadinessResult = { ...readiness, input: { ...readiness.input!, pain: "moderate", painLocations: ["lower_back"] } };
    const soreHamstring: ReadinessResult = { ...readiness, input: { ...readiness.input!, soreness: "moderate", sorenessLocations: ["hamstring"] } };
    const matchDay: ReadinessResult = { ...readiness, input: { ...readiness.input!, football: "match" } };
    expect(getEligibleMappedExercises(profile(), backPain, 1).map((item) => item.exercise.id)).not.toContain("kb-rdl");
    expect(getEligibleMappedExercises(profile(), soreHamstring, 1).map((item) => item.exercise.id)).not.toContain("kb-rdl");
    expect(getEligibleMappedExercises(profile(), matchDay, 1)).toHaveLength(0);
  });

  it("requires approval of supplemental prerequisites for advanced chains", () => {
    const advanced = profile({ trainingLevel: "advanced", exerciseWorkingLoadsKg: { "kb-clean-rotational-press": 8, "kb-clean": 8, "overhead-press": 8 } });
    expect(getEligibleMappedExercises(advanced, readiness, 2).map((item) => item.exercise.id)).not.toContain("kb-clean-rotational-press");
    const approvedChain = profile({ trainingLevel: "advanced", exerciseWorkingLoadsKg: { "kb-clean-rotational-press": 8, "kb-clean": 8, "overhead-press": 8, "kb-rotational-swing": 8 } });
    expect(getEligibleMappedExercises(approvedChain, readiness, 2).map((item) => item.exercise.id)).toContain("kb-clean-rotational-press");
  });
});
