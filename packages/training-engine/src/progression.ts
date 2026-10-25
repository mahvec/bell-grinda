import {
  getSessionCompletionPercentage,
  progressionDecisionSchema,
  type ExercisePrescription,
  type GeneratedWorkout,
  type PainEvent,
  type ProgressionDecision,
  type ProgressionDecisionType,
  type WorkoutSession
} from "@bellgrinda/domain";

export const progressionEngineVersion = "1.0.0";

type ProgressionInput = {
  currentSession: WorkoutSession;
  recentSessions: WorkoutSession[];
  painEvents: PainEvent[];
  availableLoadsKg: number[];
};

const repCeilings: Record<string, number> = {
  "goblet-squat": 15, "one-arm-row": 12, "push-up": 20, "kb-deadlift": 15,
  skipping: 80, "reverse-lunge": 10, "kb-swing": 15, "kb-clean": 8,
  "overhead-press": 8, "dead-bug": 12, "clean-press": 6, "glute-bridge": 15,
  "mini-complex": 5
};

const numberIn = (value: string) => Number(value.match(/\d+/)?.[0] ?? 0);
const replaceNumber = (value: string, next: number) => value.replace(/\d+/, String(Math.max(1, Math.round(next))));
const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
const baseExerciseId = (id: string) => id.replace(/-substitute$/, "");

function uniqueRecent(current: WorkoutSession, history: WorkoutSession[]) {
  return [...new Map([current, ...history].map((session) => [session.id, session])).values()]
    .filter((session) => ["completed", "partial"].includes(session.status))
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
}

function makeDecision(session: WorkoutSession, exercise: ExercisePrescription | null, decision: ProgressionDecisionType, details: Omit<ProgressionDecision, "id" | "sessionId" | "scope" | "exerciseId" | "exerciseName" | "decision" | "createdAt" | "engineVersion">): ProgressionDecision {
  const exerciseId = exercise?.id ?? null;
  return progressionDecisionSchema.parse({
    id: `${session.id}:${exerciseId ?? "session"}:${progressionEngineVersion}`,
    sessionId: session.id,
    scope: exercise ? "exercise" : "session",
    exerciseId,
    exerciseName: exercise?.name ?? null,
    decision,
    ...details,
    createdAt: session.completedAt ?? session.updatedAt,
    engineVersion: progressionEngineVersion
  });
}

