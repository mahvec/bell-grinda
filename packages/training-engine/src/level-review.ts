import { getSessionCompletionPercentage, levelProgressionReviewSchema, type GeneratedWorkout, type LevelProgressionReview, type PainEvent, type TrainingLevel, type UserProfile, type WorkoutSession } from "@bellgrinda/domain";
import { generateProgramWorkout } from "./programs";

const nextLevel: Partial<Record<TrainingLevel, TrainingLevel>> = { novice: "advanced_novice", advanced_novice: "intermediate" };
const average = (values: number[]) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;

export function evaluateLevelReadiness(profile: UserProfile, sessions: WorkoutSession[], painEvents: PainEvent[], now = new Date()): LevelProgressionReview {
  const proposedLevel = nextLevel[profile.trainingLevel];
  const recent = sessions.filter((session) => session.status === "completed" && !session.workout.levelTrial).sort((a, b) => b.startedAt.localeCompare(a.startedAt)).slice(0, 6);
  const rpes = recent.flatMap((session) => session.rpe === null ? [] : [session.rpe]);
  const recentAverageRpe = average(rpes);
  const completionRate = Math.round(average(recent.map(getSessionCompletionPercentage)) ?? 0);
  const recentIds = new Set(recent.map((session) => session.id));
  const safetyBlock = painEvents.some((event) => recentIds.has(event.sessionId) && ["moderate", "severe"].includes(event.severity));
  const coreGroups = [["goblet-squat", "front-rack-squat"], ["one-arm-row"], ["push-up", "tempo-push-up", "decline-push-up", "push-up-progression"]];
  const coreExposureGroups = coreGroups.filter((ids) => recent.filter((session) => (session.setLogs ?? []).some((log) => ids.includes(log.exerciseId) && log.status === "completed")).length >= 2).length;
  const blockers: string[] = [];
  if (!proposedLevel) blockers.push("Early review is available only from Novice and Advanced Novice.");
  if (recent.length < 3) blockers.push("Complete at least 3 workouts before requesting an early level review.");
  if (rpes.length < 3) blockers.push("Record RPE for at least 3 completed workouts.");
  if (recentAverageRpe !== null && recentAverageRpe > 6) blockers.push("Recent average RPE is above the early-review threshold of 6.");
  if (completionRate < 90) blockers.push("Complete at least 90% of recent prescribed work.");
  if (coreExposureGroups < 2) blockers.push("Complete at least two recent exposures across the core squat, pull, and push patterns.");
  if (safetyBlock) blockers.push("A recent moderate or severe pain report blocks a level trial.");
  const evidence = [`${recent.length} recent completed workouts analysed`, `Average RPE: ${recentAverageRpe?.toFixed(1) ?? "not enough data"}`, `Average completion: ${completionRate}%`, `${coreExposureGroups} core movement groups have repeated exposure`, safetyBlock ? "Recent pain restriction present" : "No blocking pain in analysed sessions"];
  return levelProgressionReviewSchema.parse({ id: crypto.randomUUID(), currentLevel: profile.trainingLevel, proposedLevel: proposedLevel ?? profile.trainingLevel, requestedAt: now.toISOString(), recentAverageRpe, completionRate, sessionsAnalyzed: recent.length, result: blockers.length ? "not_ready" : "trial_approved", confidence: recent.length >= 5 ? "high" : recent.length >= 3 ? "medium" : "low", evidence, blockers, trialSessionId: null, createdAt: now.toISOString() });
}

export function createLevelTrial(review: LevelProgressionReview, profile: UserProfile, date = new Date()): GeneratedWorkout {
  if (review.result !== "trial_approved") throw new Error("A level trial requires an approved review.");
  const workout = generateProgramWorkout(date, { score: 80, status: "green", reasonCodes: ["LEVEL_TRIAL"], guidance: "Use controlled technique. The trial evaluates completion, pain, and effort—not speed." }, { ...profile, trainingLevel: review.proposedLevel, phase: 1 });
  return { ...workout, id: `level-trial-${review.id}`, title: `${workout.title} — level trial`, reasonCodes: [...workout.reasonCodes, "LEVEL_TRIAL"], levelTrial: { reviewId: review.id, currentLevel: review.currentLevel, proposedLevel: review.proposedLevel } };
}

export function evaluateLevelTrial(review: LevelProgressionReview, session: WorkoutSession, painEvents: PainEvent[]): LevelProgressionReview {
  const completion = getSessionCompletionPercentage(session);
  const trialPain = painEvents.some((event) => event.sessionId === session.id && ["moderate", "severe"].includes(event.severity));
  const majorRegressions = session.substitutions.length >= 2;
  const passed = session.status === "completed" && completion >= 90 && session.rpe !== null && session.rpe >= 6 && session.rpe <= 8 && !trialPain && !majorRegressions;
  const blockers = passed ? [] : [completion < 90 ? "The trial was less than 90% complete." : "", session.rpe === null ? "The trial needs an RPE." : (session.rpe > 8 ? "Trial effort was too high for promotion." : session.rpe < 6 ? "Trial effort was too low to be a useful test." : ""), trialPain ? "Pain during the trial blocks promotion." : "", majorRegressions ? "Multiple trial substitutions indicate the next level is premature." : ""].filter(Boolean);
  return { ...review, result: passed ? "passed" : "failed", completionRate: completion, trialSessionId: session.id, evidence: [...review.evidence, `Trial completion: ${completion}%`, `Trial RPE: ${session.rpe ?? "not recorded"}`], blockers };
}
