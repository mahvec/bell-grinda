# BellGrinda

BellGrinda is a local-first progressive training PWA for kettlebell and bodyweight workouts.

## Commands

```bash
npm install
npm run dev
npm run dev --workspace @bellgrinda/api
npm test
npm run typecheck
npm run lint
npm run build
```

## Implemented foundation

- mobile-first installable PWA with rust/sand/emerald styling, touch navigation, and route-level code splitting;
- local onboarding and equipment profile;
- deterministic Novice readiness and workout engine;
- safety overrides for pain and football load;
- persistent, resumable workout sessions in IndexedDB;
- per-set actual reps and load logging, completion review with RPE and notes, and explicit partial or abandoned outcomes;
- deterministic progression decisions for holds, rep increases, load trials, regressions, pain restrictions, plateaus, and recovery deloads;
- in-session pain reporting, approved substitutions, and severe-pain stop flow;
- searchable 16-movement library with original written cues;
- full-body live-action human demos for every kettlebell exercise, plus skipping and push-up videos, with source attribution, slow motion, opt-in offline saving, and written-cue fallback;
- expandable local workout history with completion, duration, RPE, notes, sets, skips, substitutions, discomfort counts, and explainable next-session decisions;
- shared runtime-validated domain contracts and automated tests.

See [docs/BUILD_STATUS.md](docs/BUILD_STATUS.md) for the delivery sequence and current boundaries.

The optional sync API lives in `apps/api`. Its first release includes health checks, PostgreSQL migrations, a synced profile read, and atomic session/pain-event synchronization while the PWA remains local-first. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Vercel and Railway setup.
