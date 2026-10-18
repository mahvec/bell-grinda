# BellGrinda Implementation Roadmap & Milestone Specification

**Version:** 0.1  
**Purpose:** Define the order in which BellGrinda should be implemented, tested, validated, and expanded from foundation to V1.  
**Primary Platform:** React + TypeScript PWA  
**Backend:** Express.js + TypeScript  
**Database:** PostgreSQL + Drizzle ORM  
**Local Persistence:** IndexedDB + Dexie  
**Architecture:** Local-first, deterministic-engine-led, AI-assisted  
**Core Implementation Principle:** Build BellGrinda in the order that reduces product risk, not in the order that looks most impressive.

---

# 1. Roadmap Objective

BellGrinda should reach useful functionality as early as possible while preserving the architectural decisions already made.

The roadmap must prioritize:

1. reliable workout execution;
2. persistence;
3. deterministic training logic;
4. safety;
5. progress tracking;
6. cloud synchronization;
7. AI;
8. polish.

The user should be able to genuinely train with BellGrinda before AI or advanced backend functionality is complete.

---

# 2. What Should Be Built First

The first working BellGrinda does not need:

- AI Coach;
- cloud sync;
- advanced charts;
- subscriptions;
- authentication;
- video form analysis;
- complex admin tools.

It does need:

- onboarding;
- equipment;
- training state;
- workout generation;
- readiness;
- Workout Player;
- local persistence;
- workout history;
- crash/reload recovery.

That becomes the first real product milestone.

---

# 3. Roadmap Structure

Recommended implementation sequence:

```text id="bgroad01"
Milestone 0 — Repository & Architecture Foundation
Milestone 1 — Core Domain & Exercise Library
Milestone 2 — Onboarding & Local User State
Milestone 3 — Readiness, Safety & Workout Generation
Milestone 4 — Workout Player & Session Persistence
Milestone 5 — Local History, Assessments & Progress
Milestone 6 — Backend & PostgreSQL
Milestone 7 — Offline Sync & Conflict Handling
Milestone 8 — AI Recap & Coach
Milestone 9 — Voice & PWA Polish
Milestone 10 — V1 Validation & Release
```

---

# 4. Milestone 0 — Repository & Architecture Foundation

## Goal

Create the project structure that BellGrinda will build on.

Do not build major product features yet.

---

# 5. Milestone 0 Deliverables

Create:

```text id="bgroad02"
bellgrinda/
├── apps/
│   ├── web/
│   └── api/
├── packages/
│   ├── training-engine/
│   ├── domain/
│   ├── schemas/
│   └── shared/
├── docs/
└── package.json
```

Configure:

- pnpm workspaces;
- TypeScript;
- ESLint;
- Prettier if desired;
- shared tsconfig;
- Vite;
- Express;
- basic test tooling.

---

# 6. Frontend Foundation

Install/configure:

- React.
- TypeScript.
- Vite.
- React Router.
- Redux Toolkit.
- RTK Query.
- Tailwind CSS.
- Zod.
- Dexie.
- date-fns.
- Sonner.

Framer Motion can be installed later if needed.

---

# 7. Backend Foundation

Create Express.js app with:

- `app.ts`;
- `server.ts`;
- CORS;
- Helmet;
- JSON parser;
- request ID middleware;
- centralized error handler;
- `/api/v1/health`.

At this milestone:

PostgreSQL may be configured but does not yet need the full schema.

---

# 8. Testing Foundation

Set up:

- Vitest or comparable unit-test framework.
- React Testing Library.
- Supertest for Express.
- Playwright for E2E later.

The exact tooling can change, but tests should be available before engine implementation.

---

# 9. Milestone 0 Acceptance Criteria

Milestone complete when:

- monorepo installs from root;
- web app starts;
- API starts;
- `/api/v1/health` works;
- shared package imports work;
- frontend routing works;
- tests can execute.

---

# 10. Milestone 1 — Core Domain & Exercise Library

## Goal

Create the stable domain vocabulary BellGrinda depends on.

This should happen before complex UI.

---

# 11. Milestone 1 Domain Types

Implement core types/enums:

- TrainingLevel.
- PerformanceGrade.
- ReadinessStatus.
- ExerciseSafetyStatus.
- WorkoutSessionStatus.
- TrainingGoal.
- ProgressionState.
- LoadStatus.
- SkillStatus.
- PainSeverity.

---

# 12. Exercise Library Model

Implement:

- Exercise.
- ExerciseVariation.
- ExerciseSubstitution.
- movement patterns.
- categories.
- equipment requirements.
- training-level suitability.
- fatigue/technical metadata.

---

# 13. Initial Exercise Library

Seed at least:

- Kettlebell Deadlift.
- Goblet Squat.
- Kettlebell Swing.
- One-Arm Row.
- Overhead Press.
- Clean.
- Clean & Press.
- Snatch.
- Reverse Lunge.
- Floor Press.
- Push-Up.
- Glute Bridge.
- Dead Bug.
- Skipping.
- Suitcase March/Carry-style movement if supported.

---

# 14. Push-Up Variations

Seed:

- Standard.
- Tempo.
- Pause.
- Decline.
- Decline Pause.
- Explosive where level-appropriate.

---

# 15. Exercise Relationship Data

Define:

- substitutions;
- progressions;
- regressions.

Example:

```text id="bgroad03"
Swing
 ↓
Deadlift
 ↓
Glute Bridge
```

for safer hinge regression.

---

# 16. Training Structure Configuration

Implement data/configuration for:

- Novice.
- Advanced Novice.
- Intermediate.
- Advanced.
- Grandmaster.

Early levels need:

- phases;
- default duration;
- day focus.

---

# 17. Milestone 1 Testing

Test:

- exercise IDs unique;
- substitution targets valid;
- variation progressions valid;
- level metadata valid;
- every programmed exercise exists.

---

# 18. Milestone 1 Acceptance Criteria

Complete when:

- all V1 exercises are defined;
- variation chains work;
- substitutions work;
- training level definitions compile;
- shared types can be consumed by web/api/training-engine.

---

# 19. Milestone 2 — Onboarding & Local User State

## Goal

Allow BellGrinda to create the user's starting training state.

Still no backend dependency.

---

# 20. Onboarding Screens

Implement:

- Welcome.
- Baseline.
- Goals.
- Training availability.
- Equipment.
- Experience.
- Football/jogging.
- Safety/discomfort.
- Program summary.

---

# 21. Local User Model

Create local records for:

- user;
- training profile;
- goals;
- equipment;
- baseline assessment;
- user exercise state;
- current Training Level.

---

# 22. IndexedDB Initial Schema

Create Dexie database.

Suggested first stores:

```text id="bgroad04"
users
trainingProfiles
goals
equipment
exerciseStates
assessments
settings
```

---

# 23. Redux Hydration

Implement startup flow:

```text id="bgroad05"
App Launch
 ↓
Initialize Dexie
 ↓
Load local profile
 ↓
Hydrate Redux
 ↓
Route to Setup or Dashboard
```

---

# 24. Local User Identity

Generate:

```text id="bgroad06"
LOCAL_USER UUID
```

Do not hardcode literal `"LOCAL_USER"` where future sync would require a UUID.

Use stable local UUID.

---

# 25. Baseline Assessment

Persist:

- weight;
- height;
- optional chest/waist;
- push-up max;
- initial pain state;
- equipment.

---

# 26. Milestone 2 Acceptance Criteria

The user can:

- install/open BellGrinda;
- complete onboarding;
- close the app;
- reopen;
- retain profile/equipment/baseline;
- land on Dashboard.

No Express backend required.

---

# 27. Milestone 3 — Readiness, Safety & Workout Generation

## Goal

Generate a valid daily workout deterministically.

This milestone creates BellGrinda's "brain."

---

# 28. Readiness Engine

Implement:

- Energy.
- Sleep.
- Soreness.
- Pain.
- Football context.

Output:

```text id="bgroad07"
GREEN
YELLOW
RED
```

with:

- score;
- reason codes.

---

# 29. Safety Engine

Implement:

- pain event interpretation;
- exercise safety states;
- repeated mild discomfort logic;
- moderate/severe handling;
- reintroduction states;
- swing-specific conservative rules.

---

# 30. Progression Engine — Initial Slice

Do not implement every advanced rule immediately.

V1 first slice should support:

- Hold.
- Progress reps.
- Progress load.
- Regress.
- Restrict.
- Load Trial.

Later add:

- density;
- complexes;
- advanced priority blocks.

---

# 31. Workout Generator

Implement:

- day focus;
- level;
- phase;
- readiness;
- equipment;
- safety restrictions;
- progression state;
- football context;
- 40-minute target;
- 5-slot circuit default.

---

# 32. Novice Generator First

Build and validate Novice before all other levels.

Test:

- Monday.
- Tuesday.
- Wednesday.
- Thursday.
- football-aware Friday.

Do not attempt Grandmaster generation first.

---

# 33. Advanced Novice & Intermediate

After Novice works:

Add:

- increased unilateral work;
- heavier bell trials;
- harder push-up variations;
- simple complexes;
- mixed-load rules.

---

# 34. Advanced/Grandmaster Initial Support

For V1, implement enough structure so the architecture supports them.

Full adaptive behavior can come after the early-level system is proven.

Do not delay usable Novice/Intermediate training to perfect Grandmaster logic.

---

# 35. Generation Validation

Every generated workout must pass:

- equipment validation;
- safety validation;
- level validation;
- duration estimate;
- fatigue budget;
- duplicate-pattern checks;
- load approval checks.

---

# 36. Reason Codes

Generator must return reason codes.

Example:

```text id="bgroad08"
READINESS_GREEN
MONDAY_STRENGTH
ROW_REP_PROGRESSION
SWING_MONITORED
FOOTBALL_LOW_LOAD
```

---

# 37. Milestone 3 Testing

High-value unit tests:

- Yellow recovery adjustment;
- Red recovery session;
- restricted swing removed;
- unavailable 16 kg never prescribed;
- Friday football adjustment;
- approved load respected;
- duration remains near target.

---

# 38. Milestone 3 Acceptance Criteria

BellGrinda can:

- run readiness check;
- produce today's workout;
- explain why;
- avoid unsafe/unavailable exercises;
- persist generated workout locally.

---

# 39. Milestone 4 — Workout Player & Session Persistence

## Goal

This is the most important implementation milestone.

BellGrinda becomes genuinely usable for training here.

---

# 40. Workout Player Core

Implement:

- Round X / Y.
- Exercise X / Y.
- name.
- reps.
- load.
- cues.
- Complete.
- Rep adjustment.
- Load adjustment.
- Substitute.
- Skip.
- Report discomfort.
- Pause.
- End Workout.

---

# 41. Active Session Model

Persist:

- session ID;
- workout ID;
- status;
- current round;
- exercise index;
- completed records;
- actual reps;
- actual load;
- substitutions;
- pain;
- timestamps;
- timer state.

---

# 42. Exercise Completion Flow

Implement transaction:

```text id="bgroad09"
Tap Complete
 ↓
Create/Update ExerciseSessionRecord
 ↓
Update WorkoutSession
 ↓
Persist Dexie Transaction
 ↓
Update Redux
 ↓
Advance UI
```

---

# 43. Rest Timer

Implement timestamp-based timers.

Persist:

```text id="bgroad10"
restStartedAt
restDurationSeconds
```

Never rely solely on decrementing state.

---

# 44. App Interruption

Test:

- refresh;
- tab change;
- lock/unlock;
- PWA close;
- browser close;
- device restart where testable.

Exact workout position must restore.

---

# 45. Resume Logic

Short interruption:

resume directly.

Long interruption:

show:

**Workout in Progress**

with:

- Resume.
- Save Partial.
- Abandon.

---

# 46. Pause

Explicit Pause should:

- stop active-time accounting;
- persist paused state;
- survive reload.

Backgrounding alone does not equal pause.

---

# 47. Pain Reporting

Implement workout-time safety interaction.

Pain events must persist immediately.

Moderate/severe reports must modify current session according to Safety Engine.

---

# 48. Substitution

Allow:

- current round;
- remaining session.

Persist:

- original exercise;
- substitute;
- reason;
- starting round.

---

# 49. Partial/Abandoned Session

Implement:

- Save Partial.
- Abandon.

Preserve completed data.

Do not delete incomplete session history automatically.

---

# 50. Session Review

After workout:

- duration;
- rounds;
- actual reps/load;
- RPE;
- notes;
- pain recap.

---

# 51. Post-Session Engine Processing

After finalization:

1. PR evaluation.
2. Progression evaluation.
3. Exercise state update.
4. local analytics update.

AI does not run yet.

---

# 52. Milestone 4 Acceptance Criteria

BellGrinda V1 Alpha is usable when:

- user can complete full workout;
- workout works offline;
- refresh does not lose state;
- rest timers recover;
- reps/load persist;
- pain persists;
- session review works;
- next workout can use previous performance.

This is the first major internal release.

---

# 53. Suggested Internal Release

Name:

**BellGrinda Alpha — Trainable Build**

This should be used for real workouts before continuing.

