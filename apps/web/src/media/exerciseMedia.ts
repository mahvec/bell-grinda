import { exerciseMediaSchema, type ExerciseMedia } from "@bellgrinda/domain";

const commonsLicense = {
  source: "wikimedia" as const,
  creator: "Taco Fleur",
  licenseName: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
  format: "live-action" as const,
  framing: "full-body" as const,
  reviewedAt: "2026-10-18T20:30:00.000Z"
};

const records = [
  {
    exerciseId: "db-sumo-squat", source: "pexels", sourceId: "35585592",
    sourcePageUrl: "https://www.pexels.com/video/man-performing-dumbbell-squats-in-gym-35585592/",
    creator: "khezez | خزاز", licenseName: "Pexels License", licenseUrl: "https://www.pexels.com/license/",
    videoUrl: "/media/db-sumo-squat-35585592.mp4", posterUrl: "/media/db-sumo-squat-35585592.webp",
    format: "live-action", durationSeconds: 7, framing: "full-body", reviewedAt: "2026-10-25T12:00:00.000Z",
    reviewNote: "Exact one-dumbbell sumo squat shown through complete repetitions. Head, hands, dumbbell and feet remain visible. Resized without cropping; audio removed."
  },
  {
    exerciseId: "db-bulgarian-split-squat", source: "pexels", sourceId: "6740156",
    sourcePageUrl: "https://www.pexels.com/video/a-woman-exercising-in-the-gym-6740156/",
    creator: "Mikhail Nilov", licenseName: "Pexels License", licenseUrl: "https://www.pexels.com/license/",
    videoUrl: "/media/db-bulgarian-split-squat-6740156.mp4", posterUrl: "/media/db-bulgarian-split-squat-6740156.webp",
    format: "live-action", durationSeconds: 24, framing: "full-body", reviewedAt: "2026-10-25T12:00:00.000Z",
    reviewNote: "Exact rear-foot-elevated dumbbell split squat shown through complete repetitions. Athlete, bench, dumbbells and feet remain visible. Trimmed and resized without cropping; audio removed.",
    coachingNote: "The video shows the two-dumbbell option. If you own one dumbbell, hold it at your chest or on one side and follow the written guide."
  },
  {
    exerciseId: "skipping", source: "pexels", sourceId: "4804825",
    sourcePageUrl: "https://www.pexels.com/video/video-of-man-using-jumping-rope-4804825/",
    creator: "Ketut Subiyanto", licenseName: "Pexels License", licenseUrl: "https://www.pexels.com/license/",
    videoUrl: "/media/skipping-4804825.mp4", posterUrl: "/media/skipping-4804825.webp",
    format: "live-action", durationSeconds: 10, framing: "full-body", reviewedAt: "2026-10-18T18:20:00.000Z",
    reviewNote: "Wide frontal shot: head, hands, knees and feet remain visible across the clip. Replaces cropped clip 4804828. Resized without cropping; audio removed."
  },
  {
    exerciseId: "push-up", source: "pexels", sourceId: "4804794",
    sourcePageUrl: "https://www.pexels.com/video/man-doing-push-ups-4804794/",
    creator: "Ketut Subiyanto", licenseName: "Pexels License", licenseUrl: "https://www.pexels.com/license/",
    videoUrl: "/media/push-up-4804794.mp4", posterUrl: "/media/push-up-4804794.webp",
    format: "live-action", durationSeconds: 12, framing: "full-body", reviewedAt: "2026-10-18T18:20:00.000Z",
    reviewNote: "Three-quarter view of floor push-ups: head, hands, torso and feet remain in frame across repeated complete reps. Resized without cropping; audio removed."
  },
  {
    ...commonsLicense, exerciseId: "goblet-squat", sourceId: "Kettlebell_Goblet_Squat.webm",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Goblet_Squat.webm",
    videoUrl: "/media/goblet-squat-commons.mp4", posterUrl: "/media/goblet-squat-commons.webp", durationSeconds: 17,
    reviewNote: "Exact goblet squat variation in a static full-body frame. Adapted by trimming and removing audio; no crop."
  },
  {
    ...commonsLicense, exerciseId: "one-arm-row", sourceId: "Kettlebell_Suitcase_Row_and_Press.webm#row",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Suitcase_Row_and_Press.webm",
    videoUrl: "/media/one-arm-row-commons.mp4", posterUrl: "/media/one-arm-row-commons.webp", durationSeconds: 16,
    reviewNote: "Live-action alternating kettlebell rows isolated from the source demonstration. The athlete and bells remain fully visible. Adapted by trimming and removing audio; no crop.",
    coachingNote: "The video shows the row mechanics without support. For the novice version, keep one hand supported as described in the written guide."
  },
  {
    exerciseId: "kb-deadlift", source: "pexels", sourceId: "4367574#deadlift",
    sourcePageUrl: "https://www.pexels.com/video/a-man-holding-onto-a-kettlebell-4367574/",
    creator: "Pavel Danilyuk", licenseName: "Pexels License", licenseUrl: "https://www.pexels.com/license/",
    videoUrl: "/media/kb-deadlift-4367574.mp4", posterUrl: "/media/kb-deadlift-4367574.webp",
    format: "live-action", durationSeconds: 6, framing: "full-body", reviewedAt: "2026-10-18T21:30:00.000Z",
    reviewNote: "Live-action single-bell floor-to-stand phase presented forward and in reverse as a repeatable full-body demonstration. Adapted by trimming, looping and removing audio; no crop.",
    coachingNote: "Follow the written guide and hold the kettlebell with both hands for this beginner deadlift."
  },
  {
    ...commonsLicense, exerciseId: "kb-swing", sourceId: "Kettlebell_Swing_Hip_Hinge_Style.webm",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Swing_Hip_Hinge_Style.webm",
    videoUrl: "/media/kb-swing-commons.mp4", posterUrl: "/media/kb-swing-commons.webp", durationSeconds: 15,
    reviewNote: "Exact two-hand hip-hinge swing shown from full-body angles. Adapted by trimming and removing audio; no crop."
  },
  {
    ...commonsLicense, exerciseId: "kb-clean", sourceId: "Kettlebell_Clean_and_Press.webm#clean",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm",
    videoUrl: "/media/kb-clean-commons.mp4", posterUrl: "/media/kb-clean-commons.webp", durationSeconds: 12,
    reviewNote: "Clean phase isolated from the source demonstration; the athlete and bell stay fully visible. Adapted by trimming and removing audio; no crop."
  },
  {
    ...commonsLicense, exerciseId: "overhead-press", sourceId: "Kettlebell_Clean_and_Press.webm#press",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm",
    videoUrl: "/media/overhead-press-commons.mp4", posterUrl: "/media/overhead-press-commons.webp", durationSeconds: 20,
    reviewNote: "Rack-to-overhead press phase isolated from the source demonstration; feet and bell remain visible. Adapted by trimming and removing audio; no crop."
  },
  {
    ...commonsLicense, exerciseId: "clean-press", sourceId: "Kettlebell_Clean_and_Press.webm",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm",
    videoUrl: "/media/clean-press-commons.mp4", posterUrl: "/media/clean-press-commons.webp", durationSeconds: 32,
    reviewNote: "Complete clean-and-press cycle in a full-body frame. Replaces a stock clip that did not show the prescribed clean. Adapted by trimming and removing audio; no crop."
  },
  {
    ...commonsLicense, exerciseId: "mini-complex", sourceId: "Kettlebell_Clean_and_Press.webm#complex",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm",
    videoUrl: "/media/clean-press-commons.mp4", posterUrl: "/media/clean-press-commons.webp", durationSeconds: 32,
    reviewNote: "Live-action floor-to-clean-to-press sequence used for the prescribed complex. The athlete and bell stay fully visible. Adapted by trimming and removing audio; no crop.",
    coachingNote: "Pause in the deadlift position before the clean, following the written sequence below the video."
  }
] satisfies ExerciseMedia[];

export const exerciseMedia = records.map((record) => exerciseMediaSchema.parse(record));

const byExerciseId = new Map(exerciseMedia.map((record) => [record.exerciseId, record]));

export const getExerciseMedia = (exerciseId: string) => byExerciseId.get(exerciseId);
