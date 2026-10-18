import type { ExercisePrescription, GeneratedWorkout, ReadinessResult } from "@bellgrinda/domain";

const load = 12;
const exercise = (
  id: string,
  name: string,
  category: ExercisePrescription["category"],
  target: string,
  loadKg: number | null,
  note?: string,
  substitution?: string
): ExercisePrescription => ({
  id,
  name,
  category,
  target,
  loadKg,
  ...(note ? { note } : {}),
  ...(substitution ? { substitution } : {})
});

const templates: Record<number, { title: string; focus: string; exercises: ExercisePrescription[] }> = {
  1: {
    title: "Full-body strength",
    focus: "Lower-body strength and pulling control",
    exercises: [
      exercise("goblet-squat", "Goblet squat", "strength", "12 reps", load),
      exercise("one-arm-row", "One-arm row", "pull", "8 per arm", load),
      exercise("push-up", "Push-up", "push", "Up to 20 clean reps", null, "Stop before form breaks."),
      exercise("kb-deadlift", "Kettlebell deadlift", "strength", "12 reps", load),
      exercise("skipping", "Skipping rope", "conditioning", "50 skips", null)
    ]
  },
  2: {
    title: "Athletic conditioning",
    focus: "Power, movement quality, and repeatable effort",
    exercises: [
      exercise("reverse-lunge", "Reverse lunge", "strength", "6 per leg", null),
      exercise("kb-swing", "Kettlebell swing", "power", "10 reps", load, "Stop if lower-back discomfort appears.", "Kettlebell deadlift"),
      exercise("push-up", "Push-up", "push", "Up to 20 clean reps", null),
      exercise("kb-clean", "Kettlebell clean", "power", "5 per arm", load),
      exercise("skipping", "Skipping rope", "conditioning", "40 skips", null)
    ]
  },
  3: {
    title: "Upper-body strength",
    focus: "Pressing strength and chest development",
    exercises: [
      exercise("overhead-press", "One-arm overhead press", "push", "5 per arm", load),
      exercise("one-arm-row", "One-arm row", "pull", "8 per arm", load),
      exercise("push-up", "Push-up", "push", "Up to 20 clean reps", null),
      exercise("goblet-squat", "Goblet squat", "strength", "10 reps", load),
      exercise("dead-bug", "Dead bug", "core", "8 per side", null)
    ]
  },
  4: {
    title: "Power and work capacity",
    focus: "Controlled power without chasing fatigue",
    exercises: [
      exercise("clean-press", "Clean and press", "power", "4 per arm", load),
      exercise("kb-swing", "Kettlebell swing", "power", "10 reps", load, "Stop if lower-back discomfort appears.", "Glute bridge"),
      exercise("push-up", "Push-up", "push", "15 clean reps", null),
      exercise("reverse-lunge", "Reverse lunge", "strength", "6 per leg", null),
      exercise("mini-complex", "Deadlift, clean, press complex", "conditioning", "3 cycles per side", load)
    ]
  },
  5: {
    title: "Football-aware hybrid",
    focus: "Full-body quality with lower fatigue",
    exercises: [
      exercise("goblet-squat", "Goblet squat", "strength", "10 reps", load),
      exercise("one-arm-row", "One-arm row", "pull", "8 per arm", load),
      exercise("push-up", "Push-up", "push", "12 clean reps", null),
      exercise("glute-bridge", "Glute bridge", "recovery", "12 reps", null),
      exercise("dead-bug", "Dead bug", "core", "8 per side", null)
    ]
  }
};

const recoveryExercises = [
  exercise("breathing", "Controlled breathing", "recovery", "2 minutes", null),
  exercise("cat-cow", "Cat-cow", "recovery", "8 slow reps", null),
  exercise("glute-bridge", "Glute bridge", "recovery", "10 reps", null),
  exercise("dead-bug", "Dead bug", "core", "6 per side", null),
  exercise("easy-walk", "Easy walk", "recovery", "10 minutes", null)
];

export function generateNoviceWorkout(date: Date, readiness: ReadinessResult): GeneratedWorkout {
  const isoDate = date.toISOString().slice(0, 10);
  const weekday = date.getUTCDay();
  const programDay = weekday >= 1 && weekday <= 5 ? weekday : 1;
  const template = templates[programDay] ?? templates[1]!;
  const isRed = readiness.status === "red";
  const isYellow = readiness.status === "yellow";
  const footballReduction = readiness.reasonCodes.some((reason) => reason.startsWith("FOOTBALL_"));
  const rounds = isRed ? 1 : isYellow || footballReduction ? 3 : 5;

  return {
    id: `novice-${isoDate}-${readiness.status}`,
    date: isoDate,
    title: isRed ? "Recovery session" : template.title,
    focus: isRed ? "Restore movement and reassess readiness" : template.focus,
    rounds,
    estimatedMinutes: isRed ? 20 : isYellow ? 30 : 40,
    readiness,
    exercises: isRed ? recoveryExercises : template.exercises,
    reasonCodes: ["LEVEL_NOVICE", `READINESS_${readiness.status.toUpperCase()}`, ...(isYellow ? ["VOLUME_REDUCED"] : [])],
    engineVersion: "0.1.0"
  };
}
