import { generateNoviceWorkout } from "@bellgrinda/training-engine";
import type { ExercisePrescription } from "@bellgrinda/domain";

export const movementCues: Record<string, string[]> = {
  "db-sumo-squat": ["Stand wide with your toes turned slightly out and hold one dumbbell vertically between your legs.", "Sit your hips down while keeping your chest tall and knees tracking over your toes.", "Drive through your whole foot to stand. Use a lighter load if your back rounds."],
  "db-bulgarian-split-squat": ["Stand a comfortable stride in front of a stable bench and rest the top of your rear foot on it.", "Hold one dumbbell at your chest or side and lower straight down through the front leg.", "Drive through the front foot to stand. Use support or bodyweight until your balance is steady."],
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
  ,"bodyweight-squat": ["Stand with your feet in a comfortable squat stance.", "Sit down between your hips while keeping your heels grounded.", "Stand smoothly and keep the knees tracking over the feet."]
  ,"tempo-push-up": ["Keep a straight line from head to heel.", "Lower for three controlled seconds and pause without relaxing.", "Press up smoothly; stop when the tempo or body line changes."]
  ,"push-up-progression": ["Use the prescribed hand and foot position.", "Keep the ribs and pelvis stacked through the full repetition.", "Choose the easier variation if range or control shortens."]
  ,"loaded-reverse-lunge": ["Hold the bell close and brace before stepping back.", "Lower under control with the front foot fully planted.", "Drive through the front leg without twisting toward the load."]
  ,"suitcase-march": ["Stand tall with the bell held at one side.", "March slowly without leaning or letting the bell pull you sideways.", "Keep quiet feet and switch sides after the prescribed steps."]
  ,"decline-push-up": ["Place your feet on a stable, low support.", "Brace into one straight line and lower your chest between the hands.", "Press evenly; reduce the elevation if your hips sag or shoulders pinch."]
  ,"athletic-push-up": ["Begin from a stable push-up position.", "Press with intent while keeping the trunk braced.", "Use a normal push-up if you cannot land softly in the same hand position."]
  ,"front-rack-lunge": ["Settle the bell securely in the rack position.", "Step back and lower without rotating or leaning.", "Push through the front foot, finish tall, then change sides."]
  ,"floor-press": ["Lie down with the bell held securely beside the chest.", "Keep the wrist stacked and upper arm controlled on the floor.", "Press over the shoulder, then lower slowly before changing sides."]
  ,"plank-shoulder-tap": ["Set a firm plank with feet wide enough to stay stable.", "Tap the opposite shoulder without shifting the hips.", "Move slowly and shorten the set when rotation increases."]
  ,"intermediate-complex": ["Complete every movement on one side before switching.", "Reset the rack and brace between movements.", "Use a load that keeps every transition smooth and repeatable."]
  ,"front-rack-squat": ["Hold the bell securely in one-sided rack position.", "Squat between the hips without leaning away from the bell.", "Stand tall with even foot pressure, then change sides."]
  ,"kb-snatch": ["Drive the bell from a strong hinge and keep it close to the body.", "Guide the hand around the handle for a quiet overhead lockout.", "Use a clean instead if the bell strikes the wrist or the lockout is unstable."]
  ,"clean-front-squat": ["Clean the bell into a stable rack.", "Pause to own the position before squatting.", "Stand with control, then return the bell safely before the next rep."]
  ,"explosive-push-up": ["Brace hard before lowering under control.", "Press fast while keeping shoulders and hips rising together.", "Land softly; return to a regular push-up if the landing becomes heavy."]
  ,"advanced-complex": ["Complete the approved sequence without rushing transitions.", "Own each rack, squat, and overhead position before moving on.", "End the set if breathing or grip prevents clean technique."]
  ,"push-up-mechanical-drop": ["Begin with the hardest prescribed push-up variation.", "Move to the easier position only when clean reps stop.", "Keep the same body line and full controlled range throughout."]
  ,"grandmaster-complex": ["Treat the sequence as skilled practice, not a race.", "Use crisp hinges and stable rack and overhead positions.", "Stop before speed, breathing, or grip compromises a transition."]
};

const ready = { score: 100, status: "green" as const, reasonCodes: [], guidance: "" };
export type ExerciseEquipment = "kettlebell" | "dumbbell" | "bodyweight" | "skipping_rope";
export type CatalogExercise = ExercisePrescription & { equipmentType: ExerciseEquipment };

const catalog = new Map<string, ExercisePrescription>();
for (let day = 19; day <= 23; day++) {
  generateNoviceWorkout(new Date(`2026-10-${day}T12:00:00Z`), ready).exercises.forEach((exercise) => catalog.set(exercise.id, exercise));
}
generateNoviceWorkout(new Date("2026-10-19T12:00:00Z"), { ...ready, status: "red" }).exercises.forEach((exercise) => catalog.set(exercise.id, exercise));
const dumbbellExercises: CatalogExercise[] = [
  {
    id: "db-sumo-squat",
    name: "Dumbbell sumo squat",
    category: "strength",
    target: "10–12 controlled reps",
    loadKg: 15,
    note: "Use one dumbbell. Start lighter than 15 kg if you cannot keep your heels down and torso steady.",
    equipmentType: "dumbbell"
  },
  {
    id: "db-bulgarian-split-squat",
    name: "Dumbbell Bulgarian split squat",
    category: "strength",
    target: "6–8 reps per leg",
    loadKg: 15,
    note: "Use two dumbbells only if 15 kg total is controlled. Begin with bodyweight or one dumbbell for balance.",
    equipmentType: "dumbbell"
  }
];

export const exerciseCatalog: CatalogExercise[] = [
  ...[...catalog.values()].map((exercise): CatalogExercise => ({
    ...exercise,
    equipmentType: exercise.id === "skipping" ? "skipping_rope" : exercise.loadKg !== null ? "kettlebell" : "bodyweight"
  })),
  ...dumbbellExercises
];

export function getMovementCues(exercise: ExercisePrescription) {
  if (exercise.id.endsWith("-substitute")) {
    const original = exerciseCatalog.find((entry) => entry.name === exercise.name);
    return (original && movementCues[original.id]) ?? ["Move slowly within a comfortable range. Stop if discomfort remains."];
  }
  return movementCues[exercise.id] ?? ["Move slowly with control. Stop if discomfort appears."];
}
