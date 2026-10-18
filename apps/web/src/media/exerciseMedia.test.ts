import { describe, expect, it } from "vitest";
import { exerciseMedia, getExerciseMedia } from "./exerciseMedia";
import { exerciseCatalog } from "./exerciseGuide";

describe("exercise media catalog", () => {
  const kettlebellExerciseIds = exerciseCatalog.filter((exercise) => exercise.loadKg !== null).map((exercise) => exercise.id);

  it("only exposes reviewed exact-match media", () => {
    expect(exerciseMedia.every((media) => media.framing === "full-body")).toBe(true);
    expect(getExerciseMedia("skipping")).toMatchObject({
      source: "pexels",
      sourceId: "4804825",
      creator: "Ketut Subiyanto"
    });
  });

  it("has a full-body demo for every kettlebell exercise", () => {
    expect(kettlebellExerciseIds).toHaveLength(8);
    for (const exerciseId of kettlebellExerciseIds) {
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
});