The purpose is to expose flaws in:

- workout UX;
- progression;
- persistence;
- exercise selection.

---

# 54. Milestone 5 — Local History, Assessments & Progress

## Goal

Turn workout history into visible evidence.

---

# 55. Workout History

Implement:

- session list;
- session detail;
- complete/partial state;
- RPE;
- exercises;
- notes;
- pain;
- PRs.

---

# 56. Personal Records

Implement deterministic PR detection for:

- load;
- reps at load;
- push-up benchmark;
- standardized tests.

Avoid complex records initially.

---

# 57. Assessments

Implement:

- baseline;
- biweekly;
- level completion;
- December Initial Assessment structure.

---

# 58. Biweekly Assessment

Support:

- weight;
- waist;
- chest;
- standard push-up max;
- optional notes.

Automatically calculate:

- consistency;
- session RPE trend;
- key progression;
- PRs.

---

# 59. Performance Scoring — Initial Version

Implement Performance Grade Engine.

Start with:

- available early-level categories;
- 0–100 normalization;
- Developing/Competent/Strong/Excellent;
- confidence state.

---

# 60. Progress Dashboard

Implement:

- Training Level.
- Performance Grade.
- consistency.
- push-ups.
- key exercise progression.
- recent PR.
- next assessment.

Do not build every chart initially.

---

# 61. Exercise Progress

Implement per-exercise history:

```text id="bgroad11"
12 kg × 10
12 kg × 12
12 kg × 15
16 kg × 8
16 kg × 10
```

---

# 62. Milestone 5 Acceptance Criteria

The user can answer from BellGrinda:

- How many workouts did I complete?
- Am I more consistent?
- Did my push-ups improve?
- What load am I using now?
- What are my PRs?
- What changed since baseline?

---

# 63. Milestone 6 — Backend & PostgreSQL

## Goal

Introduce cloud persistence without changing local workout behavior.

---

# 64. Database Setup

Implement Drizzle migrations in planned sequence.

Start with tables required for:

- users;
- profiles;
- equipment;
- exercises;
- workouts;
- sessions;
- safety;
- assessments.

---

# 65. Static Seeds

Seed:

- exercises;
- variations;
- substitutions;
- phases;
- workout templates.

Verify seed idempotency.

---

# 66. Express Foundation Expansion

Implement:

- validation middleware;
- standard response envelope;
- errors;
- request IDs;
- repositories;
- services;
- database client.

---

# 67. Read API

Implement:

- profile.
- equipment.
- exercises.
- program.
- workouts.
- sessions.
- assessments.
- performance.
- PRs.

---

# 68. No Workflow Change

Even with backend active:

```text id="bgroad12"
Workout Player
```

must still write locally first.

Do not rewrite the app into online-first architecture.

---

# 69. Milestone 6 Acceptance Criteria

- PostgreSQL migrations work.
- Seed runs cleanly.
- Express reads/writes records.
- local application still works with API offline.
- backend can represent existing local data.

---

# 70. Milestone 7 — Offline Sync & Conflict Handling

## Goal

Safely synchronize local training data.

---

# 71. Client Sync Queue

Implement IndexedDB:

```text id="bgroad13"
syncQueue
```

Each operation stores:

- operation ID;
- entity;
- entity ID;
- UPSERT/DELETE;
- base version;
- payload;
- attempts.

---

# 72. Push Sync

Implement:

```text id="bgroad14"
POST /api/v1/sync
```

Support batches.

---

# 73. Idempotency

Retry same operation repeatedly.

Expected:

**one server record**

not duplicates.

---

# 74. Version Conflicts

Implement server version checks.

Return explicit conflicts.

Do not silently overwrite.

---

# 75. Pull Sync

Implement simple pull:

```text id="bgroad15"
GET /api/v1/sync/changes
```

Cursor support should be preferred for eventual multi-device use.

---

# 76. Sync Safety

Special-case policies:

- PainEvents preserve both.
- Active local workout beats stale server active state.
- deleted records use tombstones.
- server must not replace active local session accidentally.

---

# 77. Sync UX

User generally sees:

- Saved locally.
- Synced.
- Sync pending.

No technical queue interface required for ordinary use.

---

# 78. Offline Acceptance Test

Mandatory E2E:

1. Start online.
2. Disconnect.
3. Complete workout.
4. Close application.
5. Reopen offline.
6. Confirm workout.
7. Reconnect.
8. Sync.
9. Verify server.
10. Retry sync.
11. Verify no duplicate.

