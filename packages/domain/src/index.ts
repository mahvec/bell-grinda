import { z } from "zod";

export const readinessStatusSchema = z.enum(["green", "yellow", "red"]);
export type ReadinessStatus = z.infer<typeof readinessStatusSchema>;

export const energySchema = z.enum(["high", "normal", "low", "very_low"]);
export const sleepSchema = z.enum(["excellent", "good", "okay", "poor", "very_poor"]);
export const sorenessSchema = z.enum(["none", "mild", "moderate", "severe"]);
export const painSchema = z.enum(["none", "mild", "moderate", "severe"]);
export const painSeveritySchema = z.enum(["mild", "moderate", "severe"]);
export type PainSeverity = z.infer<typeof painSeveritySchema>;
export const bodyLocationSchema = z.enum(["neck", "chest", "upper_back", "lower_back", "shoulder", "elbow", "wrist", "hip", "quadriceps", "hamstring", "knee", "calf", "ankle", "other"]);
export type BodyLocation = z.infer<typeof bodyLocationSchema>;
export const footballSchema = z.enum(["none", "recreational", "match", "high_intensity", "competition"]);
export const motivationSchema = z.enum(["low", "normal", "good", "very_motivated"]);

export const readinessInputSchema = z.object({
  energy: energySchema,
  sleep: sleepSchema,
  soreness: sorenessSchema,
  pain: painSchema,
  football: footballSchema,
  sorenessLocations: z.array(bodyLocationSchema).default([]),
  painLocations: z.array(bodyLocationSchema).default([]),
  motivation: motivationSchema.optional(),
  availableMinutes: z.union([z.literal(20), z.literal(30), z.literal(40), z.literal(45)]).default(40)
});
export type ReadinessInput = z.infer<typeof readinessInputSchema>;
export type ReadinessInputSubmission = z.input<typeof readinessInputSchema>;

export const readinessResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  status: readinessStatusSchema,
  reasonCodes: z.array(z.string()),
  guidance: z.string(),
  input: readinessInputSchema.optional()
});
export type ReadinessResult = z.infer<typeof readinessResultSchema>;
export const dailyReadinessRecordSchema = z.object({ id: z.string(), date: z.string(), input: readinessInputSchema, result: readinessResultSchema, createdAt: z.string() });
export type DailyReadinessRecord = z.infer<typeof dailyReadinessRecordSchema>;

export const equipmentSchema = z.enum(["kettlebell_12", "dumbbell", "mat", "chair", "skipping_rope"]);
export type Equipment = z.infer<typeof equipmentSchema>;

export const userEquipmentTypeSchema = z.enum(["kettlebell", "dumbbell", "rope", "mat", "bench"]);
export const userEquipmentSchema = z.object({
  id: z.string(),
  equipmentType: userEquipmentTypeSchema,
  weightKg: z.number().positive().max(200).optional(),
  quantity: z.number().int().positive().max(20),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string()
});
export type UserEquipment = z.infer<typeof userEquipmentSchema>;

export const trainingLevelSchema = z.enum(["novice", "advanced_novice", "intermediate", "advanced", "grandmaster"]);
export type TrainingLevel = z.infer<typeof trainingLevelSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  trainingLevel: trainingLevelSchema,
  phase: z.number().int().min(1).max(3),
  equipment: z.array(equipmentSchema),
  equipmentItems: z.array(userEquipmentSchema).optional(),
  exerciseWorkingLoadsKg: z.record(z.string(), z.number().positive().max(200)).optional(),
  defaultKettlebellKg: z.number().positive().max(200).optional(),
  defaultDumbbellKg: z.number().positive().max(200).optional(),
  createdAt: z.string()
});
export type UserProfile = z.infer<typeof userProfileSchema>;

export const exercisePrescriptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(["strength", "power", "push", "pull", "conditioning", "core", "recovery"]),
  target: z.string(),
  loadKg: z.number().nullable(),
  note: z.string().optional(),
  substitution: z.string().optional()
});
export type ExercisePrescription = z.infer<typeof exercisePrescriptionSchema>;

