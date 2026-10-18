# BellGrinda Technical Architecture & Data Model Specification

**Version:** 0.2
**Purpose:** Define the implementation architecture, module boundaries, state model, persistence strategy, backend design, data entities, synchronization model, and future scalability path for BellGrinda.
**Initial Product:** Mobile-first Progressive Web App
**V1 User Model:** Single-user personal application
**Future Direction:** Multi-user commercial fitness platform
**Primary Frontend Stack:** React + TypeScript
**State Management:** Redux Toolkit
**Local Persistence:** IndexedDB
**Styling:** Tailwind CSS
**Routing:** React Router
**PWA Strategy:** Service Worker + installable application shell
**Backend Framework:** Express.js + TypeScript
**Database:** PostgreSQL
**ORM:** Drizzle ORM recommended
**Core Architectural Principle:** Training must continue even when network services, AI services, or backend synchronization are unavailable.

---

# 1. Architecture Goals

BellGrinda's technical architecture must support:

- mobile-first workout usage;
- reliable offline operation;
- instant workout interaction;
- persistent workout sessions;
- deterministic training logic;
- AI-assisted explanation;
- long-term historical analytics;
- modular equipment/training expansion;
- eventual authentication;
- future subscription features;
- future multi-device synchronization;
- future multi-user support.

The architecture must prioritize reliability over novelty.

---

# 2. Architectural Principles

BellGrinda should follow the following principles:

1. **Local-first workout execution.**
2. **Deterministic engines control training.**
3. **AI remains downstream of verified data.**
4. **Workout state must survive interruption.**
5. **Offline functionality is a core feature.**
6. **Domain logic must remain independent from UI components.**
7. **Every important decision must be auditable.**
8. **V1 remains simple while data structures remain multi-user-ready.**
9. **Backend outages must not stop workouts.**
10. **External providers must be replaceable.**
11. **Express.js should remain an API delivery layer, not the location of core training logic.**

---

# 3. High-Level System Architecture

Conceptually:

```text
BellGrinda PWA
│
├── UI Layer
│
├── Application State
│
├── Training Domain Engines
│
├── Local Persistence
│
├── Synchronization Layer
│
└── API Client
      │
      ▼
BellGrinda Backend
│
├── Express.js API Layer
├── Authentication Layer (Future/V1-ready)
├── Training Data Services
├── Analytics Services
├── AI Gateway
├── Sync Services
└── Persistent Database
      │
      ├── PostgreSQL
      ├── File/Object Storage
      └── External AI Providers
```

---

# 4. Local-First Architecture

The most important architectural decision is:

**The workout runs locally.**

During an active session, the frontend should not need a server response to:

- advance exercises;
- record reps;
- change weight;
- complete rounds;
- run timers;
- substitute exercises;
- report pain;
- pause;
- resume;
- complete the workout.

Critical workout logic must live in the application.

---

# 5. Backend Responsibility

The Express.js backend should primarily handle:

- long-term data persistence;
- synchronization;
- future authentication;
- multi-device access;
- AI API routing;
- analytics aggregation where useful;
- future subscription state;
- file/media metadata;
- future administrative functionality.

The backend should not become a dependency for every workout interaction.

---

# 6. Proposed Frontend Stack

Recommended:

```text
React
TypeScript
Vite
React Router
Redux Toolkit
RTK Query
Tailwind CSS
IndexedDB
Service Worker / PWA tooling
```

Optional supporting libraries:

```text
Zod
date-fns
Sonner
Framer Motion
Dexie
```

Use libraries only when they reduce complexity.

---

# 7. Why Redux Toolkit

Redux Toolkit is appropriate because BellGrinda has substantial structured domain state:

- active workout;
- user training state;
- current program;
- equipment;
- readiness;
- safety states;
- assessments;
- sync state;
- application settings.

Redux should manage active application state.

It should not itself be considered permanent storage.

---

# 8. Redux vs IndexedDB

BellGrinda should follow:

```text
IndexedDB
   ↓ hydrate
Redux Store
   ↓ UI
User Action
   ↓
Redux Update
   ↓
Persistence Middleware/Repository
   ↓
IndexedDB
```

Redux:

**Fast active state**

IndexedDB:

**Durable local state**

---

# 9. Redux Store Domains

Suggested slices:

```text
store/
├── userSlice
├── trainingStateSlice
├── workoutSessionSlice
├── equipmentSlice
├── readinessSlice
├── safetySlice
├── assessmentSlice
├── progressSlice
├── settingsSlice
└── syncSlice
```

Not every database entity needs its own Redux slice.

---

# 10. Server State

Use RTK Query for server-backed state such as:

- historical sync;
- AI reports;
- account data;
- future subscription status;
- backend configuration.

RTK Query should not replace IndexedDB for active workout persistence.

---

# 11. Frontend Layer Separation

Recommended layers:

```text
Presentation
↓
Application
↓
Domain
↓
Data
↓
Infrastructure
```

Each layer should have clear responsibility.

---

# 12. Presentation Layer

Responsible for:

- screens;
- components;
- forms;
- charts;
- modals;
- workout UI.

Examples:

```text
Dashboard
WorkoutPlayer
ProgressDashboard
AssessmentScreen
AICoach
Settings
```

Presentation components should not contain complex progression algorithms.

---

# 13. Application Layer

Coordinates use cases.

Examples:

- StartWorkout.
- CompleteExercise.
- ResumeWorkout.
- GenerateTodayWorkout.
- FinalizeWorkout.
- SubmitAssessment.
- SyncPendingRecords.

---

# 14. Domain Layer

Contains business rules.

Example modules:

```text
domain/
├── progression/
├── readiness/
├── safety/
├── workout-generation/
├── performance-scoring/
├── analytics/
├── personal-records/
└── training-levels/
```

These modules should ideally be framework-independent TypeScript.

---

# 15. Data Layer

Responsible for:

- repositories;
- IndexedDB access;
- API mapping;
- local/server entity conversion;
- synchronization state.

Example:

```text
data/
├── repositories/
├── indexeddb/
├── api/
├── mappers/
└── sync/
```

---

# 16. Infrastructure Layer

Responsible for:

- Express API client;
- AI provider interfaces;
- service worker;
- browser APIs;
- notification support;
- network detection;
- local storage utilities.

---

# 17. Suggested Project Structure