export function evaluateProgression({ currentSession, recentSessions, painEvents, availableLoadsKg }: ProgressionInput): ProgressionDecision[] {
  const history = uniqueRecent(currentSession, recentSessions);
  const recentThree = history.slice(0, 3);
  const highRpeSessions = recentThree.filter((session) => (session.rpe ?? 0) >= 8).length;
  const lowCompletionSessions = recentThree.filter((session) => getSessionCompletionPercentage(session) < 80).length;
  const yellowSessions = recentThree.filter((session) => session.workout.readiness.status === "yellow").length;
  const deload = recentThree.length >= 2 && highRpeSessions >= 2 && (lowCompletionSessions >= 1 || yellowSessions >= 2);

  if (deload) {
    return [makeDecision(currentSession, null, "deload", {
      previousPrescription: null, nextPrescription: null,
      metrics: { relevantExposures: recentThree.length, successfulExposures: 0, completionPercentage: Math.round(average(recentThree.map(getSessionCompletionPercentage)) ?? 0), averageRpe: average(recentThree.flatMap((session) => session.rpe === null ? [] : [session.rpe])), averageActualReps: null, mildPainEvents: 0, moderatePainEvents: 0, severePainEvents: 0 },
      plateauType: "recovery", reasonCodes: ["DELOAD_TRIGGERED", "RPE_TREND_HIGH", ...(lowCompletionSessions ? ["COMPLETION_DECLINING"] : ["YELLOW_READINESS_REPEATED"])],
      explanation: "Repeated high-effort sessions plus reduced completion or recovery signals triggered a one-week volume deload.", painOverride: false
    })];
  }

  const decisions = currentSession.workout.exercises.map((exercise) => {
    const exposures = history.filter((session) => session.workout.exercises.some((item) => baseExerciseId(item.id) === baseExerciseId(exercise.id))).slice(0, 4);
    const setLogs = exposures.flatMap((session) => (session.setLogs ?? []).filter((log) => baseExerciseId(log.exerciseId) === baseExerciseId(exercise.id)));
    const completedLogs = setLogs.filter((log) => log.status === "completed");
    const actualReps = completedLogs.flatMap((log) => log.actualReps === null ? [] : [log.actualReps]);
    const rpes = exposures.flatMap((session) => session.rpe === null ? [] : [session.rpe]);
    const exposureIds = new Set(exposures.map((session) => session.id));
    const pains = painEvents.filter((event) => exposureIds.has(event.sessionId) && baseExerciseId(event.exerciseId) === baseExerciseId(exercise.id));
    const mild = pains.filter((event) => event.severity === "mild").length;
    const moderate = pains.filter((event) => event.severity === "moderate").length;
    const severe = pains.filter((event) => event.severity === "severe").length;
    const plannedSets = exposures.reduce((sum, session) => sum + session.workout.rounds, 0);
    const completion = plannedSets ? Math.round((completedLogs.length / plannedSets) * 100) : 0;
    const successful = exposures.filter((session) => {
      const completedForExercise = (session.setLogs ?? []).filter((log) => baseExerciseId(log.exerciseId) === baseExerciseId(exercise.id) && log.status === "completed").length;
      return completedForExercise >= session.workout.rounds && (session.rpe === null || session.rpe <= 7);
    }).length;
    const avgRpe = average(rpes);
    const avgReps = average(actualReps);
    const metrics = { relevantExposures: exposures.length, successfulExposures: successful, completionPercentage: Math.min(100, completion), averageRpe: avgRpe, averageActualReps: avgReps, mildPainEvents: mild, moderatePainEvents: moderate, severePainEvents: severe };
    const previousPrescription = { target: exercise.target, loadKg: exercise.loadKg };
    const reducedTarget = { target: replaceNumber(exercise.target, numberIn(exercise.target) * .8), loadKg: exercise.loadKg };
    const common = { previousPrescription, metrics, plateauType: null, painOverride: false };

    if (severe || moderate) return makeDecision(currentSession, exercise, "restrict", { ...common, nextPrescription: null, painOverride: true, reasonCodes: [severe ? "PAIN_SEVERE" : "PAIN_MODERATE", "PROGRESSION_BLOCKED"], explanation: `${exercise.name} is restricted because meaningful discomfort was reported. It will be removed until reassessed.` });
    if (mild >= 2) return makeDecision(currentSession, exercise, "regress", { ...common, nextPrescription: reducedTarget, painOverride: true, reasonCodes: ["PAIN_REPEATED", "REPS_REDUCED"], explanation: `Repeated mild discomfort blocks progression. ${exercise.name} will return with fewer reps.` });
    if (mild === 1) return makeDecision(currentSession, exercise, "hold", { ...common, nextPrescription: previousPrescription, painOverride: true, reasonCodes: ["PAIN_MONITORED"], explanation: `An isolated mild discomfort report keeps ${exercise.name} unchanged while it is monitored.` });

    const highRpe = rpes.slice(0, 3).filter((value) => value >= 8).length;
    const failedExposures = exposures.filter((session) => {
      const count = (session.setLogs ?? []).filter((log) => baseExerciseId(log.exerciseId) === baseExerciseId(exercise.id) && log.status === "completed").length;
      return count < session.workout.rounds;
    }).length;
    if (highRpe >= 2 || failedExposures >= 2) return makeDecision(currentSession, exercise, "regress", { ...common, nextPrescription: reducedTarget, plateauType: highRpe >= 2 ? "recovery" : "consistency", reasonCodes: [highRpe >= 2 ? "RPE_TOO_HIGH" : "REPEATED_REP_FAILURE", "REPS_REDUCED"], explanation: `${exercise.name} has been repeatedly too demanding or incomplete, so the next target is reduced conservatively.` });
    if (exposures.length >= 3 && actualReps.length >= 3 && Math.max(...actualReps) - Math.min(...actualReps) <= 1 && (avgRpe ?? 0) >= 7) return makeDecision(currentSession, exercise, "hold", { ...common, nextPrescription: previousPrescription, plateauType: "rep", reasonCodes: ["PLATEAU_DETECTED", "HOLD_FOR_REVIEW"], explanation: `${exercise.name} has shown no rep improvement across three exposures while effort remains high. Hold and review recovery before progressing.` });

    if (successful >= 2 && (avgRpe === null || avgRpe <= 6)) {
      const currentTarget = numberIn(exercise.target);
      const ceiling = repCeilings[baseExerciseId(exercise.id)] ?? currentTarget + 3;
      if ((avgReps ?? currentTarget) >= ceiling && exercise.loadKg !== null) {
        const heavier = [...new Set(availableLoadsKg)].sort((a, b) => a - b).find((load) => load > exercise.loadKg!);
        if (heavier) return makeDecision(currentSession, exercise, "progress_load", { ...common, nextPrescription: { target: replaceNumber(exercise.target, ceiling * .75), loadKg: heavier }, reasonCodes: ["REP_TARGET_MASTERED", "LOAD_TRIAL_ELIGIBLE"], explanation: `${exercise.name} reached its rep ceiling with controlled effort. Test ${heavier} kg at a reduced target.` });
        return makeDecision(currentSession, exercise, "hold", { ...common, nextPrescription: previousPrescription, plateauType: "equipment", reasonCodes: ["REP_TARGET_MASTERED", "EQUIPMENT_LIMIT"], explanation: `${exercise.name} reached its current ceiling, but no approved heavier load is available. Hold while a variation strategy is reviewed.` });
      }
      if (currentTarget > 0 && currentTarget < ceiling) return makeDecision(currentSession, exercise, "progress_reps", { ...common, nextPrescription: { target: replaceNumber(exercise.target, currentTarget + (exercise.category === "conditioning" ? 2 : 1)), loadKg: exercise.loadKg }, reasonCodes: ["STABLE_SUCCESS", "RPE_CONTROLLED", "REPS_INCREASED"], explanation: `${exercise.name} was completed successfully across at least two exposures with controlled effort. Add a small rep increase.` });
    }

    return makeDecision(currentSession, exercise, "hold", { ...common, nextPrescription: previousPrescription, reasonCodes: [exposures.length < 2 ? "MORE_DATA_REQUIRED" : "PRODUCTIVE_LOAD"], explanation: `${exercise.name} stays unchanged while BellGrinda gathers stable evidence for the next adjustment.` });
  });

  const progressing = decisions.filter((item) => ["progress_reps", "progress_load", "progress_variation"].includes(item.decision));
  if (progressing.length <= 1) return decisions;
  const selected = progressing.find((item) => item.decision === "progress_load") ?? progressing[0]!;
  return decisions.map((item) => progressing.includes(item) && item.id !== selected.id ? { ...item, decision: "hold", nextPrescription: item.previousPrescription, reasonCodes: ["PROGRESSION_ROTATED"], explanation: `${item.exerciseName} is ready, but progression is rotated so only one major variable advances at a time.` } : item);
}

