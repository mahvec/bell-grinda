import { generateNoviceWorkout, supplementalExerciseMappings } from "@bellgrinda/training-engine";
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
  ,"kb-halo": ["Hold a light bell by the horns in front of your chest.", "Circle it slowly around your head without pushing your head forward.", "Keep your ribs down and reverse direction after each set."]
  ,"kb-thruster": ["Start with the bell secure at your chest or in the rack position.", "Squat with your whole foot grounded, then drive up smoothly.", "Use the leg drive to press overhead; finish without leaning back."]
  ,"kb-single-leg-clean": ["Master the regular clean and single-leg hinge before trying this variation.", "Balance on one leg, hinge with a long spine, and keep the bell close.", "Drive through the standing foot and guide the bell softly into the rack. Stop if balance breaks down."]
  ,"kb-biceps-curl": ["Stand tall and hold the bell by the horns or use one hand on the handle.", "Keep your elbows close to your ribs as you curl.", "Lower slowly without leaning back or swinging the bell."]
  ,"kb-hammer-curl": ["Hold the bell with a neutral grip and begin with a very light load.", "Keep the upper arm still while bending the elbow.", "Pause under control, then lower without letting the wrist collapse."]
  ,"zottman-curl": ["Use light kettlebells or dumbbells and curl with palms facing up.", "At the top, rotate the forearms until the palms face down.", "Lower slowly with straight wrists, then reset the grip at the bottom."]
  ,"kb-russian-twist": ["Sit tall with knees bent and begin with your heels on the floor.", "Hold a light bell close, brace, and lean back only as far as you can control.", "Rotate the ribcage slowly from side to side; stop if your lower back feels strained."]
  ,"kb-windmill": ["Learn the unloaded windmill before holding a bell overhead.", "Turn the feet slightly, keep the loaded shoulder stacked, and push the hip away.", "Hinge within your available range while watching the bell; return without twisting the knee."]
  ,"kb-side-bend": ["Hold a light bell at one side and stand evenly through both feet.", "Slide the bell a short distance down the outside of the leg without leaning forward.", "Use the opposite side of your trunk to return tall; do not chase extra range."]
  ,"kb-figure-eight": ["Use a light bell and settle into a shallow squat with a long spine.", "Pass the handle behind one leg to the other hand, then circle around the other leg.", "Move slowly until every handoff is secure; keep the bell away from your knees."]
  ,"kb-rotational-swing": ["Master the two-hand swing before adding rotation or a pivot.", "Drive the bell with the hips and let the feet pivot together with the torso.", "Keep the bell controlled and stop if the knees or lower back twist independently."]
  ,"kb-hip-shift": ["Hold a light bell as a counterbalance and take a comfortable wide stance.", "Shift the hips toward one side while keeping both feet grounded.", "Move only through a pain-free range and return through the centre before changing sides."]
  ,"kb-clean-rotational-press": ["Master the clean, press, and unloaded pivot separately first.", "Clean the bell to a stable rack, then turn the hips and feet together.", "Press along the new direction without twisting through the knee or lower back."]
  ,"kb-suitcase-deadlift": ["Set the bell outside one foot and brace before reaching down.", "Hinge and bend the knees while keeping shoulders and hips level.", "Stand without leaning away from the bell, then lower it to the same spot with control."]
  ,"kb-woodchop": ["Use a light bell and practise the diagonal path before adding speed.", "Move the shoulders, ribs, hips, and pivoting foot together across the body.", "Control the return. Use the standing version before progressing to half-kneeling."]
  ,"kb-rdl": ["Hold the bell close and soften your knees.", "Push the hips back with a long spine until the hamstrings limit the hinge.", "Drive the hips forward to stand; do not reach the bell toward the floor by rounding."]
  ,"kb-single-leg-rdl": ["Stand on one leg with a soft knee and use support while learning.", "Reach the free leg back as the torso hinges, keeping the hips square.", "Press through the standing foot to return; shorten the range when balance changes."]
  ,"kb-kickstand-deadlift": ["Place most of your weight on the front foot and use the rear toes as a kickstand.", "Keep the hips square and hinge over the working leg.", "Stand by driving through the front foot; the rear leg assists balance, not the lift."]
  ,"kb-good-morning": ["Secure a light bell at your chest or upper back position shown in the guide.", "Soften the knees, brace, and push the hips back.", "Stop at a controlled hamstring stretch and squeeze the glutes to stand tall."]
  ,"kb-glute-bridge": ["Lie down, place the bell securely across the hips, and keep both hands on it.", "Drive through the feet and lift until the hips are straight without arching the back.", "Lower slowly. Earn the single-leg variation first and keep the pelvis level when progressing."]
};

