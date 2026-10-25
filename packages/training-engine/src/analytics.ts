import {
  getSessionCompletionPercentage,
  personalRecordSchema,
  performanceSnapshotSchema,
  type Assessment,
  type PersonalRecord,
  type PerformanceSnapshot,
  type WorkoutSession
} from "@bellgrinda/domain";

const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const clamp = (value: number) => Math.round(Math.max(0, Math.min(100, value)));
const trend = (current: number, previous?: number) => previous === undefined ? "insufficient_data" as const : current - previous >= 5 ? "improving" as const : current - previous <= -5 ? "declining" as const : "stable" as const;
const baseId = (id: string) => id.replace(/-substitute$/, "");

export function detectSessionPersonalRecords(session: WorkoutSession, existing: PersonalRecord[]): PersonalRecord[] {
  if (!["completed", "partial"].includes(session.status)) return [];
  const records: PersonalRecord[] = [];
  for (const log of session.setLogs.filter((item) => item.status === "completed" && item.actualReps !== null)) {
    const exerciseId = baseId(log.exerciseId);
    const sameExercise = existing.filter((record) => record.exerciseId === exerciseId);
    const name = log.exerciseName;
    if (log.actualLoadKg !== null) {
      const sameLoad = sameExercise.filter((record) => record.recordType === "reps_at_load" && record.loadKg === log.actualLoadKg);
      const previous = sameLoad.sort((a, b) => b.value - a.value)[0];
      if (!previous || log.actualReps! > previous.value) records.push(personalRecordSchema.parse({ id: `${session.id}:${exerciseId}:reps:${log.actualLoadKg}`, category: "strength", exerciseId, exerciseName: name, variation: name, recordType: "reps_at_load", loadKg: log.actualLoadKg, value: log.actualReps, unit: "reps", date: session.completedAt ?? session.updatedAt, sessionId: session.id, assessmentId: null, previousRecordId: previous?.id ?? null }));
      const heaviest = sameExercise.filter((record) => record.recordType === "heaviest_load").sort((a, b) => b.value - a.value)[0];
      if (!heaviest || log.actualLoadKg > heaviest.value) records.push(personalRecordSchema.parse({ id: `${session.id}:${exerciseId}:load:${log.actualLoadKg}`, category: "strength", exerciseId, exerciseName: name, variation: name, recordType: "heaviest_load", loadKg: log.actualLoadKg, value: log.actualLoadKg, unit: "kg", date: session.completedAt ?? session.updatedAt, sessionId: session.id, assessmentId: null, previousRecordId: heaviest?.id ?? null }));
    } else {
      const previous = sameExercise.filter((record) => record.recordType === "max_reps").sort((a, b) => b.value - a.value)[0];
      if (!previous || log.actualReps! > previous.value) records.push(personalRecordSchema.parse({ id: `${session.id}:${exerciseId}:reps:bodyweight`, category: "bodyweight", exerciseId, exerciseName: name, variation: name, recordType: "max_reps", loadKg: null, value: log.actualReps, unit: "reps", date: session.completedAt ?? session.updatedAt, sessionId: session.id, assessmentId: null, previousRecordId: previous?.id ?? null }));
    }
  }
  return [...new Map(records.map((record) => [record.id, record])).values()];
}

export function createPerformanceSnapshot({ sessions, previousSnapshots, sourceSessionId = null, sourceAssessment }: { sessions: WorkoutSession[]; previousSnapshots: PerformanceSnapshot[]; sourceSessionId?: string | null; sourceAssessment?: Assessment | null }): PerformanceSnapshot {
  const relevant = sessions.filter((session) => ["completed", "partial"].includes(session.status)).sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 12);
  const completed = relevant.filter((session) => session.status === "completed");
  const consistency = clamp((completed.length / 12) * 100);
  const workCapacity = clamp(average(relevant.map(getSessionCompletionPercentage)));
  const plannedAndActual = relevant.flatMap((session) => session.setLogs.filter((log) => log.status === "completed" && log.actualReps !== null).map((log) => ({ actual: log.actualReps!, planned: Number(log.plannedTarget.match(/\d+/)?.[0] ?? 0) })));
  const strength = clamp(average(plannedAndActual.map((set) => set.planned ? (set.actual / set.planned) * 100 : 0)));
  const recovery = clamp(100 - Math.max(0, average(relevant.flatMap((session) => session.rpe === null ? [] : [session.rpe])) - 5) * 13 - relevant.filter((session) => session.workout.readiness.status === "red").length * 8);
  const score = clamp(consistency * .30 + strength * .30 + workCapacity * .25 + recovery * .15);
  const previous = previousSnapshots[0];
  const categoryScores = { consistency, strength, workCapacity, recovery };
  const categoryTrends = {
    consistency: trend(consistency, previous?.categoryScores.consistency), strength: trend(strength, previous?.categoryScores.strength),
    workCapacity: trend(workCapacity, previous?.categoryScores.workCapacity), recovery: trend(recovery, previous?.categoryScores.recovery)
  };
  const status = relevant.length < 2 ? "insufficient_data" as const : completed.length < 6 ? "preliminary" as const : "established" as const;
  const grade = score < 50 ? "developing" as const : score < 70 ? "competent" as const : score < 85 ? "strong" as const : "excellent" as const;
  return performanceSnapshotSchema.parse({ id: `${sourceSessionId ?? sourceAssessment?.id ?? crypto.randomUUID()}:performance`, calculatedAt: sourceAssessment?.date ?? sessions[0]?.completedAt ?? new Date().toISOString(), sourceSessionId, sourceAssessmentId: sourceAssessment?.id ?? null, overallScore: score, grade, status, trend: trend(score, previous?.overallScore), categoryScores, categoryTrends, explanation: status === "insufficient_data" ? "Log two completed or partial sessions to establish your first performance snapshot." : "This score blends recent consistency, completed work, controlled effort, and recovery. It uses a rolling session window so a single workout does not redefine your grade." });
}
