# BellGrinda

BellGrinda is a local-first progressive training PWA for kettlebell and bodyweight workouts.

## Commands

```bash
npm install
npm run dev
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
- in-session pain reporting, approved substitutions, and severe-pain stop flow;
- searchable 16-movement library with original written cues;
- full-body live-action human demos for every kettlebell exercise, plus skipping and push-up videos, with source attribution, slow motion, opt-in offline saving, and written-cue fallback;
- local workout history;
- shared runtime-validated domain contracts and automated tests.

See [docs/BUILD_STATUS.md](docs/BUILD_STATUS.md) for the delivery sequence and current boundaries.