export function applyProgressionDecisions(workout: GeneratedWorkout, decisions: ProgressionDecision[]): GeneratedWorkout {
  const candidateSessionDecision = decisions.find((decision) => decision.scope === "session");
  const decisionAge = candidateSessionDecision ? new Date(`${workout.date}T23:59:59.999Z`).getTime() - new Date(candidateSessionDecision.createdAt).getTime() : Number.POSITIVE_INFINITY;
  const latestSessionDecision = candidateSessionDecision?.decision === "deload" && decisionAge >= 0 && decisionAge <= 7 * 24 * 60 * 60 * 1000 ? candidateSessionDecision : undefined;
  const byExercise = new Map((latestSessionDecision ? [] : decisions).filter((decision) => decision.scope === "exercise" && decision.exerciseId).map((decision) => [decision.exerciseId!, decision]));
  let exercises = workout.exercises.flatMap((exercise) => {
    const decision = byExercise.get(exercise.id);
    if (!decision) return [exercise];
    if (decision.decision === "restrict") return [];
    if (!decision.nextPrescription || !["regress", "progress_reps", "progress_load"].includes(decision.decision)) return [exercise];
    return [{ ...exercise, target: decision.nextPrescription.target, loadKg: decision.nextPrescription.loadKg, note: `${exercise.note ? `${exercise.note} ` : ""}${decision.explanation}` }];
  });
  if (exercises.length === 0) exercises = [{ id: "breathing", name: "Controlled breathing", category: "recovery", target: "2 minutes", loadKg: null, note: "All scheduled movements are currently restricted. Use a recovery session and reassess before returning." }];
  if (latestSessionDecision?.decision === "deload") exercises = exercises.map((exercise) => ({ ...exercise, target: replaceNumber(exercise.target, numberIn(exercise.target) * .75) }));
  return {
    ...workout,
    exercises,
    rounds: latestSessionDecision?.decision === "deload" ? Math.max(1, workout.rounds - 2) : workout.rounds,
    estimatedMinutes: latestSessionDecision?.decision === "deload" ? Math.max(15, workout.estimatedMinutes - 10) : workout.estimatedMinutes,
    reasonCodes: [...workout.reasonCodes, ...decisions.filter((decision) => decision.decision !== "hold").flatMap((decision) => decision.reasonCodes), ...(latestSessionDecision?.decision === "deload" ? ["DELOAD_ACTIVE"] : [])],
    engineVersion: `${workout.engineVersion}+progression-${progressionEngineVersion}`
  };
}
