import { getProfileEquipment, type BodyLocation, type ExercisePrescription, type ReadinessResult, type TrainingLevel, type UserProfile } from "@bellgrinda/domain";

export type MappedEquipment = "kettlebell" | "dumbbell" | "kettlebell_or_dumbbell";
export type ExerciseMapping = {
  exercise: ExercisePrescription;
  equipmentType: MappedEquipment;
  minimumLevel: TrainingLevel;
  prerequisites: string[];
  blockedPainLocations: BodyLocation[];
  blockedAtPain: "mild" | "moderate";
  eligibleDays: number[];
  eligiblePhases: number[];
  easierVariation: string;
  harderVariation: string;
  replaces: string[];
  loadRule: { requiresExerciseApproval: true; minimumSuccessfulSessionsBeforeIncrease: number; maximumStartingLoadKg: number };
};

const mapped = (
  id: string, name: string, category: ExercisePrescription["category"], target: string, defaultLoadKg: number,
  equipmentType: MappedEquipment, minimumLevel: TrainingLevel, prerequisites: string[], blockedPainLocations: BodyLocation[],
  eligibleDays: number[], eligiblePhases: number[], easierVariation: string, harderVariation: string, replaces: string[],
  note: string, maximumStartingLoadKg = defaultLoadKg, blockedAtPain: ExerciseMapping["blockedAtPain"] = "moderate"
): ExerciseMapping => ({
  exercise: { id, name, category, target, loadKg: defaultLoadKg, note }, equipmentType, minimumLevel, prerequisites,
  blockedPainLocations, blockedAtPain, eligibleDays, eligiblePhases, easierVariation, harderVariation, replaces,
  loadRule: { requiresExerciseApproval: true, minimumSuccessfulSessionsBeforeIncrease: 2, maximumStartingLoadKg }
});