export type ExerciseMuscles = { primary: string[]; supporting: string[] };

export const exerciseMuscles: Record<string, ExerciseMuscles> = {
  "db-sumo-squat": { primary: ["Quadriceps", "Glutes", "Inner thighs"], supporting: ["Hamstrings", "Core"] },
  "db-bulgarian-split-squat": { primary: ["Quadriceps", "Glutes"], supporting: ["Hamstrings", "Inner thighs", "Core"] },
  "goblet-squat": { primary: ["Quadriceps", "Glutes"], supporting: ["Inner thighs", "Hamstrings", "Core", "Upper back"] },
  "one-arm-row": { primary: ["Lats", "Upper back"], supporting: ["Biceps", "Rear shoulders", "Forearms", "Core"] },
  "push-up": { primary: ["Chest", "Triceps"], supporting: ["Front shoulders", "Core"] },
  "kb-deadlift": { primary: ["Glutes", "Hamstrings"], supporting: ["Quadriceps", "Lower back", "Core", "Forearms"] },
  "skipping": { primary: ["Calves", "Cardiovascular system"], supporting: ["Quadriceps", "Hamstrings", "Shoulders", "Core"] },
  "reverse-lunge": { primary: ["Quadriceps", "Glutes"], supporting: ["Hamstrings", "Calves", "Core"] },
  "kb-swing": { primary: ["Glutes", "Hamstrings"], supporting: ["Core", "Lats", "Lower back", "Forearms"] },
  "kb-clean": { primary: ["Glutes", "Hamstrings", "Upper back"], supporting: ["Quadriceps", "Shoulders", "Biceps", "Forearms", "Core"] },
  "overhead-press": { primary: ["Shoulders", "Triceps"], supporting: ["Upper chest", "Core", "Upper back"] },
  "dead-bug": { primary: ["Deep core", "Abdominals"], supporting: ["Hip flexors"] },
  "clean-press": { primary: ["Glutes", "Hamstrings", "Shoulders", "Triceps"], supporting: ["Quadriceps", "Upper back", "Core", "Forearms"] },
  "glute-bridge": { primary: ["Glutes"], supporting: ["Hamstrings", "Deep core"] },
  "mini-complex": { primary: ["Glutes", "Hamstrings", "Shoulders"], supporting: ["Quadriceps", "Upper back", "Triceps", "Core", "Forearms"] },
  "breathing": { primary: ["Diaphragm", "Deep core"], supporting: ["Rib-cage muscles", "Pelvic floor"] },
  "cat-cow": { primary: ["Spinal mobility", "Abdominals"], supporting: ["Upper back", "Lower back", "Shoulders"] },
  "easy-walk": { primary: ["Quadriceps", "Glutes", "Calves"], supporting: ["Hamstrings", "Core", "Cardiovascular system"] },
  "kb-halo": { primary: ["Shoulders", "Upper back"], supporting: ["Triceps", "Forearms", "Core"] },
  "kb-thruster": { primary: ["Quadriceps", "Glutes", "Shoulders"], supporting: ["Hamstrings", "Triceps", "Upper chest", "Core"] },
  "kb-single-leg-clean": { primary: ["Glutes", "Hamstrings", "Upper back"], supporting: ["Quadriceps", "Calves", "Shoulders", "Forearms", "Core"] },
  "kb-biceps-curl": { primary: ["Biceps"], supporting: ["Forearms", "Grip"] },
  "kb-hammer-curl": { primary: ["Brachialis", "Biceps"], supporting: ["Brachioradialis", "Forearms", "Grip"] },
  "zottman-curl": { primary: ["Biceps", "Forearms"], supporting: ["Brachialis", "Brachioradialis", "Grip"] },
  "kb-russian-twist": { primary: ["Obliques", "Abdominals"], supporting: ["Deep core", "Hip flexors"] },
  "kb-windmill": { primary: ["Obliques", "Glutes", "Shoulders"], supporting: ["Hamstrings", "Upper back", "Deep core"] },
  "kb-side-bend": { primary: ["Obliques"], supporting: ["Deep core", "Grip"] },
  "kb-figure-eight": { primary: ["Obliques", "Glutes", "Quadriceps"], supporting: ["Hamstrings", "Shoulders", "Forearms", "Core"] },
  "kb-rotational-swing": { primary: ["Glutes", "Hamstrings", "Obliques"], supporting: ["Quadriceps", "Lats", "Shoulders", "Forearms", "Core"] },
  "kb-hip-shift": { primary: ["Inner thighs", "Glutes", "Hip mobility"], supporting: ["Hamstrings", "Quadriceps", "Core"] },
  "kb-clean-rotational-press": { primary: ["Glutes", "Obliques", "Shoulders"], supporting: ["Hamstrings", "Quadriceps", "Triceps", "Upper back", "Core"] },
  "kb-suitcase-deadlift": { primary: ["Glutes", "Hamstrings", "Quadriceps"], supporting: ["Obliques", "Lower back", "Forearms", "Grip"] },
  "kb-woodchop": { primary: ["Obliques", "Abdominals"], supporting: ["Glutes", "Shoulders", "Upper back", "Core"] },
  "kb-rdl": { primary: ["Hamstrings", "Glutes"], supporting: ["Lower back", "Core", "Forearms"] },
  "kb-single-leg-rdl": { primary: ["Hamstrings", "Glutes"], supporting: ["Calves", "Inner thighs", "Lower back", "Core"] },
  "kb-kickstand-deadlift": { primary: ["Hamstrings", "Glutes"], supporting: ["Quadriceps", "Inner thighs", "Lower back", "Core"] },
  "kb-good-morning": { primary: ["Hamstrings", "Glutes"], supporting: ["Lower back", "Deep core", "Upper back"] },
  "kb-glute-bridge": { primary: ["Glutes"], supporting: ["Hamstrings", "Deep core"] }
};

