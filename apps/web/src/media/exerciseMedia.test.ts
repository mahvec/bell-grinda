import { describe, expect, it } from "vitest";
import { exerciseMedia, getExerciseMedia } from "./exerciseMedia";
import { exerciseCatalog, exerciseMuscles, getEquipmentAlternatives, getMovementCues, supplementalExercises } from "./exerciseGuide";

describe("exercise media catalog", () => {
  const kettlebellExerciseIds = exerciseCatalog.filter((exercise) => exercise.equipmentType === "kettlebell" || exercise.equipmentType === "kettlebell_or_dumbbell").map((exercise) => exercise.id);
  const dumbbellExerciseIds = exerciseCatalog.filter((exercise) => exercise.equipmentType === "dumbbell").map((exercise) => exercise.id);

  it("only exposes reviewed exact-match media", () => {
    expect(exerciseMedia.every((media) => media.reviewNote.length > 0)).toBe(true);
    expect(exerciseMedia.filter((media) => !["youtube", "vimeo"].includes(media.source)).every((media) => media.framing === "full-body")).toBe(true);
    expect(getExerciseMedia("skipping")).toMatchObject({
      source: "pexels",
      sourceId: "4804825",
      creator: "Ketut Subiyanto"
    });
  });

  it("has a reviewed demo for every kettlebell exercise", () => {
    expect(kettlebellExerciseIds.length).toBeGreaterThanOrEqual(28);
    for (const exerciseId of kettlebellExerciseIds) {
      expect(getExerciseMedia(exerciseId), exerciseId).toMatchObject({
        exerciseId,
        format: "live-action"
      });
    }
  });

  it("has a full-body demo for every dumbbell exercise", () => {
    expect(dumbbellExerciseIds).toHaveLength(2);
    for (const exerciseId of dumbbellExerciseIds) {
      expect(getExerciseMedia(exerciseId), exerciseId).toMatchObject({
        exerciseId,
        format: "live-action",
        framing: "full-body"
      });
    }
  });

  it("uses unique media records and does not invent unknown exercises", () => {
    expect(new Set(exerciseMedia.map((media) => media.exerciseId)).size).toBe(exerciseMedia.length);
    expect(getExerciseMedia("unknown")).toBeUndefined();
  });

  it("gives every supplemental movement specific written cues and hosted instruction", () => {
    expect(supplementalExercises).toHaveLength(20);
    for (const exercise of supplementalExercises) {
      expect(getMovementCues(exercise), exercise.id).toHaveLength(3);
      expect(getExerciseMedia(exercise.id), exercise.id).toMatchObject({ framing: "instructional" });
    }
  });

  it("identifies primary and supporting muscles for every library movement", () => {
    for (const exercise of exerciseCatalog) {
      expect(exerciseMuscles[exercise.id]?.primary.length, exercise.id).toBeGreaterThan(0);
      expect(exerciseMuscles[exercise.id]?.supporting.length, exercise.id).toBeGreaterThan(0);
    }
  });

  it("provides dumbbell and barbell alternatives wherever the movement translates safely", () => {
    const intentionallyUnloaded = new Set(["breathing", "cat-cow", "easy-walk", "skipping"]);
    for (const exercise of exerciseCatalog) {
      if (intentionallyUnloaded.has(exercise.id)) continue;
      expect(getEquipmentAlternatives(exercise).length, exercise.id).toBeGreaterThan(0);
    }
    expect(getEquipmentAlternatives(exerciseCatalog.find((exercise) => exercise.id === "goblet-squat")!).map((item) => item.equipmentType)).toEqual(["dumbbell", "barbell"]);
    expect(getEquipmentAlternatives(exerciseCatalog.find((exercise) => exercise.id === "kb-halo")!).map((item) => item.equipmentType)).toEqual(["dumbbell"]);
  });
});