export const exerciseMediaSchema = z.object({
  exerciseId: z.string(),
  source: z.enum(["pexels", "wger", "wikimedia"]),
  sourceId: z.string(),
  sourcePageUrl: z.string().url(),
  creator: z.string().min(1),
  licenseName: z.string().min(1),
  licenseUrl: z.string().url(),
  videoUrl: z.union([z.string().url(), z.string().regex(/^\/media\/[a-z0-9-]+\.mp4$/)]),
  posterUrl: z.union([z.string().url(), z.string().regex(/^\/media\/[a-z0-9-]+\.webp$/)]).optional(),
  format: z.literal("live-action"),
  framing: z.literal("full-body"),
  durationSeconds: z.number().int().positive(),
  reviewedAt: z.string().datetime(),
  reviewNote: z.string().min(1),
  coachingNote: z.string().min(1).optional()
});
export type ExerciseMedia = z.infer<typeof exerciseMediaSchema>;

export const generatedWorkoutSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  focus: z.string(),
  rounds: z.number().int().positive(),
  estimatedMinutes: z.number().int().positive(),
  readiness: readinessResultSchema,
  exercises: z.array(exercisePrescriptionSchema),
  reasonCodes: z.array(z.string()),
  engineVersion: z.string(),
  levelTrial: z.object({ reviewId: z.string(), currentLevel: trainingLevelSchema, proposedLevel: trainingLevelSchema }).optional()
});
export type GeneratedWorkout = z.infer<typeof generatedWorkoutSchema>;

export const exerciseLogSchema = z.object({
  exerciseId: z.string(),
  completedRounds: z.number().int().min(0),
  skipped: z.boolean(),
  actualTarget: z.string().nullable()
});

export const exerciseSetLogSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  round: z.number().int().positive(),
  status: z.enum(["completed", "skipped"]),
  plannedTarget: z.string(),
  actualTarget: z.string().nullable(),
  actualReps: z.number().int().min(0).nullable(),
  plannedLoadKg: z.number().nullable(),
  actualLoadKg: z.number().min(0).nullable(),
  recordedAt: z.string()
});
export type ExerciseSetLog = z.infer<typeof exerciseSetLogSchema>;

export const painEventSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  exerciseId: z.string(),
  bodyLocation: bodyLocationSchema,
  severity: painSeveritySchema,
  source: z.literal("workout"),
  round: z.number().int().positive(),
  notes: z.string(),
  occurredAt: z.string()
});
export type PainEvent = z.infer<typeof painEventSchema>;

export const exerciseSubstitutionLogSchema = z.object({
  exerciseId: z.string(),
  substituteName: z.string(),
  reason: z.literal("pain"),
  round: z.number().int().positive(),
  occurredAt: z.string()
});

export const workoutSessionSchema = z.object({
  id: z.string(),
  workout: generatedWorkoutSchema,
  status: z.enum(["active", "paused", "review_pending", "completed", "partial", "abandoned"]),
  currentRound: z.number().int().min(1),
  currentExerciseIndex: z.number().int().min(0),
  startedAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable(),
  exerciseLogs: z.array(exerciseLogSchema),
  setLogs: z.array(exerciseSetLogSchema).default([]),
  substitutions: z.array(exerciseSubstitutionLogSchema),
  painEventIds: z.array(z.string()),
  rpe: z.number().int().min(1).max(10).nullable(),
  notes: z.string(),
  completionType: z.enum(["completed", "partial", "abandoned"]).nullable().default(null),
  endReason: z.string().default(""),
  durationSeconds: z.number().int().min(0).nullable().default(null),
  sessionSchemaVersion: z.number().int().positive().default(2)
});
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;

export const progressionDecisionTypeSchema = z.enum(["recover", "restrict", "regress", "hold", "progress_reps", "progress_load", "progress_variation", "deload"]);
export type ProgressionDecisionType = z.infer<typeof progressionDecisionTypeSchema>;

const progressionPrescriptionSchema = z.object({
  target: z.string(),
  loadKg: z.number().nullable()
});