```text
src/
├── app/
│   ├── router/
│   ├── store/
│   ├── providers/
│   └── bootstrap/
│
├── features/
│   ├── dashboard/
│   ├── workout/
│   ├── progress/
│   ├── assessments/
│   ├── ai-coach/
│   ├── exercise-library/
│   └── settings/
│
├── domain/
│   ├── training/
│   ├── progression/
│   ├── readiness/
│   ├── safety/
│   ├── workout-generation/
│   ├── performance/
│   ├── analytics/
│   └── records/
│
├── data/
│   ├── local/
│   ├── remote/
│   ├── repositories/
│   ├── sync/
│   └── mappers/
│
├── ai/
│   ├── context/
│   ├── router/
│   ├── schemas/
│   └── prompts/
│
├── pwa/
│   ├── service-worker/
│   ├── cache/
│   └── lifecycle/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── constants/
│
└── main.tsx
```

---

# 18. Backend Stack

The official BellGrinda backend stack is:

```text
Node.js
TypeScript
Express.js
PostgreSQL
Drizzle ORM
Zod
```

Optional supporting backend packages may include:

- Helmet.
- CORS.
- Pino or another structured logger.
- Express Rate Limit.
- JSON Web Token library for future auth.
- Multer or direct object-storage upload strategy where needed.

---

# 19. Why Express.js

Express.js is selected because:

- it is mature;
- widely understood;
- easy to structure modularly;
- works naturally with TypeScript;
- has a large middleware ecosystem;
- provides enough control for BellGrinda without imposing a heavy architectural framework.

BellGrinda should avoid letting Express route/controller code become the business-logic layer.

---

# 20. Why PostgreSQL

BellGrinda data is strongly relational.

Examples:

- user → workouts;
- workout → exercise sessions;
- exercise → progression history;
- user → assessments;
- session → pain events;
- training level → blocks.

PostgreSQL is a strong fit for this structure.

---

# 21. ORM

Recommended:

**Drizzle ORM**

Alternative:

**Prisma**

Drizzle is preferred because:

- strong TypeScript integration;
- relatively transparent SQL model;
- lightweight abstraction;
- good fit for a modular Express backend.

Avoid designing the domain around ORM-specific behavior.

---

# 22. Future Authentication

V1 may operate without login.

However, persistent entities should already support:

```text
userId
```

V1 may use one local application user:

```text
LOCAL_USER
```

Later this can map to an authenticated backend user.

---

# 23. Future Authentication Providers

Potential future support:

- email/password;
- Google;
- Apple;
- passkeys.

This is intentionally outside V1.

---

# 24. Core Data Domains

BellGrinda's data model can be grouped into:

1. User/Profile.
2. Equipment.
3. Exercise Library.
4. Training Curriculum.
5. Workout Generation.
6. Workout Sessions.
7. Safety/Readiness.
8. Assessments.
9. Analytics.
10. Performance.
11. AI.
12. Synchronization.

---

# 25. User Entity

```ts
interface User {
  id: string;
  createdAt: string;
  updatedAt: string;

  displayName?: string;

  dateOfBirth?: string;
  heightCm?: number;

  currentTrainingLevel: TrainingLevel;
  currentPhase?: string;

  onboardingCompleted: boolean;
}
```

Avoid placing rapidly changing fitness measurements directly on the main User record.

---

# 26. User Training Profile

```ts
interface TrainingProfile {
  id: string;
  userId: string;

  primaryGoals: TrainingGoal[];
  preferredSessionMinutes: number;
  preferredTrainingDays: number[];

  baselineDate?: string;

  footballEnabled: boolean;
  joggingEnabled: boolean;

  createdAt: string;
  updatedAt: string;
}
```

---

# 27. Goal Entity

```ts
type TrainingGoal =
  | "ATHLETICISM"
  | "CONSISTENCY"
  | "STRENGTH"
  | "ENDURANCE"
  | "FAT_LOSS"
  | "CHEST_DEVELOPMENT"
  | "MUSCLE_GAIN";
```

Goal ordering should also be stored.

---

# 28. Equipment Entity

```ts
interface UserEquipment {
  id: string;
  userId: string;

  equipmentType: string;
  weightKg?: number;

  quantity: number;
  active: boolean;

  acquiredAt?: string;
}
```

Example:

```text
Kettlebell — 12 kg
Kettlebell — 16 kg
Kettlebell — 20 kg
Skipping Rope
Chair/Bench
Exercise Mat
```

---

# 29. Equipment Availability

Workout generation should query equipment records.

Owning equipment does not automatically mean:

**approved for every exercise**

Approved exercise loads remain separate.

---

# 30. Exercise Entity

```ts
interface Exercise {
  id: string;
  slug: string;

  name: string;

  equipmentTypes: string[];

  categories: string[];
  movementPatterns: string[];

  difficulty: ExerciseDifficulty;
  technicalDemand: FatigueLevel;
  fatigueCost: FatigueLevel;

  unilateral: boolean;
  ballistic: boolean;

  instructions: string[];
  coachingCues: string[];
  commonMistakes: string[];

  active: boolean;
}
```

---

# 31. Exercise Relationships

Exercise may relate to:

- progressions;
- regressions;
- substitutions;
- video demonstrations;
- approved Training Levels;
- load rules.

---

# 32. Exercise Variation Entity

```ts
interface ExerciseVariation {
  id: string;
  exerciseId: string;

  name: string;
  difficultyRank: number;

  minTrainingLevel?: TrainingLevel;
}
```

Examples:

Push-Up variations:

- Standard.
- Tempo.
- Pause.
- Decline.
- Decline Pause.

---

# 33. Exercise Substitution Entity

```ts
interface ExerciseSubstitution {
  id: string;

  exerciseId: string;
  substituteExerciseId: string;

  priority: number;

  reasonType?: string;
}
```

---

# 34. Exercise Progression Relationship

```ts
interface ExerciseProgression {
  fromVariationId: string;
  toVariationId: string;

  progressionType: string;
}
```

---

# 35. Exercise Media

```ts
interface ExerciseMedia {
  id: string;
  exerciseId: string;

  type: "VIDEO" | "IMAGE";
  url: string;

  downloadable: boolean;
  durationSeconds?: number;
}
```

---

# 36. User Exercise State

```ts
interface UserExerciseState {
  id: string;
  userId: string;
  exerciseId: string;

  currentVariationId?: string;

  currentWorkingLoadKg?: number;
  highestSuccessfulLoadKg?: number;

  loadStatus: "APPROVED" | "TRIAL" | "DEFERRED" | "RESTRICTED";

  progressionState: ProgressionState;

  skillStatus: "LEARNING" | "ESTABLISHED" | "PROGRESSING" | "MASTERED";

  lastUpdatedAt: string;
}
```

