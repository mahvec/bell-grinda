import { generateNoviceWorkout } from "@bellgrinda/training-engine";
import type { ExercisePrescription } from "@bellgrinda/domain";

export const movementCues: Record<string, string[]> = {
  "goblet-squat": ["Hold the bell close to your chest with both hands.", "Sit down between your hips, keeping your heels grounded.", "Stand tall without letting your knees collapse inward."],
  "one-arm-row": ["Hinge at the hips and support your free hand on a stable surface.", "Pull the bell toward your hip without twisting your torso.", "Lower with control. Repeat on the other side."],
  "push-up": ["Place your hands just wider than your shoulders.", "Keep a straight line from your head to your heels as you lower.", "Press the floor away. Stop before you lose that straight line."],
  "kb-deadlift": ["Place the kettlebell between your feet.", "Push your hips back, bend your knees, and grip with both hands.", "Stand through your feet. Return the bell to the floor with control."],
  "skipping": ["Stand tall with your elbows near your ribs.", "Turn the rope with your wrists and make small jumps.", "Land softly, keeping a steady, comfortable rhythm."],
  "reverse-lunge": ["Stand tall and take one foot back.", "Lower both knees while keeping your front foot grounded.", "Push through your front foot to return, then alternate legs."],
  "kb-swing": ["Use two hands. Hinge at the hips with a long, neutral back.", "Drive through your hips to let the bell float; do not lift with your arms.", "Let it return into the hinge. Stop if your lower back feels uncomfortable."],
  "kb-clean": ["Start with the bell between your feet and hinge at the hips.", "Keep the bell close as you guide it into the rack position.", "Let your hand move around the handle so the bell does not strike your wrist."],
  "overhead-press": ["Start with the bell resting in the rack position.", "Brace your trunk and press overhead without leaning back.", "Lower to the rack slowly. Repeat on the other side."],
  "dead-bug": ["Lie on your back with your arms up and knees bent above your hips.", "Extend the opposite arm and leg while keeping your back steady.", "Return slowly and switch sides. Shorten the reach if your back arches."],
  "clean-press": ["Clean the bell into a stable rack position.", "Pause, brace, then press overhead without leaning back.", "Lower to the rack, then return to the start with control."],
  "glute-bridge": ["Lie on your back with your knees bent and feet flat.", "Press through your feet to lift your hips without arching your lower back.", "Pause briefly, then lower with control."],
  "mini-complex": ["Perform one controlled deadlift, then a clean into the rack.", "Settle your stance before the overhead press.", "Return the bell with control. Complete the prescribed cycles on each side."],
  "breathing": ["Find a comfortable seated or lying position.", "Breathe gently and let your shoulders relax.", "Keep the breath easy; do not force it or hold it."],
  "cat-cow": ["Start on your hands and knees.", "Slowly round your back, then gently reverse the movement.", "Stay within a comfortable range and breathe steadily."],
  "easy-walk": ["Choose a flat, comfortable route.", "Walk at a pace where conversation feels easy.", "Keep your shoulders relaxed and your steps natural."]
};

const ready = { score: 100, status: "green" as const, reasonCodes: [], guidance: "" };
const catalog = new Map<string, ExercisePrescription>();
for (let day = 19; day <= 23; day++) {
  generateNoviceWorkout(new Date(`2026-10-${day}T12:00:00Z`), ready).exercises.forEach((exercise) => catalog.set(exercise.id, exercise));
}
generateNoviceWorkout(new Date("2026-10-19T12:00:00Z"), { ...ready, status: "red" }).exercises.forEach((exercise) => catalog.set(exercise.id, exercise));
export const exerciseCatalog = [...catalog.values()];

export function getMovementCues(exercise: ExercisePrescription) {
  if (exercise.id.endsWith("-substitute")) {
    const original = exerciseCatalog.find((entry) => entry.name === exercise.name);
    return (original && movementCues[original.id]) ?? ["Move slowly within a comfortable range. Stop if discomfort remains."];
  }
  return movementCues[exercise.id] ?? ["Move slowly with control. Stop if discomfort appears."];
}
