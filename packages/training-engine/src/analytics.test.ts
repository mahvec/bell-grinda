import { describe, expect, it } from "vitest";
import { createSession, generatedWorkoutSchema, type PersonalRecord } from "@bellgrinda/domain";
import { createPerformanceSnapshot, detectSessionPersonalRecords } from "./analytics";

const workout = generatedWorkoutSchema.parse({ id: "analytics", date: "2026-10-19", title: "Analytics", focus: "Test", rounds: 1, estimatedMinutes: 20, readiness: { score: 90, status: "green", reasonCodes: [], guidance: "Train" }, exercises: [{ id: "goblet-squat", name: "Goblet squat", category: "strength", target: "10 reps", loadKg: 12 }], reasonCodes: [], engineVersion: "test" });

function finalized(id: string, reps = 10, rpe = 6) {
  const session = createSession({ ...workout, id }, new Date(`2026-10-${id}T08:00:00.000Z`));
  session.status = "completed"; session.completionType = "completed"; session.completedAt = `2026-10-${id}T08:20:00.000Z`; session.rpe = rpe;
  session.setLogs = [{ exerciseId: "goblet-squat", exerciseName: "Goblet squat", round: 1, status: "completed", plannedTarget: "10 reps", actualTarget: `${reps} reps`, actualReps: reps, plannedLoadKg: 12, actualLoadKg: 12, recordedAt: session.completedAt }];
  return session;
}

describe("progress analytics", () => {
  it("creates comparable rep and load PRs without replacing better existing records", () => {
    const session = finalized("19", 11);
    const records = detectSessionPersonalRecords(session, []);
    expect(records).toEqual(expect.arrayContaining([expect.objectContaining({ recordType: "reps_at_load", value: 11 }), expect.objectContaining({ recordType: "heaviest_load", value: 12 })]));
    const later = finalized("20", 10);
    expect(detectSessionPersonalRecords(later, records as PersonalRecord[])).toEqual([]);
  });

  it("uses rolling sessions and requires enough data for an established score", () => {
    const first = finalized("19");
    const preliminary = createPerformanceSnapshot({ sessions: [first], previousSnapshots: [], sourceSessionId: first.id });
    expect(preliminary).toMatchObject({ status: "insufficient_data", trend: "insufficient_data" });
    const sessions = ["19", "18", "17", "16", "15", "14"].map((id) => finalized(id));
    const established = createPerformanceSnapshot({ sessions, previousSnapshots: [preliminary], sourceSessionId: sessions[0]!.id });
    expect(established).toMatchObject({ status: "established", grade: expect.any(String), categoryScores: expect.objectContaining({ workCapacity: 100 }) });
  });
});