---

# 37. Approved Load History

```ts
interface ExerciseLoadHistory {
  id: string;
  userId: string;
  exerciseId: string;

  loadKg: number;
  state: string;

  reasonCode: string;
  date: string;
}
```

---

# 38. Training Level Entity

```text
NOVICE
ADVANCED_NOVICE
INTERMEDIATE
ADVANCED
GRANDMASTER
```

---

# 39. Training Level State

```ts
interface UserTrainingLevelState {
  id: string;
  userId: string;

  level: TrainingLevel;

  startedAt: string;
  completedAt?: string;

  performanceGradeAtStart?: string;
  performanceGradeAtEnd?: string;

  status: "ACTIVE" | "COMPLETED" | "REPEATED";
}
```

---

# 40. Training Phase Entity

```ts
interface TrainingPhase {
  id: string;

  trainingLevel: TrainingLevel;
  phaseNumber: number;
  name: string;

  defaultDurationWeeks: number;
}
```

---

# 41. Training Block

```ts
interface TrainingBlock {
  id: string;
  userId: string;

  trainingLevel: TrainingLevel;

  primaryPriority: string;
  secondaryPriority?: string;

  startedAt: string;
  plannedEndAt?: string;
  completedAt?: string;

  status: string;
}
```

---

# 42. Workout Template

```ts
interface WorkoutTemplate {
  id: string;

  trainingLevel: TrainingLevel;
  dayType: string;
  focus: string;

  defaultRounds: number;

  slotDefinitions: WorkoutSlotDefinition[];
}
```

---

# 43. Workout Slot Definition

```ts
interface WorkoutSlotDefinition {
  position: number;

  allowedMovementPatterns: string[];
  requiredTrainingEffects: string[];

  maxFatigue?: FatigueLevel;
}
```

---

# 44. Generated Workout

```ts
interface Workout {
  id: string;
  userId: string;

  date: string;

  trainingLevel: TrainingLevel;
  phaseId?: string;
  blockId?: string;

  focus: string;

  readinessStatus?: ReadinessStatus;
  footballStatus?: string;

  plannedRounds: number;

  estimatedDurationMinutes: number;

  generatorVersion: string;

  createdAt: string;
}
```

---

# 45. Workout Exercise Prescription

```ts
interface WorkoutExercise {
  id: string;
  workoutId: string;

  exerciseId: string;
  variationId?: string;

  orderIndex: number;

  plannedLoadKg?: number;
  plannedReps: number;
  repsPerSide?: boolean;

  restAfterSeconds?: number;

  progressionReasonCode?: string;
}
```

---

# 46. Workout Snapshot

When a workout session begins, prescriptions are copied into a stable session snapshot.

Future generator changes must never silently alter an already-started workout.

---

# 47. Workout Session

```ts
interface WorkoutSession {
  id: string;
  userId: string;
  workoutId: string;

  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "PARTIAL" | "ABANDONED";

  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;

  currentRound: number;
  currentExerciseIndex: number;

  plannedRounds: number;
  completedRounds: number;

  readinessStatus: ReadinessStatus;

  sessionRpe?: number;

  notes?: string;

  schemaVersion: string;
}
```

---

# 48. Workout Exercise Session

```ts
interface ExerciseSessionRecord {
  id: string;
  sessionId: string;

  exerciseId: string;
  variationId?: string;

  round: number;

  plannedLoadKg?: number;
  actualLoadKg?: number;

  plannedReps: number;
  completedReps: number;

  status: "COMPLETED" | "SKIPPED" | "SUBSTITUTED" | "INCOMPLETE";

  rpe?: number;

  completedAt?: string;
}
```

---

# 49. Substitution Record

```ts
interface WorkoutSubstitution {
  id: string;
  sessionId: string;

  originalExerciseId: string;
  substituteExerciseId: string;

  startingRound: number;

  scope: "ROUND" | "REMAINING_SESSION";

  reason?: string;
}
```

---

# 50. Session Timer State

```ts
interface SessionTimerState {
  sessionId: string;

  restStartedAt?: string;
  restDurationSeconds?: number;
  restType?: string;

  pausedAt?: string;

  accumulatedPauseSeconds: number;
}
```

Do not persist countdown values alone.

---

# 51. Readiness Check

```ts
interface ReadinessCheck {
  id: string;
  userId: string;

  date: string;

  energy: number;
  sleepQuality: number;

  sorenessLevel: string;
  sorenessLocations: string[];

  painLevel?: string;
  painLocations?: string[];

  footballStatus?: string;

  score: number;

  classification: "GREEN" | "YELLOW" | "RED";

  reasonCodes: string[];
}
```

---

# 52. Pain Event

```ts
interface PainEvent {
  id: string;
  userId: string;

  sessionId?: string;
  exerciseId?: string;

  bodyLocation: string;
  severity: "MILD" | "MODERATE" | "SEVERE";

  source: "WORKOUT" | "FOOTBALL" | "JOGGING" | "OTHER";

  round?: number;

  notes?: string;

  occurredAt: string;
}
```

---

# 53. Exercise Safety State

```ts
interface ExerciseSafetyState {
  id: string;
  userId: string;
  exerciseId: string;

  status: "ACTIVE" | "MONITORED" | "RESTRICTED" | "REINTRODUCTION";

  reasonCodes: string[];

  restrictedAt?: string;
  lastPainAt?: string;

  successfulReintroductionExposures: number;

  updatedAt: string;
}
```

---

# 54. Recovery / Deload Record

```ts
interface RecoveryBlock {
  id: string;
  userId: string;

  type: "DELOAD" | "RECONDITIONING" | "RECOVERY";

  startedAt: string;
  endedAt?: string;

  triggerReasons: string[];

  status: string;
}
```

---

# 55. Assessment

```ts
interface Assessment {
  id: string;
  userId: string;

  type:
    | "BASELINE"
    | "BIWEEKLY"
    | "LEVEL_COMPLETION"
    | "DECEMBER_INITIAL"
    | "ANNUAL";

  date: string;

  bodyweightKg?: number;
  bodyweightSource?: "MEASURED" | "ESTIMATED";

  waistCm?: number;
  chestCm?: number;

  maxStandardPushups?: number;

  currentPushupVariationId?: string;

  notes?: string;
}
```

