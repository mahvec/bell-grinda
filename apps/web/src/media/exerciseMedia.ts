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

const youtubeTerms = {
  source: "youtube" as const,
  licenseName: "YouTube Terms of Service",
  licenseUrl: "https://www.youtube.com/t/terms",
  format: "live-action" as const,
  framing: "instructional" as const,
  reviewedAt: "2026-11-03T12:00:00.000Z"
};

const youtubeEmbed = (id: string, start?: number) => `https://www.youtube-nocookie.com/embed/${id}${start ? `?start=${start}` : ""}`;

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
  },
  {
    ...youtubeTerms, exerciseId: "kb-halo", sourceId: "Sci3lijQBmk",
    sourcePageUrl: "https://www.youtube.com/watch?v=Sci3lijQBmk", creator: "Coach Britt",
    videoUrl: youtubeEmbed("Sci3lijQBmk"),
    reviewNote: "Exact kettlebell halo tutorial with a step-by-step technique breakdown and common mistakes. Streamed through the publisher-controlled YouTube embed."
  },
  {
    ...youtubeTerms, exerciseId: "kb-thruster", sourceId: "0qKCxLjr7xg",
    sourcePageUrl: "https://www.youtube.com/watch?v=0qKCxLjr7xg", creator: "Lebe Stark",
    videoUrl: youtubeEmbed("0qKCxLjr7xg"),
    reviewNote: "Exact kettlebell thruster tutorial covering the squat, leg drive, and overhead press. Streamed through the publisher-controlled YouTube embed."
  },
  {
    ...youtubeTerms, exerciseId: "kb-single-leg-clean", sourceId: "3sXVbAkrc24",
    sourcePageUrl: "https://www.youtube.com/watch?v=3sXVbAkrc24", creator: "Greg Brookes",
    videoUrl: youtubeEmbed("3sXVbAkrc24"),
    reviewNote: "Exact single-leg kettlebell clean demonstration identified as an advanced balance, power, and coordination movement.",
    coachingNote: "This is an advanced variation. Master the regular clean and a supported single-leg hinge before practising it."
  },
  {
    ...youtubeTerms, exerciseId: "kb-biceps-curl", sourceId: "Bk22u7e6G8E",
    sourcePageUrl: "https://www.youtube.com/watch?v=Bk22u7e6G8E", creator: "Travis Tarrant",
    videoUrl: youtubeEmbed("Bk22u7e6G8E"),
    reviewNote: "Exact kettlebell biceps curl tutorial showing a controlled two-hand horn grip.",
    coachingNote: "The video shows the two-hand version. For a single-arm curl, keep the same still upper arm and straight-wrist control."
  },
  {
    ...youtubeTerms, exerciseId: "kb-hammer-curl", sourceId: "KLvGXRo56iQ",
    sourcePageUrl: "https://www.youtube.com/watch?v=KLvGXRo56iQ", creator: "BarBend exercise guide",
    videoUrl: youtubeEmbed("KLvGXRo56iQ"),
    reviewNote: "Exact kettlebell hammer-curl demonstration selected by the linked exercise guide.",
    coachingNote: "Use a much lighter bell than your normal curl; the hanging load increases the demand on your grip and wrist."
  },
  {
    ...youtubeTerms, exerciseId: "zottman-curl", sourceId: "FSGDM9-dZ9w",
    sourcePageUrl: "https://www.youtube.com/watch?v=FSGDM9-dZ9w", creator: "Bodybuilding.com",
    videoUrl: youtubeEmbed("FSGDM9-dZ9w"),
    reviewNote: "Exact Zottman curl tutorial showing the supinated lift, top rotation, and pronated lowering phase.",
    coachingNote: "The tutorial uses dumbbells. Only use kettlebells when their handles allow the same smooth rotation with straight wrists."
  },
  {
    ...youtubeTerms, exerciseId: "kb-russian-twist", sourceId: "PkGPokybYaU",
    sourcePageUrl: "https://www.youtube.com/watch?v=PkGPokybYaU", creator: "Live Lean TV Daily Exercises",
    videoUrl: youtubeEmbed("PkGPokybYaU"),
    reviewNote: "Exact kettlebell Russian twist demonstration with setup and controlled side-to-side movement.",
    coachingNote: "BellGrinda defaults to heels down. Lift the feet only after you can keep a long, controlled spine."
  },
  {
    ...youtubeTerms, exerciseId: "kb-windmill", sourceId: "1N1Qs9FO4GU",
    sourcePageUrl: "https://www.youtube.com/watch?v=1N1Qs9FO4GU", creator: "Zack Henderson",
    videoUrl: youtubeEmbed("1N1Qs9FO4GU"),
    reviewNote: "Exact kettlebell windmill tutorial covering unloaded, kneeling, bottom-loaded, and overhead progressions.",
    coachingNote: "Start with the unloaded or bottom-loaded progression shown before putting a bell overhead."
  },
  {
    ...youtubeTerms, exerciseId: "kb-side-bend", sourceId: "3AASbmPEtYE#47",
    sourcePageUrl: "https://www.youtube.com/watch?v=3AASbmPEtYE&t=47s", creator: "Ryoji Yoshikawa",
    videoUrl: youtubeEmbed("3AASbmPEtYE", 47),
    reviewNote: "The linked chapter demonstrates the kettlebell side bend as part of a kettlebell mobility tutorial.",
    coachingNote: "This hosted tutorial is in Japanese; follow BellGrinda's English written cues and use a small, pain-free range."
  },
  {
    ...youtubeTerms, exerciseId: "kb-figure-eight", sourceId: "mxDvhrMxuus",
    sourcePageUrl: "https://www.youtube.com/watch?v=mxDvhrMxuus", creator: "Coach Britt",
    videoUrl: youtubeEmbed("mxDvhrMxuus"),
    reviewNote: "Exact kettlebell figure-8 tutorial with a beginner step-by-step handoff breakdown."
  },
  {
    ...youtubeTerms, exerciseId: "kb-rotational-swing", sourceId: "sBbWDKYMwpY",
    sourcePageUrl: "https://www.youtube.com/watch?v=sBbWDKYMwpY", creator: "Dr. John Rusin exercise guide",
    videoUrl: youtubeEmbed("sBbWDKYMwpY"),
    reviewNote: "Exact two-hand rotational kettlebell swing demonstration selected by the linked exercise guide.",
    coachingNote: "Treat this as an advanced swing variation. The hips and feet pivot together; never twist through a planted knee."
  },
  {
    ...youtubeTerms, exerciseId: "kb-hip-shift", sourceId: "3AASbmPEtYE#337",
    sourcePageUrl: "https://www.youtube.com/watch?v=3AASbmPEtYE&t=337s", creator: "Ryoji Yoshikawa",
    videoUrl: youtubeEmbed("3AASbmPEtYE", 337),
    reviewNote: "The linked chapter demonstrates the kettlebell hip shift as a controlled mobility movement.",
    coachingNote: "This hosted tutorial is in Japanese; use the written English cues and treat the bell as a light counterbalance."
  },
  {
    ...youtubeTerms, exerciseId: "kb-clean-rotational-press", sourceId: "ppBgsm8s-IU",
    sourcePageUrl: "https://www.youtube.com/watch?v=ppBgsm8s-IU", creator: "Functional Bodybuilding",
    videoUrl: youtubeEmbed("ppBgsm8s-IU"),
    reviewNote: "Exact single-kettlebell clean-to-rotational-press demonstration.",
    coachingNote: "Advanced sequence: learn the clean, press, and unloaded foot pivot separately before combining them."
  },
  {
    ...youtubeTerms, exerciseId: "kb-suitcase-deadlift", sourceId: "15p3Jv4eqaY",
    sourcePageUrl: "https://www.youtube.com/watch?v=15p3Jv4eqaY", creator: "BarBend exercise guide",
    videoUrl: youtubeEmbed("15p3Jv4eqaY"),
    reviewNote: "Exact suitcase deadlift guide showing the bell outside one foot and an upright, level finish."
  },
  {
    ...youtubeTerms, exerciseId: "kb-woodchop", sourceId: "WaBz7DIcI5w",
    sourcePageUrl: "https://www.youtube.com/watch?v=WaBz7DIcI5w", creator: "Red Dot Fitness",
    videoUrl: youtubeEmbed("WaBz7DIcI5w"),
    reviewNote: "Exact standing kettlebell wood-chop demonstration with diagonal path, hip extension, and rotation cues.",
    coachingNote: "The video shows the standing version. Master it before using the half-kneeling progression described in the written guide."
  },
  {
    ...youtubeTerms, exerciseId: "kb-rdl", sourceId: "Uc5rP5xs7qQ",
    sourcePageUrl: "https://www.youtube.com/watch?v=Uc5rP5xs7qQ", creator: "Of The Lion Fitness",
    videoUrl: youtubeEmbed("Uc5rP5xs7qQ"),
    reviewNote: "Exact kettlebell Romanian deadlift tutorial covering setup and hip-hinge execution."
  },
  {
    ...youtubeTerms, exerciseId: "kb-single-leg-rdl", sourceId: "s32cCgmRV3I",
    sourcePageUrl: "https://www.youtube.com/watch?v=s32cCgmRV3I", creator: "Movement Physio",
    videoUrl: youtubeEmbed("s32cCgmRV3I"),
    reviewNote: "Exact single-leg kettlebell Romanian deadlift demonstration.",
    coachingNote: "Use a wall or chair for balance while learning, even if the demonstration is unsupported."
  },
  {
    exerciseId: "kb-kickstand-deadlift", source: "vimeo", sourceId: "458926077",
    sourcePageUrl: "https://vimeo.com/458926077", creator: "Nathalie Lennon",
    licenseName: "Vimeo Terms of Service", licenseUrl: "https://vimeo.com/terms",
    videoUrl: "https://player.vimeo.com/video/458926077", format: "live-action", framing: "instructional",
    reviewedAt: "2026-11-03T12:00:00.000Z",
    reviewNote: "Exact B-stance kettlebell RDL demonstration hosted by the publisher-controlled Vimeo player."
  },
  {
    ...youtubeTerms, exerciseId: "kb-good-morning", sourceId: "A42LMU4iQWM",
    sourcePageUrl: "https://www.youtube.com/watch?v=A42LMU4iQWM", creator: "OriGym",
    videoUrl: youtubeEmbed("A42LMU4iQWM"),
    reviewNote: "Exact kettlebell good-morning tutorial with setup, controlled hinge, and return cues."
  },
  {
    ...youtubeTerms, exerciseId: "kb-glute-bridge", sourceId: "5jiA8s_mfFI",
    sourcePageUrl: "https://www.youtube.com/watch?v=5jiA8s_mfFI", creator: "Pro Kettlebell",
    videoUrl: youtubeEmbed("5jiA8s_mfFI"),
    reviewNote: "Exact loaded single-leg kettlebell glute-bridge tutorial with bell placement and hip-extension cues.",
    coachingNote: "The video shows the harder single-leg option. Begin with both feet planted and progress only when the pelvis stays level."
  }
] satisfies ExerciseMedia[];

export const exerciseMedia = records.map((record) => exerciseMediaSchema.parse(record));

const byExerciseId = new Map(exerciseMedia.map((record) => [record.exerciseId, record]));

export const getExerciseMedia = (exerciseId: string) => byExerciseId.get(exerciseId);