export const supplementalExerciseMappings: ExerciseMapping[] = [
  mapped("kb-halo", "Kettlebell halo", "recovery", "5 slow circles each way", 4, "kettlebell", "novice", [], ["neck", "shoulder", "upper_back"], [1, 3, 5], [1, 2, 3], "Unloaded shoulder circles", "Half-kneeling kettlebell halo", ["cat-cow"], "Mobility drill. Use a light bell and keep the movement pain-free."),
  mapped("kb-thruster", "Kettlebell thruster", "power", "6–8 controlled reps", 8, "kettlebell", "advanced_novice", ["goblet-squat", "overhead-press"], ["shoulder", "lower_back", "hip", "knee"], [2, 4], [2, 3], "Goblet squat to controlled press", "Single-arm kettlebell thruster", ["clean-press", "mini-complex"], "Requires a comfortable squat and overhead press."),
  mapped("kb-single-leg-clean", "Kettlebell single-leg clean", "power", "3–5 reps per side", 4, "kettlebell", "advanced", ["kb-clean", "kb-single-leg-rdl"], ["lower_back", "hip", "knee", "ankle", "wrist"], [2, 4], [2, 3], "Supported single-leg RDL", "Single-leg clean to press", ["kb-clean"], "Advanced balance skill. Master the clean and single-leg RDL first.", 8, "mild"),
  mapped("kb-biceps-curl", "Kettlebell biceps curl — two-hand or single-arm", "pull", "8–12 reps per side", 4, "kettlebell", "novice", [], ["elbow", "wrist"], [1, 3], [1, 2, 3], "Two-hand horn-grip curl", "Alternating single-arm curl", ["one-arm-row"], "Choose the grip that keeps the wrist straight and use no body swing."),
  mapped("kb-hammer-curl", "Kettlebell hammer curl", "pull", "8–12 reps per side", 4, "kettlebell", "advanced_novice", ["kb-biceps-curl"], ["elbow", "wrist"], [1, 3], [1, 2, 3], "Two-hand kettlebell curl", "Single-arm hammer curl", ["one-arm-row"], "Start lighter than a normal curl because the offset bell increases wrist demand."),
  mapped("zottman-curl", "Zottman curl — kettlebell or dumbbell", "pull", "8–10 controlled reps", 4, "kettlebell_or_dumbbell", "advanced_novice", ["kb-biceps-curl"], ["elbow", "wrist"], [1, 3], [2, 3], "Standard controlled curl", "Alternating Zottman curl", ["one-arm-row"], "Use a dumbbell if the kettlebell does not allow a comfortable, straight-wrist rotation."),
  mapped("kb-russian-twist", "Kettlebell Russian twist", "core", "6–10 reps per side", 4, "kettlebell", "advanced_novice", ["dead-bug"], ["lower_back", "hip"], [3, 5], [2, 3], "Heels-down bodyweight twist", "Feet-raised kettlebell twist", ["dead-bug", "plank-shoulder-tap"], "Keep heels down as the default. Avoid loaded twisting if it aggravates your back.", 8),
  mapped("kb-windmill", "Kettlebell windmill", "core", "4–6 reps per side", 4, "kettlebell", "intermediate", ["kb-halo", "overhead-press", "kb-hip-shift"], ["shoulder", "lower_back", "hip", "hamstring"], [1, 3], [2, 3], "Unloaded or bottom-loaded windmill", "Overhead kettlebell windmill", ["suitcase-march", "plank-shoulder-tap"], "Advanced shoulder and hip mobility drill. Begin unloaded or bottom-loaded.", 8, "mild"),
  mapped("kb-side-bend", "Kettlebell side bend", "core", "8–12 reps per side", 4, "kettlebell", "novice", [], ["lower_back", "hip"], [3, 5], [1, 2, 3], "Bodyweight side bend", "Suitcase march", ["dead-bug"], "Use a small range and a light bell; do not combine it with a squat or windmill."),
  mapped("kb-figure-eight", "Kettlebell figure 8", "core", "5 slow passes each way", 4, "kettlebell", "intermediate", ["kb-deadlift", "kb-swing"], ["lower_back", "hip", "knee", "wrist"], [2, 4], [1, 2, 3], "Around-the-body pass", "Figure 8 to hold", ["intermediate-complex"], "Coordination drill. Learn the handoff slowly before adding speed.", 8, "mild"),
  mapped("kb-rotational-swing", "Two-hand pivot rotational kettlebell swing", "power", "5–8 reps per side", 4, "kettlebell", "advanced", ["kb-swing", "kb-figure-eight"], ["lower_back", "hip", "knee", "ankle"], [2, 4], [2, 3], "Two-hand kettlebell swing", "Single-arm rotational swing", ["kb-swing"], "Advanced rotational skill. Master a pain-free two-hand swing first.", 8, "mild"),
  mapped("kb-hip-shift", "Kettlebell hip shift", "recovery", "5 slow shifts per side", 4, "kettlebell", "novice", [], ["lower_back", "hip", "knee", "ankle"], [1, 2, 3, 4, 5], [1, 2, 3], "Bodyweight hip shift", "Kettlebell Cossack squat", ["bodyweight-squat"], "Mobility drill, not a heavy strength exercise. Stay in a pain-free range."),
  mapped("kb-clean-rotational-press", "Single-kettlebell clean to rotational press", "power", "3–5 reps per side", 4, "kettlebell", "advanced", ["kb-clean", "overhead-press", "kb-rotational-swing"], ["shoulder", "lower_back", "hip", "knee", "ankle", "wrist"], [2, 4], [2, 3], "Clean and press without rotation", "Clean to rotational push press", ["clean-press", "advanced-complex"], "Advanced sequence. Master each component and the unloaded pivot first.", 8, "mild"),
  mapped("kb-suitcase-deadlift", "Kettlebell suitcase deadlift", "strength", "6–10 reps per side", 8, "kettlebell", "advanced_novice", ["kb-deadlift"], ["lower_back", "hip", "knee", "wrist"], [1, 5], [1, 2, 3], "Centred two-hand kettlebell deadlift", "Suitcase deadlift to carry", ["kb-deadlift", "suitcase-march"], "Keep the torso level; the off-centre load must not pull you sideways.", 12),
  mapped("kb-woodchop", "Kettlebell wood chop — standing or half-kneeling", "core", "6–8 reps per side", 4, "kettlebell", "intermediate", ["dead-bug", "kb-hip-shift"], ["shoulder", "lower_back", "hip", "knee"], [2, 5], [2, 3], "Standing bodyweight diagonal reach", "Half-kneeling kettlebell wood chop", ["plank-shoulder-tap", "suitcase-march"], "Learn the standing version first. The half-kneeling version removes leg assistance.", 8, "mild"),
  mapped("kb-rdl", "Kettlebell Romanian deadlift (RDL)", "strength", "8–12 controlled reps", 8, "kettlebell", "advanced_novice", ["kb-deadlift"], ["lower_back", "hip", "hamstring"], [1, 5], [1, 2, 3], "Kettlebell deadlift", "Kickstand kettlebell RDL", ["kb-deadlift"], "Hinge only as far as a neutral spine and hamstring control allow.", 12),
  mapped("kb-single-leg-rdl", "Single-leg kettlebell Romanian deadlift (RDL)", "strength", "5–8 reps per side", 4, "kettlebell", "intermediate", ["kb-rdl", "reverse-lunge"], ["lower_back", "hip", "hamstring", "knee", "ankle"], [1, 5], [2, 3], "Supported single-leg hinge", "Single-leg clean", ["loaded-reverse-lunge", "kb-rdl"], "Use hand support while learning and keep the hips square.", 8, "mild"),
  mapped("kb-kickstand-deadlift", "Kettlebell kickstand (B-stance) deadlift", "strength", "6–10 reps per side", 8, "kettlebell", "advanced_novice", ["kb-rdl"], ["lower_back", "hip", "hamstring", "knee"], [1, 5], [2, 3], "Bilateral kettlebell RDL", "Single-leg kettlebell RDL", ["kb-deadlift", "loaded-reverse-lunge"], "A bridge between bilateral and single-leg hinges; the front leg does most of the work.", 12),
  mapped("kb-good-morning", "Kettlebell good morning", "strength", "8–10 controlled reps", 4, "kettlebell", "intermediate", ["kb-rdl"], ["neck", "upper_back", "lower_back", "hip", "hamstring"], [1, 5], [2, 3], "Unloaded hip hinge", "Front-loaded kettlebell good morning", ["kb-deadlift"], "Use a light bell and master the unloaded hip hinge first.", 8, "mild"),
  mapped("kb-glute-bridge", "Kettlebell glute bridge — two-leg or single-leg", "strength", "8–12 reps", 8, "kettlebell", "novice", ["glute-bridge"], ["lower_back", "hip", "hamstring"], [1, 5], [1, 2, 3], "Bodyweight glute bridge", "Single-leg kettlebell glute bridge", ["glute-bridge"], "Secure the bell with both hands. Progress to one leg only when the pelvis stays level.", 12)
];