export const progressionDecisionSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  scope: z.enum(["session", "exercise"]),
  exerciseId: z.string().nullable(),
  exerciseName: z.string().nullable(),
  decision: progressionDecisionTypeSchema,
  previousPrescription: progressionPrescriptionSchema.nullable(),
  nextPrescription: progressionPrescriptionSchema.nullable(),
  metrics: z.object({
    relevantExposures: z.number().int().min(0),
    successfulExposures: z.number().int().min(0),
    completionPercentage: z.number().min(0).max(100),
    averageRpe: z.number().min(1).max(10).nullable(),
    averageActualReps: z.number().min(0).nullable(),
    mildPainEvents: z.number().int().min(0),
    moderatePainEvents: z.number().int().min(0),
    severePainEvents: z.number().int().min(0)
  }),
  plateauType: z.enum(["rep", "load", "recovery", "equipment", "consistency"]).nullable(),
  reasonCodes: z.array(z.string()),
  explanation: z.string().min(1),
  painOverride: z.boolean(),
  createdAt: z.string(),
  engineVersion: z.string()
});
export type ProgressionDecision = z.infer<typeof progressionDecisionSchema>;

export const assessmentSchema = z.object({
  id: z.string(),
  date: z.string(),
  type: z.enum(["baseline", "biweekly"]),
  bodyweightKg: z.number().positive().nullable(),
  waistCm: z.number().positive().nullable(),
  chestCm: z.number().positive().nullable(),
  maxStandardPushups: z.number().int().min(0).nullable(),
  notes: z.string().max(1000),
  createdAt: z.string()
});
export type Assessment = z.infer<typeof assessmentSchema>;

export const personalRecordSchema = z.object({
  id: z.string(),
  category: z.enum(["strength", "bodyweight"]),
  exerciseId: z.string(),
  exerciseName: z.string(),
  variation: z.string(),
  recordType: z.enum(["reps_at_load", "heaviest_load", "max_reps"]),
  loadKg: z.number().nullable(),
  value: z.number().min(0),
  unit: z.string(),
  date: z.string(),
  sessionId: z.string().nullable(),
  assessmentId: z.string().nullable(),
  previousRecordId: z.string().nullable()
});
export type PersonalRecord = z.infer<typeof personalRecordSchema>;

export const performanceTrendSchema = z.enum(["improving", "stable", "declining", "insufficient_data"]);
export type PerformanceTrend = z.infer<typeof performanceTrendSchema>;
export const performanceSnapshotSchema = z.object({
  id: z.string(),
  calculatedAt: z.string(),
  sourceSessionId: z.string().nullable(),
  sourceAssessmentId: z.string().nullable(),
  overallScore: z.number().min(0).max(100),
  grade: z.enum(["developing", "competent", "strong", "excellent"]),
  status: z.enum(["insufficient_data", "preliminary", "established"]),
  trend: performanceTrendSchema,
  categoryScores: z.object({ consistency: z.number().min(0).max(100), strength: z.number().min(0).max(100), workCapacity: z.number().min(0).max(100), recovery: z.number().min(0).max(100) }),
  categoryTrends: z.object({ consistency: performanceTrendSchema, strength: performanceTrendSchema, workCapacity: performanceTrendSchema, recovery: performanceTrendSchema }),
  explanation: z.string()
});
export type PerformanceSnapshot = z.infer<typeof performanceSnapshotSchema>;

export const levelReviewResultSchema = z.enum(["not_ready", "trial_approved", "passed", "failed"]);
export const levelProgressionReviewSchema = z.object({
  id: z.string(),
  currentLevel: trainingLevelSchema,
  proposedLevel: trainingLevelSchema,
  requestedAt: z.string(),
  recentAverageRpe: z.number().min(1).max(10).nullable(),
  completionRate: z.number().min(0).max(100),
  sessionsAnalyzed: z.number().int().min(0),
  result: levelReviewResultSchema,
  confidence: z.enum(["low", "medium", "high"]),
  evidence: z.array(z.string()),
  blockers: z.array(z.string()),
  trialSessionId: z.string().nullable(),
  createdAt: z.string()
});
export type LevelProgressionReview = z.infer<typeof levelProgressionReviewSchema>;

export const levelHistoryEntrySchema = z.object({
  id: z.string(),
  previousLevel: trainingLevelSchema,
  newLevel: trainingLevelSchema,
  changedAt: z.string(),
  reviewId: z.string().nullable(),
  recentAverageRpe: z.number().min(1).max(10).nullable(),
  reason: z.string(),
  progressionType: z.enum(["scheduled", "early"])
});
export type LevelHistoryEntry = z.infer<typeof levelHistoryEntrySchema>;

