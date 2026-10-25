# BellGrinda build status

## Current release slice

The usable Novice loop is implemented end to end:

1. Create a local training profile and select available equipment.
2. Complete a readiness check covering energy, sleep, soreness, pain, and football load.
3. Generate a deterministic workout with safety-first volume changes.
4. Review the reasoned prescription and start the session.
5. Complete, skip, pause, and resume exercises with every action persisted locally.
6. Report discomfort during a session. Mild discomfort is monitored, moderate discomfort stops the movement and permits only an approved substitute or skip, and severe discomfort ends the workout with non-diagnostic escalation guidance.
7. Review locally stored workout history.
8. Browse 16 movements with written cues. Preview visually reviewed, uncropped full-body demonstrations for skipping rope, push-ups, and kettlebell clean and press. Videos have slow-motion controls and explicit offline saving; see EXERCISE_MEDIA.md for sources and limits.
9. Use the mobile-first training dashboard, weekly activity, exercise search, and local profile/install screen. The PWA uses the requested rust, sand, clay, emerald, and off-white palette with safe-area-aware navigation and generated install icons.
10. Record actual reps and loads for every set, review completed or partial sessions, add RPE and notes, explicitly abandon interrupted workouts, and inspect detailed finalized records in Activity.
11. Evaluate finalized sessions with the versioned progression engine. Safety overrides ordinary progression; stable exposures can add reps or test an available load, repeated strain can regress work, three-exposure stagnation can flag a plateau, and combined recovery signals can trigger a seven-day deload. Decisions and reason codes are stored and applied to the next generated workout.
12. Capture an optional baseline and biweekly assessments, detect comparable personal records from finalized set logs, calculate rolling performance scores with grade/trend confidence, and view score/category charts in Progress.

## Architecture now in place

- `apps/web`: React PWA, Redux application state, Dexie persistence, responsive product UI.
- `packages/domain`: Zod contracts shared by the app and engines.
- `packages/training-engine`: pure deterministic readiness, workout, and pain-decision logic.
- `apps/api`: Express sync API with PostgreSQL/Drizzle migration foundation, health/readiness endpoints, and an offline-safe session sync boundary.
- Tests: domain validation, readiness boundaries, workout determinism, pain decisions, IndexedDB persistence, media catalog safety, video fallback behavior, and application bootstrap.

## Development sequence from here

### Redesign verification — 18 October 2026

- Automated tests cover API, web, domain, session lifecycle, and progression rule boundaries; lint, typecheck, and production build pass.
- Inspected desktop and 390px phone layouts, navigation, exercise search, full-frame video sizing, and half-speed playback.
- Verified workout pause disables completion/skip, and refreshing preserves the current exercise.
- Verified the production PWA reloads with its local server stopped and plays an explicitly saved video from a Blob URL at 0.5× speed.
- Physical iOS/Android installation and a full accessibility audit remain release checks; browser verification is not a substitute for those.

### Next development slices

1. Program depth: add exercise-specific prerequisites, full block completion reviews, and a dedicated Grandmaster readiness review to the implemented tier templates.
2. Editable profile and settings, including additional owned kettlebell loads that unlock real load trials.
3. Sync client and identity: connect the optional API from the PWA, add an offline mutation queue, account authentication, conflict policy, and append-safe pain-event synchronization.
4. Coaching layer: explanations and summaries derived from deterministic engine output, never allowed to override safety logic.
5. Production hardening: end-to-end browser tests, accessibility audit, observability, privacy controls, deployment, and staged rollout.

## Explicit boundaries

- The sync API exists but is not yet connected to the PWA or deployed. Data is still local to the browser profile unless a client explicitly uses the API.
- Profile displays saved settings and installation guidance; it is not yet a profile editor. Assessments and progress analytics are local-first and are not yet synchronized.
- The app provides training guidance, not medical diagnosis.
- The current generator supports the Novice level only.
- Exercise media is deliberately allowlisted after movement review. Unreviewed or merely similar footage is not shown; those exercises retain written cues while exact demonstrations are sourced or produced.