const levelRank: Record<TrainingLevel, number> = { novice: 0, advanced_novice: 1, intermediate: 2, advanced: 3, grandmaster: 4 };
const painRank = { none: 0, mild: 1, moderate: 2, severe: 3 } as const;

function availableLoads(profile: UserProfile, type: MappedEquipment) {
  const active = getProfileEquipment(profile);
  return [...new Set(active.filter((item) => type === "kettlebell_or_dumbbell" ? ["kettlebell", "dumbbell"].includes(item.equipmentType) : item.equipmentType === type).flatMap((item) => item.weightKg ? [item.weightKg] : []))].sort((a, b) => a - b);
}

export type EligibleMappedExercise = { mapping: ExerciseMapping; exercise: ExercisePrescription };

export function getEligibleMappedExercises(profile: UserProfile, readiness: ReadinessResult, programDay: number): EligibleMappedExercise[] {
  if (readiness.status === "red" || readiness.input?.football === "competition" || readiness.input?.football === "high_intensity" || readiness.input?.football === "match") return [];
  return supplementalExerciseMappings.flatMap((mapping) => {
    if (levelRank[profile.trainingLevel] < levelRank[mapping.minimumLevel] || !mapping.eligiblePhases.includes(profile.phase) || !mapping.eligibleDays.includes(programDay)) return [];
    const supplementalIds = new Set(supplementalExerciseMappings.map((item) => item.exercise.id));
    if (mapping.prerequisites.some((id) => supplementalIds.has(id) && !profile.exerciseWorkingLoadsKg?.[id])) return [];
    const pain = readiness.input?.pain ?? "none";
    const painLocations = readiness.input?.painLocations ?? [];
    const threshold = mapping.blockedAtPain === "mild" ? 1 : 2;
    if (painRank[pain] >= threshold && painLocations.some((location) => mapping.blockedPainLocations.includes(location))) return [];
    const soreness = readiness.input?.soreness ?? "none";
    const sorenessLocations = readiness.input?.sorenessLocations ?? [];
    if (painRank[soreness] >= 2 && sorenessLocations.some((location) => mapping.blockedPainLocations.includes(location))) return [];
    const approved = profile.exerciseWorkingLoadsKg?.[mapping.exercise.id];
    if (!approved) return [];
    const selected = [...availableLoads(profile, mapping.equipmentType)].reverse().find((load) => load <= approved);
    if (!selected) return [];
    return [{ mapping, exercise: { ...mapping.exercise, loadKg: selected } }];
  });
}

export const getSupplementalExerciseMapping = (exerciseId: string) => supplementalExerciseMappings.find((item) => item.exercise.id === exerciseId);