export function getExerciseMuscles(exercise: ExercisePrescription): ExerciseMuscles {
  const baseId = exercise.id.endsWith("-substitute") ? exerciseCatalog.find((entry) => entry.name === exercise.name)?.id : exercise.id;
  return exerciseMuscles[baseId ?? exercise.id] ?? { primary: ["Full body"], supporting: [] };
}

const ready = { score: 100, status: "green" as const, reasonCodes: [], guidance: "" };
export type ExerciseEquipment = "kettlebell" | "dumbbell" | "kettlebell_or_dumbbell" | "bodyweight" | "skipping_rope";
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

export const supplementalExercises: CatalogExercise[] = supplementalExerciseMappings.map(({ exercise, equipmentType }) => ({ ...exercise, equipmentType }));

export const exerciseCatalog: CatalogExercise[] = [
  ...[...catalog.values()].map((exercise): CatalogExercise => ({
    ...exercise,
    equipmentType: exercise.id === "skipping" ? "skipping_rope" : exercise.loadKg !== null ? "kettlebell" : "bodyweight"
  })),
  ...dumbbellExercises,
  ...supplementalExercises
];

export function getMovementCues(exercise: ExercisePrescription) {
  if (exercise.id.endsWith("-substitute")) {
    const original = exerciseCatalog.find((entry) => entry.name === exercise.name);
    return (original && movementCues[original.id]) ?? ["Move slowly within a comfortable range. Stop if discomfort remains."];
  }
  return movementCues[exercise.id] ?? ["Move slowly with control. Stop if discomfort appears."];
}