---

# 56. Performance Test

```ts
interface PerformanceTest {
  id: string;
  userId: string;

  trainingLevel: TrainingLevel;

  testType: string;

  date: string;

  results: PerformanceTestResult[];

  overallRpe?: number;
}
```

---

# 57. Performance Test Result

```ts
interface PerformanceTestResult {
  exerciseId?: string;

  loadKg?: number;
  reps?: number;

  durationSeconds?: number;

  rpe?: number;

  completed: boolean;
}
```

---

# 58. Performance Snapshot

```ts
interface PerformanceSnapshot {
  id: string;
  userId: string;

  date: string;

  trainingLevel: TrainingLevel;

  scoringVersion: string;

  overallScore: number;
  overallGrade: PerformanceGrade;

  trend: "IMPROVING" | "STABLE" | "DECLINING";

  confidence: "PRELIMINARY" | "ESTABLISHED";
}
```

---

# 59. Performance Category Score

```ts
interface PerformanceCategoryScore {
  id: string;
  snapshotId: string;

  category: string;

  score: number;
  grade: PerformanceGrade;

  trend: string;

  confidence: string;
}
```

---

# 60. Personal Record

```ts
interface PersonalRecord {
  id: string;
  userId: string;

  category: string;

  exerciseId?: string;
  variationId?: string;

  loadKg?: number;

  value: number;
  unit: string;

  achievedAt: string;

  sessionId?: string;

  previousRecordId?: string;
}
```

---

# 61. Progress Snapshot

```ts
interface ProgressSnapshot {
  id: string;
  userId: string;

  date: string;

  type: string;

  trainingLevel: TrainingLevel;

  performanceSnapshotId?: string;
  assessmentId?: string;

  consistencyPercent?: number;

  summaryData: Record<string, unknown>;
}
```

---

# 62. Football Activity

```ts
interface FootballActivity {
  id: string;
  userId: string;

  date: string;

  status: "RECREATIONAL" | "NORMAL" | "HIGH" | "COMPETITION" | "TOURNAMENT";

  durationMinutes?: number;
  rpe?: number;

  notes?: string;
}
```

---

# 63. Jogging Activity

```ts
interface JoggingActivity {
  id: string;
  userId: string;

  date: string;

  durationMinutes?: number;
  distanceKm?: number;

  rpe?: number;
}
```

---

# 64. Progression Decision

```ts
interface ProgressionDecision {
  id: string;
  userId: string;

  exerciseId?: string;

  decisionType: ProgressionState;

  previousState: Record<string, unknown>;
  newState: Record<string, unknown>;

  reasonCodes: string[];

  engineVersion: string;

  createdAt: string;
}
```

This is critical for explainability.

---

# 65. Workout Generation Decision

```ts
interface WorkoutGenerationRecord {
  id: string;
  workoutId: string;

  generatorVersion: string;

  inputSnapshot: Record<string, unknown>;

  reasonCodes: string[];

  generatedAt: string;
}
```

---

# 66. AI Insight

```ts
interface AIInsight {
  id: string;
  userId: string;

  type:
    | "WORKOUT_RECAP"
    | "ASSESSMENT_REPORT"
    | "LEVEL_REPORT"
    | "BLOCK_REPORT"
    | "DECEMBER_REPORT";

  sourceId: string;

  content: Record<string, unknown>;

  provider: string;
  model: string;
  promptVersion: string;

  status: "PENDING" | "GENERATED" | "FAILED";

  createdAt: string;
}
```

---

# 67. AI Conversation

```ts
interface AIConversation {
  id: string;
  userId: string;

  createdAt: string;
  updatedAt: string;
}
```

---

# 68. AI Message

```ts
interface AIMessage {
  id: string;
  conversationId: string;

  role: "USER" | "ASSISTANT";

  content: string;

  createdAt: string;
}
```

Important structured training changes should not exist only in conversation history.

---

# 69. Application Settings

```ts
interface UserSettings {
  userId: string;

  voiceEnabled: boolean;
  voiceMode: "MINIMAL" | "STANDARD" | "COACHING";

  theme: string;

  notificationsEnabled: boolean;
}
```

---

# 70. Sync Metadata

Each locally persisted syncable record should contain or map to:

```text
syncState
createdAt
updatedAt
serverVersion
```

Possible states:

```text
LOCAL_ONLY
PENDING
SYNCING
SYNCED
CONFLICT
FAILED
```

---

# 71. Sync Queue

```ts
interface SyncQueueItem {
  id: string;

  entityType: string;
  entityId: string;

  operation: "CREATE" | "UPDATE" | "DELETE";

  attempts: number;

  status: string;

  createdAt: string;
  lastAttemptAt?: string;
}
```

---

# 72. Local Database

Suggested IndexedDB stores:

```text
users
trainingProfiles
equipment
exerciseStates
workouts
activeSessions
exerciseSessionRecords
painEvents
safetyStates
readinessChecks
assessments
performanceSnapshots
personalRecords
activities
progressionDecisions
aiInsights
syncQueue
settings
```

Static exercise metadata may also be cached locally.

---

# 73. IndexedDB Wrapper

Recommended:

**Dexie**

This simplifies:

- schema versions;
- queries;
- transactions;
- migrations.

---

# 74. IndexedDB Schema Versioning

Example:

```text
BellGrindaDB v1
BellGrindaDB v2
BellGrindaDB v3
```

Every migration should preserve:

- active workout;
- safety data;
- history.

---

# 75. Transaction Boundaries

Critical workout actions should use transactions where multiple records change together.

Example:

Completing an exercise may update:

- workout session;
- exercise session record;
- lastUpdated timestamp.

These changes should not partially save.

---

# 76. Local Repository Pattern

```ts
interface WorkoutSessionRepository {
  getActiveSession(): Promise<WorkoutSession | null>;
  saveSession(session: WorkoutSession): Promise<void>;
  getSession(id: string): Promise<WorkoutSession | null>;
}
```

The domain layer should not call Dexie directly everywhere.

---

# 77. Backend Database

Production:

**PostgreSQL**

Backend access:

**Drizzle ORM**

Local IndexedDB schema and PostgreSQL schema do not need to be identical.

Use mapping layers.

---

# 78. Express.js Backend Architecture

BellGrinda should use a modular Express.js architecture.

Recommended:

```text
apps/api/
├── src/
│   ├── modules/
│   │   ├── users/
│   │   ├── equipment/
│   │   ├── exercises/
│   │   ├── workouts/
│   │   ├── workout-sessions/
│   │   ├── readiness/
│   │   ├── safety/
│   │   ├── assessments/
│   │   ├── progress/
│   │   ├── personal-records/
│   │   ├── activities/
│   │   ├── sync/
│   │   └── ai/
│   │
│   ├── database/
│   ├── middleware/
│   ├── config/
│   ├── shared/
│   ├── app.ts
│   └── server.ts
```

---

# 79. Express Module Structure

Each major module may follow:

```text
workouts/
├── workout.routes.ts
├── workout.controller.ts
├── workout.service.ts
├── workout.repository.ts
├── workout.schema.ts
└── workout.types.ts
```

Responsibilities:

## Route

Maps URL + HTTP method.

## Controller

Handles HTTP request/response.

## Schema

Validates request data.

## Service

Coordinates application/business use case.

## Repository

Reads/writes database.

---

# 80. Express Request Flow

```text
Client Request
      ↓
Express Router
      ↓
Global / Route Middleware
      ↓
Zod Validation
      ↓
Controller
      ↓
Application Service
      ↓
Repository / Domain Engine
      ↓
PostgreSQL
      ↓
Controller Response
```

Core training algorithms must not be implemented inside route handlers.

---

# 81. Express Application Entry

Recommended:

```text
src/app.ts
```

Responsible for:

- constructing Express app;
- parsing JSON;
- registering security middleware;
- registering routes;
- error handling.

Then:

```text
src/server.ts
```

Responsible for:

- environment loading;
- database initialization;
- starting HTTP server;
- graceful shutdown.

---

# 82. Express Middleware

Potential middleware:

- JSON parser.
- CORS.
- Helmet.
- Request logging.
- Rate limiting where appropriate.
- Authentication later.
- Request ID.
- Error middleware.

Example flow:

```text
helmet
cors
requestId
logger
jsonParser
routes
notFound
errorHandler
```

---

# 83. API Style

BellGrinda should use:

**REST API**

for V1.

This fits well with:

- Express.js;
- RTK Query;
- resource-oriented backend modules.

---

# 84. Example API Routes

```text
/api/v1/profile
/api/v1/equipment
/api/v1/exercises

/api/v1/workouts
/api/v1/workout-sessions

/api/v1/readiness
/api/v1/pain-events

/api/v1/assessments
/api/v1/performance
/api/v1/personal-records

/api/v1/activities

/api/v1/ai/coach
/api/v1/ai/workout-recap
/api/v1/ai/assessment-report

/api/v1/sync
```

---

# 85. Example Express Router

Conceptually:

```ts
const router = Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", validate(createSchema), controller.create);
router.patch("/:id", validate(updateSchema), controller.update);
```

Business logic remains in services/domain modules.

---

# 86. HTTP Response Convention

BellGrinda should use consistent response shapes.

Example:

```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

Do not create different response conventions for every module.

---

# 87. Error Handling

Controllers should pass errors into centralized Express error middleware.

The backend should distinguish:

- validation error;
- authentication error;
- authorization error;
- not found;
- conflict;
- rate limit;
- internal server error.

---

# 88. Sync API

Instead of sending every local action immediately:

```text
POST /api/v1/sync
```

may batch:

- creations;
- updates;
- tombstones;
- timestamps;
- record versions.

---

# 89. Idempotency

Every syncable entity should use a stable client-generated UUID.

Express services use the ID to prevent duplicates.

This is particularly important for:

- workout sessions;
- PainEvents;
- assessments.

---

# 90. UUID Generation

Client-generated:

```ts
crypto.randomUUID();
```

This allows offline data creation.

---

# 91. Conflict Resolution Philosophy

Prefer:

**No data loss**

over aggressive merging.

Safety data receives the highest preservation priority.

---

# 92. Conflict Rules

## Active Workout

Local active state wins over stale server state.

## Pain Event

Preserve both/union.

## Completed Workout

Most complete valid version wins.

## Settings

Most recent explicit change may win.

## Assessment

Preserve explicit edits.

---

# 93. Record Version

Server-backed entities may store:

```text
version
updatedAt
```

Optimistic concurrency can later use these fields.

---

# 94. Tombstones

Deletes should synchronize using:

```text
deletedAt
```

This prevents deleted records returning after another-device synchronization.

---

# 95. Online/Offline Detection

Do not trust `navigator.onLine` alone.

A device can technically be online while the Express backend is unreachable.

Sync behavior should also react to request failure.

---

# 96. Sync Retry

Use retry/backoff.

Example:

```text
1 minute
5 minutes
15 minutes
next launch
```

Training continues regardless.

---

# 97. Service Worker Responsibilities

The service worker handles:

- application shell;
- static assets;
- exercise media caching;
- application update lifecycle;
- optional background sync.

It should not contain core training business logic.

---

# 98. App Shell Cache

Cache:

- HTML shell.
- CSS.
- JS bundles.
- icons.
- critical static assets.

BellGrinda should open offline after an initial successful load/install.

---

# 99. Exercise Media Cache

Use selective caching for videos.

Options:

- recently viewed;
- Download for Offline;
- essential demo videos.

Do not automatically cache an enormous media library.

---

# 100. Update Strategy

When a new PWA version becomes available during an active workout:

Do not force reload.

Apply update after the workout or at a safe later point.

---

# 101. PWA Manifest

Define:

- name;
- short name;
- icons;
- display;
- start URL;
- theme colors.

Recommended:

```text
display: standalone
```

---

# 102. Route Architecture

Suggested:

```text
/
 /setup
 /dashboard

 /workout/today
 /workout/session/:id
 /workout/history
 /workout/history/:id

 /progress
 /progress/exercises/:id

 /assessments
 /assessments/:id

 /exercises
 /exercises/:id

 /coach

 /settings
