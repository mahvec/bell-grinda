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
export type EquipmentAlternative = { equipmentType: "dumbbell" | "barbell"; name: string; note: string };

const alternatives: Record<string, EquipmentAlternative[]> = {
  "db-sumo-squat": [{ equipmentType: "barbell", name: "Barbell sumo squat", note: "Use a rack and a stance that keeps the knees tracking comfortably." }],
  "db-bulgarian-split-squat": [{ equipmentType: "barbell", name: "Barbell Bulgarian split squat", note: "Advanced option; establish balance with bodyweight or dumbbells first." }],
  "bodyweight-squat": [{ equipmentType: "dumbbell", name: "Dumbbell goblet squat", note: "Hold one dumbbell at the chest." }, { equipmentType: "barbell", name: "Barbell back or front squat", note: "Use only with a secure rack and established squat technique." }],
  "goblet-squat": [{ equipmentType: "dumbbell", name: "Dumbbell goblet squat", note: "Use one dumbbell vertically at the chest." }, { equipmentType: "barbell", name: "Barbell front squat", note: "Use a rack and keep the same controlled squat pattern." }],
  "front-rack-squat": [{ equipmentType: "dumbbell", name: "Double-dumbbell front squat", note: "Use one or two dumbbells in the front-rack position." }, { equipmentType: "barbell", name: "Barbell front squat", note: "Use a rack and an established front-rack position." }],
  "one-arm-row": [{ equipmentType: "dumbbell", name: "One-arm dumbbell row", note: "Use the same supported hip-hinge position." }, { equipmentType: "barbell", name: "Barbell bent-over row", note: "Keep the torso braced and use both arms." }],
  "push-up": [{ equipmentType: "dumbbell", name: "Dumbbell floor press", note: "Use one or two dumbbells with controlled elbows." }, { equipmentType: "barbell", name: "Barbell floor or bench press", note: "Bench press requires a stable bench and safe setup." }],
  "tempo-push-up": [{ equipmentType: "dumbbell", name: "Tempo dumbbell floor press", note: "Match the prescribed slow lowering tempo." }, { equipmentType: "barbell", name: "Tempo barbell bench press", note: "Use safeties or a spotter where appropriate." }],
  "push-up-progression": [{ equipmentType: "dumbbell", name: "Dumbbell floor or bench press", note: "Choose a controlled pressing variation." }, { equipmentType: "barbell", name: "Barbell bench press", note: "Use a stable bench, safeties, and an appropriate load." }],
  "decline-push-up": [{ equipmentType: "dumbbell", name: "Incline dumbbell bench press", note: "Use an adjustable, stable bench." }, { equipmentType: "barbell", name: "Incline barbell bench press", note: "Use a rack, safeties, and an incline bench." }],
  "athletic-push-up": [{ equipmentType: "dumbbell", name: "Speed dumbbell press", note: "Press quickly while lowering under control." }, { equipmentType: "barbell", name: "Dynamic-effort bench press", note: "Advanced option requiring safe rack setup and controlled loading." }],
  "explosive-push-up": [{ equipmentType: "dumbbell", name: "Alternating dumbbell push press", note: "Use controlled leg drive rather than a ballistic chest press." }, { equipmentType: "barbell", name: "Barbell push press", note: "Use only with established rack and overhead technique." }],
  "push-up-mechanical-drop": [{ equipmentType: "dumbbell", name: "Dumbbell press mechanical drop set", note: "Move from incline to flat or reduce load while preserving control." }, { equipmentType: "barbell", name: "Barbell bench press back-off set", note: "Reduce load safely rather than changing equipment mid-set." }],
  "kb-deadlift": [{ equipmentType: "dumbbell", name: "Dumbbell deadlift", note: "Hold one or two dumbbells close to the legs." }, { equipmentType: "barbell", name: "Barbell deadlift", note: "Keep the bar close and preserve the same hinge pattern." }],
  "kb-rdl": [{ equipmentType: "dumbbell", name: "Dumbbell Romanian deadlift", note: "Use one or two dumbbells close to the legs." }, { equipmentType: "barbell", name: "Barbell Romanian deadlift", note: "Keep the bar close and stop at controlled hamstring range." }],
  "kb-kickstand-deadlift": [{ equipmentType: "dumbbell", name: "Dumbbell kickstand RDL", note: "Hold one or two dumbbells while keeping the hips square." }, { equipmentType: "barbell", name: "Barbell B-stance RDL", note: "Use a conservative load and stable stance." }],
  "kb-single-leg-rdl": [{ equipmentType: "dumbbell", name: "Single-leg dumbbell RDL", note: "Use one dumbbell and hand support while learning." }, { equipmentType: "barbell", name: "Single-leg barbell RDL", note: "Advanced option; master the dumbbell version first." }],
  "kb-suitcase-deadlift": [{ equipmentType: "dumbbell", name: "Dumbbell suitcase deadlift", note: "Keep shoulders and hips level." }, { equipmentType: "barbell", name: "Barbell suitcase deadlift", note: "Advanced grip and balance option; start conservatively." }],
  "reverse-lunge": [{ equipmentType: "dumbbell", name: "Dumbbell reverse lunge", note: "Use one goblet-held dumbbell or two at the sides." }, { equipmentType: "barbell", name: "Barbell reverse lunge", note: "Use a rack and establish bodyweight balance first." }],
  "loaded-reverse-lunge": [{ equipmentType: "dumbbell", name: "Dumbbell reverse lunge", note: "Use one or two dumbbells." }, { equipmentType: "barbell", name: "Barbell reverse lunge", note: "Use a rack and controlled step length." }],
  "front-rack-lunge": [{ equipmentType: "dumbbell", name: "Dumbbell front-rack lunge", note: "Use one or two dumbbells in a stable rack." }, { equipmentType: "barbell", name: "Barbell front-rack reverse lunge", note: "Use a rack and stable front-rack technique." }],
  "overhead-press": [{ equipmentType: "dumbbell", name: "Dumbbell overhead press", note: "Use one arm or both arms while keeping the ribs stacked." }, { equipmentType: "barbell", name: "Barbell overhead press", note: "Use a rack and avoid leaning back." }],
  "floor-press": [{ equipmentType: "dumbbell", name: "Dumbbell floor press", note: "Use one or two dumbbells." }, { equipmentType: "barbell", name: "Barbell floor press", note: "Set up with safeties or assistance." }],
  "kb-swing": [{ equipmentType: "dumbbell", name: "Dumbbell swing", note: "Hold one dumbbell securely and preserve the hip hinge." }, { equipmentType: "barbell", name: "Barbell Romanian deadlift", note: "Closest barbell hinge alternative; it is not a ballistic swing." }],
  "kb-clean": [{ equipmentType: "dumbbell", name: "Dumbbell clean", note: "Use one or two dumbbells and keep them close." }, { equipmentType: "barbell", name: "Barbell hang clean", note: "Technical lift requiring coached barbell-clean proficiency." }],
  "kb-single-leg-clean": [{ equipmentType: "dumbbell", name: "Single-leg dumbbell clean", note: "Use a light dumbbell and master the supported single-leg hinge first." }],
  "kb-snatch": [{ equipmentType: "dumbbell", name: "Single-arm dumbbell snatch", note: "Keep the weight close and finish in a stable lockout." }, { equipmentType: "barbell", name: "Barbell power snatch", note: "Advanced technical lift; use only with specific instruction." }],
  "clean-press": [{ equipmentType: "dumbbell", name: "Dumbbell clean and press", note: "Use one or two dumbbells." }, { equipmentType: "barbell", name: "Barbell clean and press", note: "Requires established clean and overhead technique." }],
  "clean-front-squat": [{ equipmentType: "dumbbell", name: "Dumbbell clean to front squat", note: "Use one or two dumbbells." }, { equipmentType: "barbell", name: "Barbell clean to front squat", note: "Technical lift requiring a controlled clean and front rack." }],
  "kb-thruster": [{ equipmentType: "dumbbell", name: "Dumbbell thruster", note: "Use one or two dumbbells." }, { equipmentType: "barbell", name: "Barbell thruster", note: "Use a rack and keep the bar path controlled." }],
  "glute-bridge": [{ equipmentType: "dumbbell", name: "Dumbbell glute bridge", note: "Secure the dumbbell across the hips." }, { equipmentType: "barbell", name: "Barbell glute bridge or hip thrust", note: "Use padding and a stable setup." }],
  "kb-glute-bridge": [{ equipmentType: "dumbbell", name: "Dumbbell glute bridge", note: "Secure the dumbbell across the hips." }, { equipmentType: "barbell", name: "Barbell glute bridge or hip thrust", note: "Use padding and a stable setup." }],
  "dead-bug": [{ equipmentType: "dumbbell", name: "Dumbbell-loaded dead bug", note: "Hold one light dumbbell above the chest while controlling the legs." }],
  "plank-shoulder-tap": [{ equipmentType: "dumbbell", name: "Dumbbell plank drag", note: "Drag a light dumbbell without rotating the hips." }, { equipmentType: "barbell", name: "Barbell rollout", note: "Advanced core alternative requiring secure plates and strong trunk control." }],
  "suitcase-march": [{ equipmentType: "dumbbell", name: "Dumbbell suitcase march", note: "Hold one dumbbell and resist leaning." }, { equipmentType: "barbell", name: "Barbell front-rack march", note: "Use a rack and conservative load." }],
  "kb-halo": [{ equipmentType: "dumbbell", name: "Dumbbell halo", note: "Hold one light dumbbell securely by its ends." }],
  "kb-biceps-curl": [{ equipmentType: "dumbbell", name: "Dumbbell biceps curl", note: "Use one or two dumbbells with no body swing." }, { equipmentType: "barbell", name: "Barbell curl", note: "Keep the wrists straight and elbows controlled." }],
  "kb-hammer-curl": [{ equipmentType: "dumbbell", name: "Dumbbell hammer curl", note: "Use a neutral grip." }, { equipmentType: "barbell", name: "Swiss-bar or landmine neutral-grip curl", note: "A straight bar does not reproduce a true hammer grip." }],
  "zottman-curl": [{ equipmentType: "dumbbell", name: "Dumbbell Zottman curl", note: "Dumbbells are the preferred implementation." }],
  "kb-russian-twist": [{ equipmentType: "dumbbell", name: "Dumbbell Russian twist", note: "Keep the load close and heels grounded." }, { equipmentType: "barbell", name: "Landmine rotation", note: "Requires a secure landmine attachment or anchored bar." }],
  "kb-windmill": [{ equipmentType: "dumbbell", name: "Dumbbell windmill", note: "Begin unloaded before adding a light dumbbell." }, { equipmentType: "barbell", name: "Barbell windmill", note: "Highly advanced; use only after mastering lighter variations." }],
  "kb-side-bend": [{ equipmentType: "dumbbell", name: "Dumbbell side bend", note: "Use a small controlled range." }],
  "kb-figure-eight": [{ equipmentType: "dumbbell", name: "Dumbbell figure eight", note: "Use a compact dumbbell and slow, secure handoffs." }],
  "kb-rotational-swing": [{ equipmentType: "dumbbell", name: "Dumbbell rotational swing", note: "Use a secure grip and coordinated foot pivot." }, { equipmentType: "barbell", name: "Landmine rotation", note: "Closest barbell rotational-power alternative." }],
  "kb-hip-shift": [{ equipmentType: "dumbbell", name: "Dumbbell goblet hip shift", note: "Use the dumbbell as a light counterbalance." }, { equipmentType: "barbell", name: "Barbell Cossack squat", note: "Advanced loaded alternative; master bodyweight range first." }],
  "kb-clean-rotational-press": [{ equipmentType: "dumbbell", name: "Dumbbell clean to rotational press", note: "Turn the hips and feet together." }, { equipmentType: "barbell", name: "Landmine clean to rotational press", note: "Use a secure landmine attachment." }],
  "kb-woodchop": [{ equipmentType: "dumbbell", name: "Dumbbell wood chop", note: "Move slowly through a controlled diagonal path." }, { equipmentType: "barbell", name: "Landmine rotation", note: "Use a secure landmine attachment." }],
  "kb-good-morning": [{ equipmentType: "dumbbell", name: "Dumbbell good morning", note: "Hold one dumbbell at the chest." }, { equipmentType: "barbell", name: "Barbell good morning", note: "Use a rack, light load, and established hinge technique." }],
  "mini-complex": [{ equipmentType: "dumbbell", name: "Dumbbell deadlift-clean-press complex", note: "Use one or two dumbbells." }, { equipmentType: "barbell", name: "Barbell deadlift-clean-press complex", note: "Use only with established barbell transitions." }],
  "intermediate-complex": [{ equipmentType: "dumbbell", name: "Dumbbell full-body complex", note: "Preserve the same movement order and clean transitions." }, { equipmentType: "barbell", name: "Barbell full-body complex", note: "Use a light load that remains controlled throughout." }],
  "advanced-complex": [{ equipmentType: "dumbbell", name: "Advanced dumbbell complex", note: "Use one or two dumbbells with clean transitions." }, { equipmentType: "barbell", name: "Advanced barbell complex", note: "Requires established technique in every included lift." }],
  "grandmaster-complex": [{ equipmentType: "dumbbell", name: "Dumbbell mastery complex", note: "Keep each transition crisp and controlled." }, { equipmentType: "barbell", name: "Barbell mastery complex", note: "Use only with advanced proficiency in every included lift." }]
};

export function getEquipmentAlternatives(exercise: ExercisePrescription): EquipmentAlternative[] {
  return alternatives[exercise.id] ?? [];
}

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
