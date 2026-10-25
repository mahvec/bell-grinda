# Exercise media review

Reviewed 25 October 2026. The catalog only accepts full-body framing: head, feet, hands and equipment must remain visible, including overhead travel. `object-fit: contain` preserves the source frame in the app. Portrait footage is letterboxed, never enlarged to fill a landscape crop.

## Included assets

| Movement | Creator / source | Visual review | Processing |
| --- | --- | --- | --- |
| Skipping rope | [Ketut Subiyanto, Pexels 4804825](https://www.pexels.com/video/video-of-man-using-jumping-rope-4804825/) | Continuous wide frontal shot; hands and feet remain visible. | 1280px wide H.264, no crop, audio removed. |
| Push-up | [Ketut Subiyanto, Pexels 4804794](https://www.pexels.com/video/man-doing-push-ups-4804794/) | Complete floor push-ups, three-quarter full-body view. | 1280px wide H.264, no crop, audio removed. |
| Goblet squat | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Goblet_Squat.webm) | Exact goblet squat, static full-body framing. | Trimmed H.264, no crop, audio removed. |
| Two-hand swing | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Swing_Hip_Hinge_Style.webm) | Exact hip-hinge swing; full athlete and bell visible from each shown angle. | Trimmed H.264, no crop, audio removed. |
| Clean | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm) | Clean phase isolated with the athlete and bell fully visible. | Trimmed H.264, no crop, audio removed. |
| Overhead press | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm) | Rack-to-overhead phase isolated; feet and overhead bell remain visible. | Trimmed H.264, no crop, audio removed. |
| Clean and press | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm) | Complete clean-and-press sequence in full-body framing. | Trimmed H.264, no crop, audio removed. |
| Single-bell deadlift | [Pavel Danilyuk, Pexels 4367574](https://www.pexels.com/video/a-man-holding-onto-a-kettlebell-4367574/) | Live-action single-bell floor-to-stand phase with the athlete fully visible. The written beginner guide specifies a two-hand grip. | Trimmed and looped H.264, forward and reverse playback, no crop, audio removed. |
| Supported one-arm row | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Suitcase_Row_and_Press.webm) | Live-action alternating row phase with the athlete and bells fully visible. The written beginner guide retains the supported setup. | Row phase isolated as H.264, no crop, audio removed. |
| Deadlift-clean-press complex | [Taco Fleur, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Kettlebell_Clean_and_Press.webm) | Live-action floor-to-clean-to-press sequence in full-body framing. The written guide specifies the deliberate deadlift pause. | Trimmed H.264, no crop, audio removed. |
| Dumbbell sumo squat | [khezez \| خزاز, Pexels 35585592](https://www.pexels.com/video/man-performing-dumbbell-squats-in-gym-35585592/) | Exact one-dumbbell sumo squat; head, hands, dumbbell and feet remain visible. | 720px wide H.264, no crop, audio removed. |
| Dumbbell Bulgarian split squat | [Mikhail Nilov, Pexels 6740156](https://www.pexels.com/video/a-woman-exercising-in-the-gym-6740156/) | Exact rear-foot-elevated split squat; athlete, bench, dumbbells and feet remain visible. | Exercise segment trimmed to 24 seconds, 1280px wide H.264, no crop, audio removed. |

The Wikimedia clips are used under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and identify the adaptations in the in-app metadata. The deadlift, two bodyweight clips, and both dumbbell clips use the [Pexels License](https://www.pexels.com/license/). Attribution and source/license links are shown in the player. Posters are frames from the same footage. The media is bundled as application content; no endorsement by the depicted people is claimed.

Visual review verifies the depicted movement and framing, not professional coaching certification. Written guides remain visible independently of playback. A qualified trainer should review the finished catalog before public release.

## Rejected material

- 4804828: previously shipped skipping clip crops out the legs. Replaced.
- 6388874: jump-rope clip changes between wide shots and crops. Rejected.
- 8893521: banded kettlebell squat variation, changing cropped framing. Not a goblet squat demo.
- 15700450, 8780727, 855828: different kettlebell variations or movements from the prescribed exercise.
- Pexels 7320032: the movement is not the prescribed clean-and-press pattern. Replaced.
- Two-bell deadlift combinations: reusable, but the wrong prescribed variation. Rejected.
- Illustrated motion guides: removed in favor of live-action human footage. The catalog now rejects non-live-action media.

## Outstanding coverage

All eight kettlebell exercises and both dumbbell exercises in the current library now have full-body demos. Reverse lunge, dead bug, glute bridge, cat-cow, breathing and walking still have written guides only. Do not alias a similar clip to those exercise IDs.

The examined wger collection did not cover the prescribed kettlebell variants. GitHub rehosts of ExerciseDB material may contain files without reusable media rights; an open-source application license does not automatically license its video assets. Prefer a verifiable open media license for future additions, otherwise use a reviewed Pexels source or commissioned footage.

## Playback and offline behavior

Videos are local application assets under `public/media/`, loaded on request, and excluded from the shell precache. Small posters are precached. Save offline fetches a complete video into `exercise-media-v1`. The player can read that response as a Blob URL, including without a service worker. The production service worker supports byte-range playback from the same cache. Browsers may evict local storage; offline availability is checked again when the component mounts.

To add media: verify provenance, inspect the entire clip for framing and movement, preserve aspect ratio when transcoding, add metadata and a review note to `exerciseMedia.ts`, and test actual playback plus saved playback offline. Keep `framing: "full-body"` mandatory.