```

---

# 103. Feature Modules

```text
features/workout/
├── components/
├── hooks/
├── pages/
├── services/
├── types/
└── selectors/
```

Domain rules remain separate where practical.

---

# 104. Engine Interfaces

```ts
interface ProgressionEngine {
  evaluateExercise(context: ProgressionContext): ProgressionDecision;
}
```

---

# 105. Readiness Engine

```ts
interface ReadinessEngine {
  evaluate(input: ReadinessInput): ReadinessResult;
}
```

---

# 106. Workout Generation Engine

```ts
interface WorkoutGenerator {
  generate(context: WorkoutGenerationContext): GeneratedWorkout;
}
```

---

# 107. Performance Engine

```ts
interface PerformanceEngine {
  calculate(context: PerformanceContext): PerformanceSnapshot;
}
```

---

# 108. Personal Record Engine

```ts
interface PersonalRecordEngine {
  evaluate(
    session: WorkoutSessionData,
    history: PersonalRecord[],
  ): PersonalRecord[];
}
```

---

# 109. Pure Function Preference

Engine logic should be as close to pure as practical.

```text
Input State
   ↓
Engine
   ↓
Decision
```

No hidden database or network calls inside training calculations.

---

# 110. Reason Codes

All engines should return stable reason codes.

```ts
interface EngineResult {
  reasonCodes: string[];
}
```

UI and AI can explain them.

---

# 111. Engine Versioning

Outputs should store:

```text
progressionEngineVersion
readinessEngineVersion
generatorVersion
scoringVersion
```

---

# 112. Domain Events

Potential internal events:

```text
WORKOUT_STARTED
EXERCISE_COMPLETED
PAIN_REPORTED
WORKOUT_COMPLETED
PERSONAL_RECORD_SET
ASSESSMENT_COMPLETED
LOAD_APPROVED
LEVEL_CHANGED
```

---

# 113. Workout Completion Flow

```text
WORKOUT_COMPLETED
        ↓
Persist Session
        ↓
PR Engine
        ↓
Progression Engine
        ↓
Analytics Update
        ↓
Sync Queue
        ↓
AI Recap Queue
```

---

# 114. Avoid Overengineering Events

V1 does not need:

- Kafka;
- RabbitMQ;
- distributed event streaming.

Ordinary TypeScript use cases/services are sufficient.

---

# 115. AI Backend Gateway

External model requests flow:

```text
PWA
 ↓
Express.js API
 ↓
AI Gateway
 ↓
External Provider
```

This prevents exposing API secrets in the frontend.

---

# 116. AI Gateway Responsibilities

- provider selection;
- credential handling;
- timeout;
- fallback;
- structured output validation;
- usage logging;
- errors.

Training decisions are already resolved before model invocation.

---

# 117. AI Provider Adapter

```ts
interface AIProvider {
  chat(request: ChatRequest): Promise<ChatResponse>;
}
```

Possible implementations:

```text
GeminiProvider
MistralProvider
NvidiaProvider
```

---

# 118. Model Router

```ts
interface ModelRouter {
  selectProvider(task: AITask): AIProvider;
}
```

---

# 119. AI Context Builder

```ts
interface AIContextBuilder {
  build(task: AITask, sourceId?: string): Promise<AIContext>;
}
```

Only relevant data should be retrieved.

---

# 120. Structured AI Output

Use Zod to validate outputs.

```text
Model Response
      ↓
Zod Schema
      ↓
Valid?
 ┌────┴────┐
Yes       No
 ↓          ↓
Use      Repair/Fallback
```

---

# 121. File Storage

Future media may use:

- S3-compatible storage;
- Cloudflare R2;
- Supabase Storage.

Potential files:

- progress photos;
- form-analysis videos;
- custom exercise media.

Binary files should not be stored directly inside PostgreSQL.

---

# 122. Security Boundaries

Never expose:

- AI provider secrets;
- PostgreSQL credentials;
- backend secret tokens

inside the React bundle.

---

# 123. Environment Configuration

Recommended:

```text
development
staging
production
```

Example backend environment:

```text
PORT
DATABASE_URL
AI_PROVIDER
AI_API_KEY
CORS_ORIGIN
NODE_ENV
```

Never expose private values through Vite public environment variables.

---

# 124. Feature Flags

Examples:

```text
AI_COACH_ENABLED
VOICE_GUIDANCE_ENABLED
VIDEO_ANALYSIS_ENABLED
SYNC_ENABLED
AUTH_ENABLED
```

---

# 125. Express Security Baseline

Commercial-ready backend should eventually include:

- Helmet.
- restrictive CORS configuration.
- payload-size limits.
- rate limits for public/auth/AI endpoints.
- request validation.
- secure authentication.
- authorization per user.
- production error sanitization.

---

# 126. Request Validation

Every writable Express endpoint should validate:

```text
params
query
body
```

with Zod or equivalent.

Do not rely solely on TypeScript interfaces.

---

# 127. Database Validation

Database constraints should complement application validation.

Examples:

- foreign keys;
- not-null requirements;
- uniqueness;
- valid numeric ranges where appropriate.

Do not rely entirely on controllers.

---

# 128. Error Handling

BellGrinda should distinguish:

## Client Validation Error

400.

## Authentication Required

401.

## Forbidden

403.

## Not Found

404.

## Conflict

409.

## Rate Limited

429.

## Internal Error

500.

User-facing messages should remain safe and concise.

---

# 129. Persistence Failure

If IndexedDB fails while training:

- preserve current Redux state;
- retry;
- notify user clearly.

Do not pretend the workout has been safely persisted.

---

# 130. Logging

Backend logging should include:

- request ID;
- errors;
- important sync failures;
- AI failures.

Do not unnecessarily log sensitive training data.

---

# 131. Testing Strategy

## Unit Tests

Domain/training engines.

## Integration Tests

Express services, repositories, PostgreSQL, IndexedDB.

## API Tests

Express routes.

## Component Tests

Workout UI.

## E2E

Full training flow.

---

# 132. Express API Tests

API tests should cover:

- valid request;
- invalid body;
- missing entity;
- conflict;
- sync duplication;
- AI-provider failure;
- future unauthorized access.

Supertest or comparable tooling is appropriate for Express.

---

# 133. Highest Priority Domain Tests

Test:

- pain overrides;
- readiness;
- progression;
- load trial;
- football adjustment;
- plateau detection;
- scoring;
- workout generation.

These rules should not depend on Express.

---

# 134. Persistence Test

Scenario:

1. Start workout.
2. Complete several exercises.
3. Refresh.
4. Restore exact workout state.

---

# 135. Offline E2E Test

Scenario:

1. Start online.
2. Begin workout.
3. Disable network.
4. Complete session.
5. Restart app offline.
6. Verify history.
7. Reconnect.
8. Sync to Express API.
9. Verify no duplicate server record.

---

# 136. Sync Conflict Test

Future multi-device scenario should verify:

- conflict detected;
- PainEvents preserved;
- no silent workout loss.

---

# 137. Minimal V1 Backend

The initial Express server does not need every eventual endpoint.

Initial backend can focus on:

- health endpoint;
- synchronization;
- AI gateway.

As features move cloud-side, add relevant persistence APIs.

---

# 138. Suggested V1 Deployment Architecture

```text
User Phone / Browser
        │
        ▼