export const coachContextSchema = z.object({
  currentTrainingLevel: trainingLevelSchema,
  currentPhase: z.number().int().min(1).max(3),
  readiness: readinessResultSchema.optional(),
  availableEquipment: z.array(userEquipmentSchema),
  todayWorkout: generatedWorkoutSchema.optional(),
  recentSessions: z.array(z.object({ id: z.string(), date: z.string(), title: z.string(), status: z.string(), completionPercentage: z.number(), rpe: z.number().nullable() })).max(6),
  safetyRestrictions: z.array(z.object({ exerciseId: z.string().nullable(), explanation: z.string() })).max(10),
  performanceGrade: performanceSnapshotSchema.optional(),
  recentAssessment: assessmentSchema.optional(),
  levelReview: levelProgressionReviewSchema.optional()
});
export type CoachContext = z.infer<typeof coachContextSchema>;

export const coachRequestSchema = z.object({
  question: z.string().min(1).max(500),
  context: coachContextSchema
});
export const coachResponseSchema = z.object({ answer: z.string().min(1), source: z.enum(["ai", "deterministic"]), uncertainty: z.boolean() });
export type CoachResponse = z.infer<typeof coachResponseSchema>;

export function getProfileEquipment(profile: UserProfile): UserEquipment[] {
  if (profile.equipmentItems?.length) return profile.equipmentItems.filter((item) => item.active);
  const now = profile.createdAt;
  return profile.equipment.map((item) => ({
    id: `legacy-${item}`,
    equipmentType: item === "kettlebell_12" ? "kettlebell" as const : item === "skipping_rope" ? "rope" as const : item === "chair" ? "bench" as const : item,
    ...(item === "kettlebell_12" ? { weightKg: profile.defaultKettlebellKg ?? 12 } : item === "dumbbell" ? { weightKg: profile.defaultDumbbellKg ?? 15 } : {}),
    quantity: 1,
    active: true,
    createdAt: now,
    updatedAt: now
  }));
}

export function getAvailableKettlebellLoads(profile: UserProfile) {
  return [...new Set(getProfileEquipment(profile).filter((item) => item.equipmentType === "kettlebell" && item.weightKg).map((item) => item.weightKg!))].sort((a, b) => a - b);
}

export const createSession = (workout: GeneratedWorkout, now = new Date()): WorkoutSession => ({
  id: crypto.randomUUID(),
  workout,
  status: "active",
  currentRound: 1,
  currentExerciseIndex: 0,
  startedAt: now.toISOString(),
  updatedAt: now.toISOString(),
  completedAt: null,
  exerciseLogs: workout.exercises.map((exercise) => ({
    exerciseId: exercise.id,
    completedRounds: 0,
    skipped: false,
    actualTarget: null
  })),
  setLogs: [],
  substitutions: [],
  painEventIds: [],
  rpe: null,
  notes: "",
  completionType: null,
  endReason: "",
  durationSeconds: null,
  sessionSchemaVersion: 2
});

export function getSessionCompletedSets(session: WorkoutSession) {
  if ((session.setLogs ?? []).length > 0) return session.setLogs.filter((log) => log.status === "completed").length;
  return session.exerciseLogs.reduce((sum, log) => sum + log.completedRounds, 0);
}

export function getSessionSkippedSets(session: WorkoutSession) {
  return (session.setLogs ?? []).filter((log) => log.status === "skipped").length;
}

export function getSessionCompletionPercentage(session: WorkoutSession) {
  const planned = session.workout.rounds * session.workout.exercises.length;
  return planned === 0 ? 0 : Math.round((getSessionCompletedSets(session) / planned) * 100);
}

export function getSessionDurationSeconds(session: WorkoutSession, end = new Date()) {
  if (session.durationSeconds !== null && session.durationSeconds !== undefined) return session.durationSeconds;
  const endTime = session.completedAt ? new Date(session.completedAt) : end;
  return Math.max(0, Math.round((endTime.getTime() - new Date(session.startedAt).getTime()) / 1000));
}