---

# 79. Milestone 7 Acceptance Criteria

BellGrinda is now:

**local-first + cloud-backed**

without compromising workout reliability.

---

# 80. Milestone 8 — AI Recap & Coach

## Goal

Add AI only after deterministic data is trustworthy.

---

# 81. AI Gateway

Implement Express-side:

```text id="bgroad16"
AI Gateway
├── Model Router
├── Provider Adapters
├── Context Builder
├── Prompt Templates
└── Output Schemas
```

---

# 82. Provider Strategy

Implement abstraction first.

Then connect one primary provider.

Do not integrate multiple providers on day one unless fallback is genuinely required.

---

# 83. Workout Recap

This should be the first production AI feature.

Why:

- constrained context;
- easy to validate;
- visible user value;
- low interaction complexity.

---

# 84. Workout Recap Flow

```text id="bgroad17"
Workout Completed
 ↓
Progression/Analytics Complete
 ↓
Build Structured Context
 ↓
AI Gateway
 ↓
Validate Result
 ↓
Store AIInsight
 ↓
Display
```

---

# 85. Biweekly AI Report

Second AI feature.

Inputs:

- assessment;
- previous assessment;
- workouts;
- PRs;
- Performance Grade;
- safety/recovery.

---

# 86. AI Coach

Third AI feature.

Implement:

- conversation screen;
- intent classification;
- controlled data retrieval;
- read-only context.

Do not give AI database mutation tools in first version.

---

# 87. AI Safety Tests

Required cases:

- user asks to ignore restriction;
- asks for unapproved load;
- missing weight data;
- no comparable performance data.

AI must acknowledge engine state/missing evidence.

---

# 88. AI Failure Fallback

If unavailable:

show deterministic workout/progress summary.

Workout remains complete.

---

# 89. Milestone 8 Acceptance Criteria

- workout recaps grounded;
- assessment report grounded;
- Coach answers personal data questions;
- missing data not invented;
- AI cannot override Safety/Progression Engine;
- provider secrets never exposed client-side.

---

# 90. Milestone 9 — Voice & PWA Polish

## Goal

Improve workout usability after core system is stable.

---

# 91. Voice Guidance

Implement:

- exercise announcement;
- reps/load;
- round;
- rest;
- next exercise.

Start with Standard mode.

---

# 92. Voice Architecture

Use:

- browser/device speech where appropriate;
- or configured TTS provider.

Failure does not affect Workout Player.

---

# 93. Voice Queue

Priority:

1. Safety.
2. Exercise change.
3. Rest complete.
4. Coaching.
5. Motivation.

Drop obsolete cues.

---

# 94. PWA Installation

Finalize:

- manifest;
- icons;
- standalone mode;
- app shell caching;
- service-worker update UX.

---

# 95. Exercise Demo Caching

Implement:

- essential demo cache;
- optional Download for Offline later.

Do not preload every video.

---

# 96. Accessibility Pass

Test:

- contrast;
- touch targets;
- screen reader labels;
- keyboard;
- focus;
- reduced motion;
- semantic controls.

---

# 97. Responsive Pass

Validate:

- small phones;
- common Android sizes;
- iPhone viewport sizes;
- tablet;
- desktop.

Primary UX remains mobile-first.

---

# 98. Milestone 9 Acceptance Criteria

BellGrinda:

- installs as PWA;
- works offline;
- voice aids training;
- controls remain accessible;
- updates do not interrupt active workouts.

---

# 99. Milestone 10 — V1 Validation & Release

## Goal

Validate BellGrinda through real sustained use.

---

# 100. V1 Fitness Validation

Track:

- completed sessions;
- skipped sessions;
- recovery sessions;
- exercise progression;
- push-up improvement;
- Performance Grade;
- pain trends;
- assessments.

---

# 101. V1 Product Validation

Track:

- workout-start success;
- workout completion;
- crash recovery;
- resume usage;
- offline usage;
- sync failure;
- AI recap usage;
- Coach usage;
- voice usage.

---

# 102. December Initial Assessment

Important:

December 31 is:

**Initial Assessment**

not BellGrinda completion.

The app should produce:

- baseline comparison;
- consistency;
- performance;
- measurements;
- PRs;
- product feedback.

---

# 103. V1 Exit Criteria

BellGrinda V1 should not be considered successful merely because all features compile.

Minimum exit criteria:

- used repeatedly for real training;
- no recurring workout-state loss;
- safe substitutions/restrictions work;
- progression produces sensible changes;
- analytics match actual history;
- offline works;
- cloud sync does not duplicate;
- AI does not invent data.

---

# 104. Critical Path

The most important implementation dependency chain is:

```text id="bgroad18"
Domain Types
 ↓
Exercise Library
 ↓
Local User State
 ↓
Readiness/Safety
 ↓
Workout Generator
 ↓
Workout Player
 ↓
Session Persistence
 ↓
Progression
 ↓
History/Analytics
 ↓
Sync
 ↓
AI
```

AI is deliberately near the end.

---

# 105. What Can Be Built in Parallel

Some tasks can run concurrently.

## After Foundation

Frontend onboarding and Exercise Library data can happen together.

## After Domain Engine Interfaces

Readiness and Safety can be developed in parallel.

## After Session Model

Workout UI and persistence repository can be developed together.

## After Local Analytics

Backend schema/API can be developed without blocking daily local use.

---

# 106. What Should Not Be Parallelized Too Early

Avoid simultaneously building:

- all levels;
- all charts;
- all AI providers;
- complex cloud sync;
- native app;
- subscriptions.

Too many moving pieces make it difficult to validate the actual training product.

---

# 107. Feature Priority Classification

## P0 — Essential

- onboarding;
- equipment;
- exercise library;
- readiness;
- safety;
- workout generation;
- Workout Player;
- persistence;
- resume;
- workout history.

## P1 — Core V1

- progression;
- assessments;
- PRs;
- Performance Grade;
- progress;
- backend;
- sync.

## P2 — AI / Enhancement

- recap;
- Coach;
- voice.

## P3 — Post-V1

- form analysis;
- full voice logging;
- subscriptions;
- React Native;
- coaches;
- admin portal.

---

# 108. MVP Definition

The practical MVP should stop after:

**Milestone 5**

not after the entire roadmap.

At that point BellGrinda can already:

- onboard;
- generate training;
- run workouts;
- survive interruption;
- adapt;
- track progress.

That is a real product.

Backend sync and AI can follow.

---

# 109. MVP Acceptance Criteria

MVP requires:

- installable PWA;
- local-first;
- Novice fully supported;
- Advanced Novice reasonably supported;
- Intermediate architecture prepared;
- 5-day weekly structure;
- readiness;
- pain handling;
- persistent Workout Player;
- assessments;
- basic progress.

---

# 110. V1 Definition

Full V1 should include:

- MVP;
- PostgreSQL;
- Express API;
- sync;
- AI recap;
- assessment AI insight;
- Coach;
- basic voice guidance.

---

# 111. V1.1 Definition

Potential:

- video form upload;
- form feedback;
- voice logging;
- improved Grandmaster system;
- advanced challenges;
- richer offline media.

---

# 112. Post-V1 Commercial Backlog

Potential:

- authentication;
- multiple users;
- paid subscriptions;
- entitlements;
- training packs;
- coach accounts;
- native mobile app;
- advanced AI;
- admin system.

---

# 113. Branch Strategy

Keep Git strategy simple.

Recommended:

```text id="bgroad19"
main
development
feature/*
fix/*
```

Alternative:

Trunk-based development also works well for a solo/small team.

Do not introduce complex Gitflow unless needed.

---

# 114. Recommended Practical Git Approach

For this project:

```text id="bgroad20"
main
feature/milestone-name
```

Merge small validated feature branches frequently.

Avoid months-long branches.

---

# 115. Commit Strategy

Commits should represent understandable changes.

Examples:

```text id="bgroad21"
feat(training-engine): add readiness classification
feat(workout): persist active session
fix(workout): restore rest timer after reload
test(safety): cover repeated mild pain
```

---

# 116. Specification-Driven Development

Every major module should link back to its specification.

Example:

```text id="bgroad22"
training-engine/readiness/
```

implements:

**Readiness, Recovery & Safety Specification**

This reduces architecture drift.

---

# 117. Definition of Done — Feature

A feature is complete when:

- requirements implemented;
- domain rules tested;
- persistence tested if applicable;
- offline behavior considered;
- error state handled;
- mobile UX checked;
- no known safety regression.

---

# 118. Definition of Done — Engine Rule

A deterministic rule is complete when:

- expected inputs defined;
- output defined;
- reason codes defined;
- unit tests added;
- edge cases added;
- version documented if released.

---

# 119. Definition of Done — Workout Feature

A workout feature additionally requires testing:

- refresh;
- app interruption;
- offline;
- repeated tap;
- partial state.

---

# 120. Testing Pyramid

BellGrinda should prioritize:

```text id="bgroad23"
Many Unit Tests
      ↓
Integration Tests
      ↓
Focused Component Tests
      ↓
Critical E2E Tests
```

Do not rely entirely on E2E.

---

# 121. High-Priority E2E Tests

## Flow 1

Onboarding → First Workout → Complete.

## Flow 2

Workout → Refresh → Resume.

## Flow 3

Workout → Offline → Complete → Reconnect.

## Flow 4

Pain → Substitute → Continue.

## Flow 5

Biweekly Assessment → Progress Update.

---

# 122. Regression Test Pack

Every significant release should test:

- active session recovery;
- timer restoration;
- pain restrictions;
- local persistence;
- workout generation;
- duplicate sync prevention.

---

# 123. Performance Targets

The app should feel instant for local operations.

Targets are product goals rather than hard SLA initially.

Examples:

- dashboard local render quickly;
- Complete tap response immediate;
- IndexedDB persistence unobtrusive;
- workout generation effectively instant;
- no network spinner during normal set completion.

---

# 124. Offline Testing Requirement

Offline must be tested deliberately.

Do not assume service-worker installation means the app is offline-capable.

Test:

- first installed state;
- cached launch;
- active workout;
- media unavailable;
- session completion;
- reconnect.

---

# 125. Device Testing

At minimum test:

- Chrome Android.
- installed Android PWA.
- desktop Chrome.

If available:

- iOS Safari/PWA.

Browser limitations should be documented.

---

# 126. Data Migration Testing

Every IndexedDB schema migration must test preservation of:

- active workout;
- pain events;
- workout history.

Every PostgreSQL migration should be tested against existing development data.

---

# 127. Release Environments

Recommended:

```text id="bgroad24"
Development
Staging
Production
```

Personal early MVP can use:

Development + Production.

Staging becomes more valuable once backend/sync/AI are active.

---

# 128. Feature Flags

Use flags for unfinished/high-risk functionality.

Examples:

```text id="bgroad25"
AI_COACH_ENABLED
SYNC_ENABLED
VOICE_GUIDANCE_ENABLED
ADVANCED_LEVEL_ENABLED
GRANDMASTER_ENABLED
```

This lets the core build remain stable.

---

# 129. Observability Before V1 Release

Add:

- frontend error reporting;
- backend logs;
- persistence failure logging;
- sync failure logging;
- AI provider failure tracking.

Do not require a full enterprise monitoring stack.

---

# 130. Development Risk — Biggest Product Risk

The biggest risk is not:

**AI quality.**

It is:

**BellGrinda prescribes something that feels wrong, loses workout progress, or creates friction while training.**

Therefore Workout Generation + Workout Player deserve the most testing.

---

# 131. Development Risk — Overengineering

Avoid spending early development time on:

- subscription architecture;
- multiple AI providers;
- complex backend scaling;
- admin portals;
- highly animated UI.

Validate personal use first.

---

# 132. Development Risk — Training Logic Complexity

Do not implement every advanced progression rule simultaneously.

Recommended progression:

```text id="bgroad26"
Novice
 ↓ validate
Advanced Novice
 ↓ validate
Intermediate
 ↓ validate
Advanced
 ↓
Grandmaster
```

The specifications can be complete even if implementation expands gradually.

---

# 133. Development Risk — Excessive Logging UX

During actual workouts:

BellGrinda should not require:

- per-set form questionnaire;
- constant RPE;
- excessive confirmations.

Most sets:

**one tap**

should be enough.

---

# 134. Development Risk — AI Scope Creep

AI should not delay MVP.

BellGrinda without AI must already be valuable.

If it is not, AI will not fix the product.

---

# 135. Suggested Build Releases

## Build 0.1

Foundation.

## Build 0.2

Onboarding + Exercise Library.

## Build 0.3

Readiness + generated Novice workout.

## Build 0.4

Workout Player.

## Build 0.5

Persistence/resume.

## Build 0.6

Progression/history.

## Build 0.7

Assessments/progress.

### MVP

Local-first BellGrinda.

## Build 0.8

Backend/database.

## Build 0.9

Cloud sync.

## Build 1.0

AI + voice + release polish.

---

# 136. Real-Training Validation Loop

After Workout Player is usable:

```text id="bgroad27"
Use BellGrinda
 ↓
Record Problems
 ↓
Fix UX/Rules
 ↓
Train Again
 ↓
Collect More Data
 ↓
Adjust Engine
```

Do not wait until V1 to begin using it.

---

# 137. Validation Questions

After each real session ask:

- Was today's workout sensible?
- Was any exercise annoying to log?
- Did load selection make sense?
- Was rest timing practical?
- Did the workout fit 40 minutes?
- Was anything unnecessary?
- Did state restore correctly?

---

# 138. Weekly Product Review

During personal testing, review:

- completed workouts;
- bugs;
- generator issues;
- pain handling;
- session duration;
- UI friction;
- missed features.

This is more useful than adding features continuously.

---

# 139. Product Feedback Backlog

Maintain categories:

```text id="bgroad28"
BUG
TRAINING_LOGIC
UX_FRICTION
SAFETY
ANALYTICS
FEATURE_REQUEST
AI
```

Prioritize:

Safety → data loss → workout friction → logic → enhancements.

---

# 140. Bug Severity

## Critical

- workout data loss;
- pain restriction ignored;
- corrupted session;
- duplicate destructive sync.

## High

- wrong progression;
- wrong exercise load;
- resume failure.

## Medium

- analytics discrepancy;
- navigation issue.

## Low

- cosmetic issue.

---

# 141. Milestone Gate Rule

Do not move forward simply because code exists.

Each milestone must meet its acceptance criteria.

Example:

Do not begin AI because:

“the workout screen basically works.”

Workout persistence should be proven first.

---

# 142. MVP Release Gate

Before MVP:

- at least several real sessions completed;
- refresh recovery tested;
- offline session tested;
- pain path tested;
- progression reviewed manually;
- no critical persistence bug.

---

# 143. V1 Release Gate

Before V1:

- MVP proven;
- backend stable;
- migration reproducible;
- sync retry tested;
- duplicate prevention tested;
- AI safety tests passed;
- PWA install/update tested;
- no critical bugs.

---

# 144. Documentation Deliverables

Keep:

```text id="bgroad29"
docs/
├── prd/
├── training/
├── architecture/
├── api/
├── database/
├── decisions/
└── testing/
```

Important architecture decisions should not exist only in chat.

---

# 145. Architecture Decision Records

For important choices, optionally maintain ADRs.

Examples:

```text id="bgroad30"
ADR-001-local-first-workouts.md
ADR-002-express-backend.md
ADR-003-postgresql-drizzle.md
ADR-004-ai-is-non-authoritative.md
```

Useful when project grows.

---

# 146. Development Agent Strategy

Once this roadmap is approved, development should be broken into small agent tasks.

Each task should specify:

- objective;
- files/modules allowed;
- source specification;
- acceptance criteria;
- tests;
- things not to change.

Avoid one giant prompt:

**Build BellGrinda.**

---

# 147. Good Agent Task Example

```text id="bgroad31"
Implement the BellGrinda Readiness Engine.

Use:
- Readiness, Recovery & Safety Specification
- Technical Architecture Specification

Scope:
packages/training-engine/src/readiness/**

Do not modify:
UI
database
workout generator

Requirements:
...
Tests:
...
```

This makes agent output easier to review.

---

# 148. Agent Prompt Sequence

Recommended eventual prompt groups:

```text id="bgroad32"
001 Repository Foundation
002 Shared Domain Types
003 Exercise Library
004 Dexie Schema
005 Onboarding
006 Readiness Engine
007 Safety Engine
008 Progression Engine Slice 1
009 Workout Generator Novice
010 Dashboard
011 Workout Preview
012 Workout Session Model
013 Workout Player
014 Rest Timer
015 Session Recovery
016 Pain/Substitution UX
017 Session Finalization
018 PR Engine
019 Assessments
020 Performance Scoring
...
```

Continue incrementally.

---

# 149. Next Artifact

Now that implementation order is defined, the next logical document should be:

# BellGrinda Agent Development Task & Prompt Specification

This document should establish:

- standard task template;
- prompt numbering;
- task dependencies;
- required specification references;
- scope boundaries;
- acceptance criteria format;
- testing requirements;
- approval workflow;
- code-change restrictions;
- rollback expectations;
- how tasks move from Draft → Approved → Implemented → Verified.

Then the actual numbered BellGrinda implementation prompts can be created systematically, beginning with:

**Prompt 001 — Repository & Monorepo Foundation**

rather than attempting to implement the entire application in one large AI-agent request.
