import { z } from "zod";

export const readinessStatusSchema = z.enum(["green", "yellow", "red"]);
export type ReadinessStatus = z.infer<typeof readinessStatusSchema>;

export const energySchema = z.enum(["high", "normal", "low", "very_low"]);
export const sleepSchema = z.enum(["good", "okay", "poor", "very_poor"]);
export const sorenessSchema = z.enum(["none", "mild", "moderate", "severe"]);
export const painSchema = z.enum(["none", "mild", "moderate", "severe"]);
export const painSeveritySchema = z.enum(["mild", "moderate", "severe"]);
export type PainSeverity = z.infer<typeof painSeveritySchema>;
export const bodyLocationSchema = z.enum(["lower_back", "shoulder", "elbow", "wrist", "hip", "knee", "ankle", "other"]);
export type BodyLocation = z.infer<typeof bodyLocationSchema>;
export const footballSchema = z.enum(["none", "recreational", "match", "high_intensity", "competition"]);

export const readinessInputSchema = z.object({
  energy: energySchema,
  sleep: sleepSchema,
  soreness: sorenessSchema,
  pain: painSchema,
  football: footballSchema
});
export type ReadinessInput = z.infer<typeof readinessInputSchema>;

export const readinessResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  status: readinessStatusSchema,
  reasonCodes: z.array(z.string()),
  guidance: z.string()
});
export type ReadinessResult = z.infer<typeof readinessResultSchema>;

export const equipmentSchema = z.enum(["kettlebell_12", "mat", "chair", "skipping_rope"]);
export type Equipment = z.infer<typeof equipmentSchema>;

export const userProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  trainingLevel: z.literal("novice"),
  phase: z.number().int().min(1).max(3),
  equipment: z.array(equipmentSchema),
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
  engineVersion: z.string()
});
export type GeneratedWorkout = z.infer<typeof generatedWorkoutSchema>;

export const exerciseLogSchema = z.object({
  exerciseId: z.string(),
  completedRounds: z.number().int().min(0),
  skipped: z.boolean(),
  actualTarget: z.string().nullable()
});

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
  status: z.enum(["active", "paused", "completed", "partial", "abandoned"]),
  currentRound: z.number().int().min(1),
  currentExerciseIndex: z.number().int().min(0),
  startedAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullable(),
  exerciseLogs: z.array(exerciseLogSchema),
  substitutions: z.array(exerciseSubstitutionLogSchema),
  painEventIds: z.array(z.string()),
  rpe: z.number().int().min(1).max(10).nullable(),
  notes: z.string()
});
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;

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
  substitutions: [],
  painEventIds: [],
  rpe: null,
  notes: ""
});