BellGrinda PWA
        │
        ├── Redux Toolkit
        ├── IndexedDB / Dexie
        ├── Training Engine
        └── Service Worker
                │
                ▼
        Express.js Backend
                │
       ┌────────┴────────┐
       ▼                 ▼
 PostgreSQL          AI Gateway
                         │
                  External Models
```

---

# 139. Minimal V1 Architecture

## Frontend

React + TypeScript PWA.

## Local Persistence

IndexedDB + Dexie.

## State

Redux Toolkit.

## Backend

Express.js + TypeScript.

## Database

PostgreSQL + Drizzle.

## AI

Express-hosted AI Gateway.

This is sufficient.

---

# 140. What V1 Does Not Need

Do not add:

- microservices;
- Kubernetes;
- message brokers;
- GraphQL federation;
- separate analytics warehouse;
- Redis unless a concrete use case appears;
- elaborate distributed architecture.

---

# 141. Backend Modular Monolith

BellGrinda should use:

**Express.js Modular Monolith**

```text
server/
├── modules/
│   ├── users/
│   ├── workouts/
│   ├── exercises/
│   ├── assessments/
│   ├── progress/
│   ├── activities/
│   ├── sync/
│   └── ai/
│
├── database/
├── middleware/
├── config/
├── shared/
├── app.ts
└── server.ts
```

This is the official backend architecture for V1.

---

# 142. API Contract Versioning

Use:

```text
/api/v1/
```

Future breaking changes can introduce:

```text
/api/v2/
```

---

# 143. Shared Schemas

Because both frontend and backend use TypeScript, BellGrinda should share where appropriate:

- enums;
- API request schemas;
- API response schemas;
- domain types.

Avoid blindly sharing database-specific types with the frontend.

---

# 144. Monorepo Structure

Recommended:

```text
bellgrinda/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── training-engine/
│   ├── domain/
│   ├── schemas/
│   └── shared/
│
├── docs/
│   ├── prd/
│   ├── specifications/
│   └── architecture/
│
└── package.json
```

---

# 145. Workspace

Recommended:

```text
pnpm workspaces
```

Turborepo may be introduced later if useful.

It is not required.

---

# 146. Training Engine Package

```text
packages/training-engine/
├── progression/
├── readiness/
├── safety/
├── generator/
├── scoring/
├── analytics/
└── records/
```

This package should not depend on Express.js or React.

---

# 147. Why Keep Engine Separate from Express

The same deterministic logic can then be used by:

- React PWA;
- backend validation;
- future React Native app;
- automated tests.

For example:

```text
React App ─────┐
               ├── training-engine
Express API ───┤
               │
React Native ──┘
```

---

# 148. Future React Native Path

Reusable:

- training engine;
- domain types;
- schemas;
- API;
- backend.

Replace:

- web UI;
- IndexedDB adapter;
- service worker.

---

# 149. Training Pack Architecture

Future:

```text
TrainingPack

id
name
supportedEquipment
exerciseIds
workoutTemplates
progressionRules
```

Potential packs:

- Kettlebell.
- Bodyweight.
- Dumbbell.
- Barbell.
- Running.
- Football Conditioning.

V1:

**Kettlebell + supporting bodyweight work**

---

# 150. Future Multi-User Architecture

Every major server entity must be scoped using:

```text
userId
```

Once authentication arrives:

```text
request
   ↓
auth middleware
   ↓
req.user.id
   ↓
service queries only this user's records
```

Client-submitted arbitrary `userId` values should not determine authorization.

---

# 151. Future Subscription Model

Potential:

```ts
interface Subscription {
  id: string;
  userId: string;

  plan: string;
  status: string;

  startedAt: string;
  endsAt?: string;
}
```

Not required in V1.

---

# 152. Entitlements

Future feature access should eventually use entitlements such as:

```text
AI_COACH_FULL
VOICE_COACH
FORM_ANALYSIS
ADVANCED_ANALYTICS
```

Avoid scattered checks like:

```text
if (plan === "pro")
```

throughout the application.

---

# 153. Database Indexes

Potential indexes:

```text
WorkoutSession(userId, startedAt)
ExerciseSessionRecord(sessionId)
ExerciseSessionRecord(exerciseId)
PainEvent(userId, occurredAt)
PainEvent(exerciseId)
Assessment(userId, date)
PerformanceSnapshot(userId, date)
PersonalRecord(userId, exerciseId)
SyncQueueItem(status)
```

---

# 154. Data Retention

Preserve long-term:

- workout history;
- progression;
- assessments;
- safety history;
- PRs.

Temporary operational logs can use shorter retention.

---

# 155. Backup

When cloud persistence is enabled:

PostgreSQL should be backed up.

Before sync exists, local-only IndexedDB data may be lost if browser/site data is removed.

This should eventually be communicated clearly to the user.

---

# 156. Export

Future export:

```text
JSON
CSV
```

for:

- workouts;
- assessments;
- progress;
- PRs.

---

# 157. Date/Time Handling

Store timestamps in:

**UTC ISO 8601**

Display them in the user's local timezone.

Store scheduled date separately where required.

---

# 158. Numeric Data

Use:

- kg for weights;
- cm for measurements;
- seconds for durations.

Store numbers as numbers.

Avoid:

```text
"16kg"
```

as primary persisted data.

---

# 159. Enum Strategy

Stable machine identifier:

```text
ADVANCED_NOVICE
```

Display:

```text
Advanced Novice
```

Database values should not depend on user-facing text.

---

# 160. Configuration

Potential configuration:

```text
config/
├── levels.ts
├── performance-weights.ts
├── readiness-thresholds.ts
├── fatigue.ts
└── exercise-rules.ts
```

Training definitions should be version-controlled in V1.

---

# 161. Initial Seed Data

Seed:

- exercises;
- variations;
- substitutions;
- levels;
- workout templates;
- performance categories;
- goals.

---

# 162. Exercise Seed Examples

```text
KB_GOBLET_SQUAT
KB_DEADLIFT
KB_SWING
KB_ONE_ARM_ROW
KB_OVERHEAD_PRESS
KB_CLEAN
KB_CLEAN_PRESS
KB_SNATCH
REVERSE_LUNGE
PUSHUP_STANDARD
PUSHUP_TEMPO
PUSHUP_PAUSE
PUSHUP_DECLINE
GLUTE_BRIDGE
DEAD_BUG
SKIPPING
SUITCASE_MARCH
KB_FLOOR_PRESS
```

---

# 163. V1 Source of Truth

## Static Training Definitions

Version-controlled training-engine configuration.

## User Performance Data

IndexedDB locally + PostgreSQL after synchronization.

## AI

Never the source of truth for training state.

---

# 164. Admin Portal

Future commercial BellGrinda may add administration for:

- exercise library;
- videos;
- templates;
- training packs;
- configuration.

Do not build it for V1.

---

# 165. Technical Flow — App Startup

```text
Launch BellGrinda
      ↓
