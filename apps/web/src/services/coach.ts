import { coachContextSchema, coachResponseSchema, getProfileEquipment, getSessionCompletionPercentage, type CoachContext, type CoachResponse, type GeneratedWorkout, type UserProfile } from "@bellgrinda/domain";
import { assessmentRepository, levelReviewRepository, performanceSnapshotRepository, progressionDecisionRepository, sessionRepository } from "../persistence/database";

const reasons: Record<string, string> = { VOLUME_REDUCED: "readiness signals reduced the planned volume", LOWER_BODY_VOLUME_REDUCED: "reported soreness reduced lower-body work", TIME_CAPPED: "the workout was shortened to fit the available training time", FOOTBALL_ACTIVATION: "football activity replaced normal training with low-fatigue activation", DELOAD_ACTIVE: "recent recovery and effort trends triggered a temporary deload", EQUIPMENT_LOADS_VALIDATED: "every prescribed load was checked against owned equipment and approved working loads" };

export function deterministicWorkoutExplanation(workout: GeneratedWorkout) {
  const adjustments = workout.reasonCodes.flatMap((code) => reasons[code] ? [reasons[code]] : []);
  return `${workout.title} focuses on ${workout.focus.toLowerCase()}. ${adjustments.length ? `BellGrinda adjusted it because ${adjustments.join(", ")}.` : "Your readiness supports the planned session."} The ${workout.rounds} rounds and exercise loads come from the deterministic readiness, equipment, safety, and progression rules.`;
}

export async function buildCoachContext(profile: UserProfile, todayWorkout?: GeneratedWorkout): Promise<CoachContext> {
  const [sessions, decisions, performanceGrade, recentAssessment, levelReview] = await Promise.all([sessionRepository.listHistory(), progressionDecisionRepository.listLatestApplicable(), performanceSnapshotRepository.latest(), assessmentRepository.latest(), levelReviewRepository.latest()]);
  return coachContextSchema.parse({ currentTrainingLevel: profile.trainingLevel, currentPhase: profile.phase, ...(todayWorkout ? { readiness: todayWorkout.readiness, todayWorkout } : {}), availableEquipment: getProfileEquipment(profile), recentSessions: sessions.slice(0, 6).map((session) => ({ id: session.id, date: session.startedAt, title: session.workout.title, status: session.status, completionPercentage: getSessionCompletionPercentage(session), rpe: session.rpe })), safetyRestrictions: decisions.filter((item) => item.painOverride || item.decision === "restrict").map((item) => ({ exerciseId: item.exerciseId, explanation: item.explanation })).slice(0, 10), ...(performanceGrade ? { performanceGrade } : {}), ...(recentAssessment ? { recentAssessment } : {}), ...(levelReview ? { levelReview } : {}) });
}

function fallback(question: string, context: CoachContext): CoachResponse {
  if (context.todayWorkout) return { answer: deterministicWorkoutExplanation(context.todayWorkout), source: "deterministic", uncertainty: false };
  const sessions = context.recentSessions;
  const rpes = sessions.flatMap((item) => item.rpe === null ? [] : [item.rpe]);
  const averageRpe = rpes.length ? rpes.reduce((sum, value) => sum + value, 0) / rpes.length : null;
  const answer = sessions.length ? `You have ${sessions.length} recent recorded sessions in this summary${averageRpe ? ` with an average recorded RPE of ${averageRpe.toFixed(1)}` : ""}. ${context.performanceGrade ? `Your current performance grade is ${context.performanceGrade.grade} with a score of ${context.performanceGrade.overallScore}.` : "BellGrinda needs more finalized sessions for an established performance grade."}` : "There is not enough recorded training history to answer confidently yet.";
  return { answer: `${answer} Question received: “${question}”`, source: "deterministic", uncertainty: !sessions.length };
}

export async function askCoach(question: string, context: CoachContext): Promise<CoachResponse> {
  const deterministic = fallback(question, context);
  if (!navigator.onLine) return { ...deterministic, answer: `BellGrinda Coach is unavailable offline. ${deterministic.answer}` };
  const baseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;
  if (!baseUrl) return deterministic;
  try {
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/ai/coach`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ question, context }) });
    if (!response.ok) return deterministic;
    const payload = await response.json() as { data?: unknown };
    return coachResponseSchema.parse(payload.data);
  } catch { return deterministic; }
}
