import { describe, expect, it } from "vitest";
import { createSession, generatedWorkoutSchema, type PainEvent, type WorkoutSession } from "@bellgrinda/domain";
import { applyProgressionDecisions, evaluateProgression } from "./progression";

const workout = generatedWorkoutSchema.parse({
  id: "progression-workout", date: "2026-10-19", title: "Progression", focus: "Test", rounds: 1, estimatedMinutes: 20,
  readiness: { score: 90, status: "green", reasonCodes: [], guidance: "Train." },
  exercises: [{ id: "goblet-squat", name: "Goblet squat", category: "strength", target: "12 reps", loadKg: 12 }],
  reasonCodes: [], engineVersion: "test"
});

function exposure(id: string, { reps = 12, rpe = 6, completed = true, target = "12 reps", load = 12, readiness = "green" as "green" | "yellow" } = {}): WorkoutSession {
  const session = createSession({ ...workout, id, exercises: [{ ...workout.exercises[0]!, target, loadKg: load }], readiness: { ...workout.readiness, status: readiness } }, new Date(`2026-10-${id.padStart(2, "0")}T06:00:00.000Z`));
  session.status = "completed";
  session.completionType = "completed";
  session.completedAt = `2026-10-${id.padStart(2, "0")}T06:20:00.000Z`;
  session.rpe = rpe;
  if (completed) session.setLogs = [{ exerciseId: "goblet-squat", exerciseName: "Goblet squat", round: 1, status: "completed", plannedTarget: target, actualTarget: `${reps} reps`, actualReps: reps, plannedLoadKg: load, actualLoadKg: load, recordedAt: session.completedAt }];
  return session;
}

const evaluate = (current: WorkoutSession, history: WorkoutSession[] = [], painEvents: PainEvent[] = [], loads = [12]) => evaluateProgression({ currentSession: current, recentSessions: history, painEvents, availableLoadsKg: loads });

describe("progression engine", () => {
  it("holds until at least two stable exposures exist", () => {
    expect(evaluate(exposure("19"))[0]).toMatchObject({ decision: "hold", reasonCodes: ["MORE_DATA_REQUIRED"] });
  });

  it("adds a conservative rep after two controlled successful exposures", () => {
    const current = exposure("20");
    expect(evaluate(current, [exposure("19")])[0]).toMatchObject({ decision: "progress_reps", nextPrescription: { target: "13 reps", loadKg: 12 } });
  });

  it("tests a heavier available load only after mastering the rep ceiling", () => {
    const current = exposure("20", { reps: 15, target: "15 reps" });
    expect(evaluate(current, [exposure("19", { reps: 15, target: "15 reps" })], [], [12, 16])[0]).toMatchObject({ decision: "progress_load", nextPrescription: { target: "11 reps", loadKg: 16 } });
  });

  it("regresses repeated high-effort work before allowing progression", () => {
    const current = exposure("20", { rpe: 9 });
    expect(evaluate(current, [exposure("19", { rpe: 8 })])[0]).toMatchObject({ decision: "regress", reasonCodes: ["RPE_TOO_HIGH", "REPS_REDUCED"] });
  });

  it("lets meaningful pain override successful performance", () => {
    const current = exposure("20");
    const pain: PainEvent = { id: "pain", sessionId: current.id, exerciseId: "goblet-squat", bodyLocation: "knee", severity: "moderate", source: "workout", round: 1, notes: "", occurredAt: current.completedAt! };
    expect(evaluate(current, [exposure("19")], [pain])[0]).toMatchObject({ decision: "restrict", painOverride: true });
  });

  it("detects a high-effort rep plateau across three exposures", () => {
    const result = evaluate(exposure("21", { reps: 10, rpe: 7 }), [exposure("20", { reps: 10, rpe: 7 }), exposure("19", { reps: 10, rpe: 7 })]);
    expect(result[0]).toMatchObject({ decision: "hold", plateauType: "rep", reasonCodes: ["PLATEAU_DETECTED", "HOLD_FOR_REVIEW"] });
  });

  it("triggers a deload only when repeated high RPE combines with another recovery signal", () => {
    const current = exposure("20", { rpe: 9, completed: false, readiness: "yellow" });
    const result = evaluate(current, [exposure("19", { rpe: 8, completed: false, readiness: "yellow" })]);
    expect(result[0]).toMatchObject({ scope: "session", decision: "deload", plateauType: "recovery" });
  });

  it("applies recorded adjustments to the next generated workout", () => {
    const current = exposure("20");
    const decisions = evaluate(current, [exposure("19")]);
    const adjusted = applyProgressionDecisions(workout, decisions);
    expect(adjusted.exercises[0]).toMatchObject({ target: "13 reps", loadKg: 12 });
    expect(adjusted.engineVersion).toContain("progression-1.0.0");
  });

  it("applies a current deload ahead of lower-priority exercise progression", () => {
    const current = exposure("20", { rpe: 9, completed: false, readiness: "yellow" });
    const decisions = evaluate(current, [exposure("19", { rpe: 8, completed: false, readiness: "yellow" })]);
    const adjusted = applyProgressionDecisions({ ...workout, date: "2026-10-21", rounds: 5 }, decisions);
    expect(adjusted.rounds).toBe(3);
    expect(adjusted.reasonCodes).toContain("DELOAD_ACTIVE");
  });

  it("removes a restricted movement from the next prescription", () => {
    const current = exposure("20");
    const pain: PainEvent = { id: "pain", sessionId: current.id, exerciseId: "goblet-squat", bodyLocation: "knee", severity: "severe", source: "workout", round: 1, notes: "", occurredAt: current.completedAt! };
    const decisions = evaluate(current, [], [pain]);
    const adjusted = applyProgressionDecisions(workout, decisions);
    expect(adjusted.exercises).toEqual([expect.objectContaining({ id: "breathing", category: "recovery" })]);
  });
});