Initialize IndexedDB
      ↓
Load User/Profile
      ↓
Check Active Workout
      ↓
Hydrate Redux
      ↓
Load Training State
      ↓
Attempt Background Sync with Express API
      ↓
Render Dashboard
```

---

# 166. Technical Flow — Start Workout

```text
Dashboard
   ↓
Readiness Check
   ↓
Readiness Engine
   ↓
Workout Generator
   ↓
Validate Workout
   ↓
Create Workout Snapshot
   ↓
Create WorkoutSession
   ↓
Persist IndexedDB
   ↓
Workout Player
```

No Express API response is required to start the session.

---

# 167. Technical Flow — Complete Exercise

```text
Tap Complete
      ↓
Update Session State
      ↓
Update Exercise Session Record
      ↓
IndexedDB Transaction
      ↓
Update Redux
      ↓
Continue Workout
```

Synchronization happens separately.

---

# 168. Technical Flow — Complete Workout

```text
Finish Session
      ↓
Session Review
      ↓
Persist Final Session
      ↓
PR Engine
      ↓
Progression Engine
      ↓
Performance / Analytics
      ↓
Sync Queue
      ↓
Express Sync API
      ↓
AI Recap Request
```

---

# 169. Technical Flow — AI Request

```text
PWA
 ↓
POST /api/v1/ai/...
 ↓
Express Route
 ↓
Validation
 ↓
AI Service
 ↓
Context Builder
 ↓
AI Gateway
 ↓
Provider
 ↓
Validate Response
 ↓
Express Response
```

---

# 170. Technical Flow — Offline Workout

```text
Network unavailable
       ↓
Workout runs locally
       ↓
IndexedDB persists session
       ↓
Workout completed
       ↓
SyncQueue = PENDING
       ↓
Network returns
       ↓
POST /api/v1/sync
       ↓
Express service persists to PostgreSQL
```

---

# 171. Technical Flow — App Killed

```text
Workout Active
      ↓
Actions persisted locally
      ↓
OS/browser kills PWA
      ↓
Reopen
      ↓
Load IndexedDB
      ↓
Find ACTIVE session
      ↓
Hydrate Redux
      ↓
Recalculate timer state
      ↓
Resume exact position
```

Express is not part of this recovery path.

---

# 172. Architecture Success Criteria

The architecture succeeds if:

- workouts work offline;
- active sessions survive interruption;
- Express outages do not prevent training;
- training engines remain testable;
- AI remains optional;
- synchronization is safe;
- auth can be added later;
- React Native can reuse domain logic;
- additional training packs can be introduced;
- safety data remains durable.

---

# 173. Architecture Failure Conditions

Reconsider the implementation if:

- every action calls Express;
- controllers contain progression rules;
- Redux is used as permanent storage;
- AI generates arbitrary prescriptions;
- frontend bundles contain API secrets;
- sync creates duplicate workouts;
- browser refresh loses sessions;
- authentication requires redesigning all user data.

---

# 174. Final V1 Stack

## Frontend

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
- Framer Motion where useful.

## PWA

- Vite PWA tooling / Workbox.
- Service Worker.
- IndexedDB.

## Backend

- Node.js.
- TypeScript.
- **Express.js**.
- Zod.
- Helmet/CORS/security middleware as required.

## Database

- PostgreSQL.
- Drizzle ORM.

## AI

- Express-hosted AI Gateway.
- provider adapters.
- structured-output validation.

## Repository

- pnpm workspace monorepo.

---

# 175. Recommended Implementation Order

## Stage 1 — Foundation

- Monorepo.
- React PWA.
- Express API.
- routing.
- Redux.
- IndexedDB.
- Drizzle/PostgreSQL setup.
- shared domain types.

## Stage 2 — Exercise & Training Definitions

- exercise library;
- variations;
- substitutions;
- levels;
- templates;
- equipment.

## Stage 3 — Training Engine

- readiness;
- safety;
- progression;
- workout generation.

## Stage 4 — Workout Session

- player;
- round tracking;
- reps/load;
- timers;
- persistence;
- restore/resume.

## Stage 5 — Analytics

- assessments;
- PRs;
- scoring;
- progress.

## Stage 6 — Cloud Persistence

- Express REST APIs;
- sync;
- PostgreSQL persistence;
- conflicts.

## Stage 7 — AI

- Express AI Gateway;
- recap;
- biweekly report;
- Coach;
- voice.

---

# 176. Final Architectural Decision

The official BellGrinda architecture is:

```text
React + TypeScript PWA
       │
       ├── Redux Toolkit
       ├── Dexie / IndexedDB
       ├── Service Worker
       └── Deterministic Training Engine
                │
          REST / Sync / AI
                │
                ▼
      Node.js + TypeScript
           Express.js
                │
       ┌────────┼─────────┐
       ▼        ▼         ▼
 PostgreSQL   AI Gateway Future Auth
   + Drizzle      │
              Providers
```

Express.js serves as BellGrinda's official backend framework.

It provides the network/API boundary while the core workout, progression, readiness, safety, and scoring logic remains reusable and independent from Express.

---

# 177. Next Specification

The next planning document remains:

# BellGrinda Frontend Information Architecture, Screens & UX Specification

This should convert the architecture into the actual user-facing application structure, including:

- onboarding;
- navigation;
- dashboard;
- today's workout;
- readiness check;
- Workout Player;
- session recovery;
- progress;
- assessments;
- exercise library;
- AI Coach;
- settings;
- offline states;
- mobile interaction patterns;
- component hierarchy;
- accessibility;
- design-system foundations.
