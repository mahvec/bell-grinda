# BellGrinda Database Schema & Drizzle Migration Specification

**Version:** 0.1  
**Database:** PostgreSQL  
**ORM / Schema Tooling:** Drizzle ORM + Drizzle Kit  
**Backend:** Express.js + TypeScript  
**Primary Purpose:** Convert BellGrinda's conceptual data model into an implementation-ready relational database schema.  
**Design Principle:** Preserve long-term training history, safety data, synchronization integrity, and explainability without over-normalizing V1.

---

# 1. Database Goals

The BellGrinda database must support:

- workout history;
- exercise progression;
- assessments;
- readiness;
- pain and safety history;
- Training Levels;
- training blocks;
- Personal Records;
- Performance Grades;
- football/jogging activity;
- AI insights;
- synchronization;
- future authentication;
- future multi-user support.

The database must also remain compatible with BellGrinda's local-first architecture.

---

# 2. Core Database Principles

BellGrinda should follow:

1. PostgreSQL is the authoritative cloud database.
2. IndexedDB remains authoritative for an active offline workout.
3. Client-generated UUIDs support offline creation.
4. User-scoped records always contain `userId`.
5. Historical records should generally not be overwritten destructively.
6. Safety data should be preserved aggressively.
7. Derived analytics should remain traceable to source data.
8. Engine decisions should retain version information.
9. Database constraints should supplement application validation.
10. JSONB should be used selectively, not as a replacement for relational design.

---

# 3. Naming Convention

Database tables:

**snake_case plural**

Examples:

```text
users
training_profiles
user_equipment
exercises
exercise_variations
workout_sessions
pain_events
performance_snapshots
```

Columns:

**snake_case**

Example:

```text
created_at
user_id
current_training_level
```

TypeScript fields may use camelCase through Drizzle mappings.

---

# 4. Primary Keys

Use PostgreSQL UUID primary keys.

Recommended:

```ts
uuid("id").primaryKey();
```

IDs should normally be generated client-side using:

```ts
crypto.randomUUID();
```

This supports offline creation before synchronization.

Server-created records may also use UUIDs.

---

# 5. Standard Timestamp Columns

Most mutable records should contain:

```text
created_at
updated_at
deleted_at
```

Recommended PostgreSQL type:

```text
timestamptz
```

Use UTC internally.

---

# 6. Soft Deletion

Use `deleted_at` selectively for syncable user-owned records.

Examples:

- workouts;
- assessments;
- equipment;
- AI conversations.

Do not necessarily soft-delete immutable audit records such as:

- progression decisions;
- safety events.

---

# 7. Record Versioning

Syncable records should support:

```text
version integer not null default 1
```

This supports future optimistic concurrency.

Each successful server-side update increments:

```text
version = version + 1
```

---

# 8. PostgreSQL Enums vs Text

Use PostgreSQL enums for highly stable finite states.

Good candidates:

- Training Level.
- Workout Session Status.
- Readiness Classification.
- Pain Severity.
- Safety Status.

Use text/config tables for states likely to expand frequently.

---

# 9. Training Level Enum

```text
NOVICE
ADVANCED_NOVICE
INTERMEDIATE
ADVANCED
GRANDMASTER
```

Drizzle example:

```ts
export const trainingLevelEnum = pgEnum("training_level", [
  "NOVICE",
  "ADVANCED_NOVICE",
  "INTERMEDIATE",
  "ADVANCED",
  "GRANDMASTER",
]);
```

---

# 10. Performance Grade Enum

```text
DEVELOPING
COMPETENT
STRONG
EXCELLENT
```

---

# 11. Readiness Enum

```text
GREEN
YELLOW
RED
```

---

# 12. Pain Severity Enum

```text
MILD
MODERATE
SEVERE
```

---

# 13. Exercise Safety Enum

```text
ACTIVE
MONITORED
RESTRICTED
REINTRODUCTION
```

---

# 14. Workout Session Status Enum

```text
ACTIVE
PAUSED
COMPLETED
PARTIAL
ABANDONED
```

---

# 15. Exercise Session Status Enum

```text
COMPLETED
SKIPPED
SUBSTITUTED
INCOMPLETE
```

---

# 16. Skill Status Enum

```text
LEARNING
ESTABLISHED
PROGRESSING
MASTERED
```

---

# 17. Load Status Enum

```text
APPROVED
TRIAL
DEFERRED
RESTRICTED
```

---

# 18. AI Insight Status Enum

```text
PENDING
GENERATED
FAILED
```

---

# 19. Sync State Enum

Server records do not necessarily need the full client sync state.

Client-side IndexedDB uses:

```text
LOCAL_ONLY
PENDING
SYNCING
SYNCED
CONFLICT
FAILED
```

Server-side database primarily stores:

- record version;
- updated_at;
- deleted_at.

---

# 20. Users Table

Table:

```text
users
```

Columns:

```text
id uuid PK
display_name varchar(120)
date_of_birth date
height_cm numeric(5,2)
current_training_level training_level
current_phase varchar(100)
onboarding_completed boolean
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 21. Users Constraints

Recommended:

```text
height_cm > 0
version >= 1
```

`display_name` remains optional in V1.

---

# 22. Training Profiles Table

```text
training_profiles
```

Columns:

```text
id uuid PK
user_id uuid FK users.id
preferred_session_minutes integer
preferred_training_days smallint[]
baseline_date date
football_enabled boolean
jogging_enabled boolean
created_at timestamptz
updated_at timestamptz
version integer
```

---

# 23. Goal Storage

Instead of storing `primaryGoals` as an unstructured array, use:

```text
user_training_goals
```

Columns:

```text
id uuid PK
user_id uuid FK
goal_code varchar(50)
priority integer
created_at timestamptz
```

Unique:

```text
(user_id, goal_code)
```

---

# 24. Goal Codes

Initial values:

```text
ATHLETICISM
CONSISTENCY
STRENGTH
ENDURANCE
FAT_LOSS
CHEST_DEVELOPMENT
MUSCLE_GAIN
```

Goal codes can initially remain text rather than PostgreSQL enums.

---

# 25. User Equipment Table

```text
user_equipment
```

Columns:

```text
id uuid PK
user_id uuid FK
equipment_type varchar(50)
weight_kg numeric(6,2)
quantity integer
active boolean
acquired_at date
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 26. Equipment Constraints

Recommended:

```text
quantity > 0
weight_kg > 0 when weight_kg is not null
```

---

# 27. Exercises Table

```text
exercises
```

Columns:

```text
id uuid PK
slug varchar(120) UNIQUE
name varchar(150)
difficulty varchar(50)
technical_demand varchar(50)
fatigue_cost varchar(50)
unilateral boolean
ballistic boolean
instructions jsonb
coaching_cues jsonb
common_mistakes jsonb
active boolean
created_at timestamptz
updated_at timestamptz
```

Static training definitions are primarily seeded/version-controlled.

---

# 28. Exercise Categories

Use join table:

```text
exercise_categories
```

Columns:

```text
exercise_id uuid FK
category varchar(50)
```

Composite PK:

```text
(exercise_id, category)
```

---

# 29. Exercise Movement Patterns

```text
exercise_movement_patterns
```

Columns:

```text
exercise_id uuid FK
movement_pattern varchar(50)
```

Composite PK:

```text
(exercise_id, movement_pattern)
```

Examples:

- SQUAT.
- HINGE.
- PUSH_HORIZONTAL.
- PUSH_VERTICAL.
- PULL.
- CORE.
- CONDITIONING.

---

# 30. Exercise Equipment Requirements

```text
exercise_equipment_requirements
```

Columns:

```text
exercise_id uuid FK
equipment_type varchar(50)
required boolean
```

---

# 31. Exercise Variations Table

```text
exercise_variations
```

Columns:

```text
id uuid PK
exercise_id uuid FK
name varchar(150)
slug varchar(150) UNIQUE
difficulty_rank integer
min_training_level training_level
active boolean
created_at timestamptz
updated_at timestamptz
```

---

# 32. Exercise Variation Constraint

Unique within exercise:

```text
(exercise_id, name)
```

---

# 33. Exercise Progressions Table

```text
exercise_progressions
```

Columns:

```text
id uuid PK
from_variation_id uuid FK
to_variation_id uuid FK
progression_type varchar(50)
priority integer
```

Unique:

```text
(from_variation_id, to_variation_id)
```

---

# 34. Exercise Substitutions Table

```text
exercise_substitutions
```

Columns:

```text
id uuid PK
exercise_id uuid FK
substitute_exercise_id uuid FK
priority integer
reason_type varchar(50)
created_at timestamptz
```

---

# 35. Exercise Media Table

```text
exercise_media
```

Columns:

```text
id uuid PK
exercise_id uuid FK
media_type varchar(20)
url text
storage_key text
downloadable boolean
duration_seconds integer
created_at timestamptz
updated_at timestamptz
```

Media binaries remain outside PostgreSQL.

---

# 36. User Exercise State Table

```text
user_exercise_states
```

Columns:

```text
id uuid PK
user_id uuid FK
exercise_id uuid FK
current_variation_id uuid FK
current_working_load_kg numeric(6,2)
highest_successful_load_kg numeric(6,2)
load_status load_status
progression_state varchar(50)
skill_status skill_status
last_updated_at timestamptz
created_at timestamptz
version integer
```

---

# 37. User Exercise State Unique Constraint

Only one current state per user/exercise:

```text
UNIQUE(user_id, exercise_id)
```

---

# 38. Exercise Load History

```text
exercise_load_history
```

Columns:

```text
id uuid PK
user_id uuid FK
exercise_id uuid FK
load_kg numeric(6,2)
state varchar(50)
reason_code varchar(100)
recorded_at timestamptz
```

This remains historical/auditable.

---

# 39. Training Level States

```text
user_training_level_states
```

Columns:

```text
id uuid PK
user_id uuid FK
level training_level
started_at timestamptz
completed_at timestamptz
performance_grade_at_start performance_grade
performance_grade_at_end performance_grade
status varchar(30)
created_at timestamptz
```

---

# 40. Training Level State Status

Suggested values:

```text
ACTIVE
COMPLETED
REPEATED
```

Could remain text with a CHECK constraint.

---

# 41. Training Phases Table

```text
training_phases
```

Columns:

```text
id uuid PK
training_level training_level
phase_number integer
name varchar(120)
default_duration_weeks integer
active boolean
```

Unique:

```text
(training_level, phase_number)
```

---

# 42. Training Blocks Table

```text
training_blocks
```

Columns:

```text
id uuid PK
user_id uuid FK
training_level training_level
primary_priority varchar(100)
secondary_priority varchar(100)
started_at timestamptz
planned_end_at timestamptz
completed_at timestamptz
status varchar(30)
created_at timestamptz
updated_at timestamptz
version integer
```

---

# 43. Workout Templates Table

Static workout templates may remain version-controlled.

If stored in PostgreSQL:

```text
workout_templates
```

Columns:

```text
id uuid PK
training_level training_level
day_type varchar(50)
focus varchar(150)
default_rounds integer
active boolean
template_version varchar(30)
created_at timestamptz
```

---

# 44. Workout Template Slots

```text
workout_template_slots
```

Columns:

```text
id uuid PK
workout_template_id uuid FK
position integer
allowed_movement_patterns text[]
required_training_effects text[]
max_fatigue varchar(20)
```

Unique:

```text
(workout_template_id, position)
```

---

# 45. Generated Workouts Table

```text
workouts
```

Columns:

```text
id uuid PK
user_id uuid FK
scheduled_date date
training_level training_level
phase_id uuid FK
block_id uuid FK
focus varchar(150)
readiness_status readiness_status
football_status varchar(30)
planned_rounds integer
estimated_duration_minutes integer
generator_version varchar(30)
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 46. Workout Index

Important:

```text
INDEX(user_id, scheduled_date)
```

---

# 47. Workout Exercises Table

```text
workout_exercises
```

Columns:

```text
id uuid PK
workout_id uuid FK
exercise_id uuid FK
variation_id uuid FK
order_index integer
planned_load_kg numeric(6,2)
planned_reps integer
reps_per_side boolean
rest_after_seconds integer
progression_reason_code varchar(100)
created_at timestamptz
```

Unique:

```text
(workout_id, order_index)
```

---

# 48. Workout Generation Records

```text
workout_generation_records
```

Columns:

```text
id uuid PK
workout_id uuid FK UNIQUE
generator_version varchar(30)
input_snapshot jsonb
reason_codes text[]
generated_at timestamptz
```

This makes workout generation auditable.

---

# 49. Workout Sessions Table

```text
workout_sessions
```

Columns:

```text
id uuid PK
user_id uuid FK
workout_id uuid FK
status workout_session_status
started_at timestamptz
last_updated_at timestamptz
completed_at timestamptz
current_round integer
current_exercise_index integer
planned_rounds integer
completed_rounds integer
readiness_status readiness_status
session_rpe smallint
notes text
schema_version varchar(30)
active_duration_seconds integer
elapsed_duration_seconds integer
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 50. Session RPE Constraint

```text
session_rpe between 1 and 10
```

when not null.

---

# 51. Workout Session Indexes

```text
INDEX(user_id, started_at)
INDEX(user_id, status)
INDEX(workout_id)
```

---

# 52. One Active Session Rule

PostgreSQL partial unique index:

Conceptually:

```text
UNIQUE(user_id)
WHERE status IN ('ACTIVE', 'PAUSED')
AND deleted_at IS NULL
```

This enforces one active primary workout per user.

---

# 53. Exercise Session Records

```text
exercise_session_records
```

Columns:

```text
id uuid PK
session_id uuid FK
exercise_id uuid FK
variation_id uuid FK
round integer
planned_load_kg numeric(6,2)
actual_load_kg numeric(6,2)
planned_reps integer
completed_reps integer
status exercise_session_status
rpe smallint
completed_at timestamptz
created_at timestamptz
updated_at timestamptz
version integer
```

---

# 54. Exercise Record Constraints

Recommended:

```text
round >= 1
planned_reps >= 0
completed_reps >= 0
rpe between 1 and 10
```

---

# 55. Exercise Session Indexes

```text
INDEX(session_id)
INDEX(exercise_id)
INDEX(session_id, round)
INDEX(exercise_id, completed_at)
```

---

# 56. Workout Substitutions

```text
workout_substitutions
```

Columns:

```text
id uuid PK
session_id uuid FK
original_exercise_id uuid FK
substitute_exercise_id uuid FK
starting_round integer
scope varchar(30)
reason varchar(200)
created_at timestamptz
```

---

# 57. Session Timer State

Server persistence is optional because timer state primarily matters locally.

If synced:

```text
session_timer_states
```

Columns:

```text
session_id uuid PK/FK
rest_started_at timestamptz
rest_duration_seconds integer
rest_type varchar(30)
paused_at timestamptz
accumulated_pause_seconds integer
updated_at timestamptz
```

---

# 58. Readiness Checks

```text
readiness_checks
```

Columns:

```text
id uuid PK
user_id uuid FK
workout_id uuid FK
check_date date
energy smallint
sleep_quality smallint
soreness_level varchar(20)
soreness_locations text[]
pain_level pain_severity
pain_locations text[]
football_status varchar(30)
score numeric(5,2)
classification readiness_status
reason_codes text[]
created_at timestamptz
updated_at timestamptz
version integer
```

---

# 59. Readiness Score Constraint

```text
score >= 0 AND score <= 100
```

---

# 60. Pain Events Table

```text
pain_events
```

Columns:

```text
id uuid PK
user_id uuid FK
session_id uuid FK
exercise_id uuid FK
body_location varchar(100)
severity pain_severity
source varchar(30)
round integer
notes text
action_taken varchar(150)
restriction_created boolean
occurred_at timestamptz
created_at timestamptz
version integer
```

---

# 61. Pain Indexes

```text
INDEX(user_id, occurred_at)
INDEX(exercise_id, occurred_at)
INDEX(user_id, body_location)
```

Pain history is important for safety logic.

---

# 62. Exercise Safety States

```text
exercise_safety_states
```

Columns:

```text
id uuid PK
user_id uuid FK
exercise_id uuid FK
status exercise_safety_status
reason_codes text[]
restricted_at timestamptz
last_pain_at timestamptz
successful_reintroduction_exposures integer
updated_at timestamptz
created_at timestamptz
version integer
```

Unique:

```text
(user_id, exercise_id)
```

---

# 63. Recovery Blocks

```text
recovery_blocks
```

Columns:

```text
id uuid PK
user_id uuid FK
recovery_type varchar(30)
started_at timestamptz
ended_at timestamptz
trigger_reasons text[]
status varchar(30)
created_at timestamptz
updated_at timestamptz
```

Types:

- DELOAD.
- RECONDITIONING.
- RECOVERY.

---

# 64. Assessments Table

```text
assessments
```

Columns:

```text
id uuid PK
user_id uuid FK
assessment_type varchar(40)
assessment_date date
bodyweight_kg numeric(6,2)
bodyweight_source varchar(20)
waist_cm numeric(6,2)
chest_cm numeric(6,2)
max_standard_pushups integer
current_pushup_variation_id uuid FK
notes text
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 65. Measurement Constraints

When provided:

```text
bodyweight_kg > 0
waist_cm > 0
chest_cm > 0
max_standard_pushups >= 0
```

---

# 66. Assessment Index

```text
INDEX(user_id, assessment_date)
INDEX(user_id, assessment_type)
```

---

# 67. Progress Photos

Future/optional table:

```text
assessment_media
```

Columns:

```text
id uuid PK
assessment_id uuid FK
media_type varchar(20)
storage_key text
url text
created_at timestamptz
```

Photos remain opt-in.

---

# 68. Performance Tests

```text
performance_tests
```

Columns:

```text
id uuid PK
user_id uuid FK
training_level training_level
test_type varchar(100)
test_date date
overall_rpe smallint
created_at timestamptz
updated_at timestamptz
version integer
```

---

# 69. Performance Test Results

```text
performance_test_results
```

Columns:

```text
id uuid PK
performance_test_id uuid FK
exercise_id uuid FK
variation_id uuid FK
load_kg numeric(6,2)
reps integer
duration_seconds integer
rpe smallint
completed boolean
created_at timestamptz
```

---

# 70. Performance Snapshots

```text
performance_snapshots
```

Columns:

```text
id uuid PK
user_id uuid FK
snapshot_date date
training_level training_level
scoring_version varchar(30)
overall_score numeric(5,2)
overall_grade performance_grade
trend varchar(20)
confidence varchar(30)
safety_modifier numeric(5,2)
source_assessment_id uuid FK
source_block_id uuid FK
created_at timestamptz
```

---

# 71. Performance Score Constraint

```text
overall_score >= 0
overall_score <= 100
```

---

# 72. Performance Snapshot Index

```text
INDEX(user_id, snapshot_date)
```

---

# 73. Performance Category Scores

```text
performance_category_scores
```

Columns:

```text
id uuid PK
snapshot_id uuid FK
category varchar(50)
raw_score numeric(5,2)
adjusted_score numeric(5,2)
grade performance_grade
trend varchar(20)
confidence varchar(30)
contributing_metrics jsonb
modifiers jsonb
created_at timestamptz
```

Unique:

```text
(snapshot_id, category)
```

---

# 74. Personal Records Table

```text
personal_records
```

Columns:

```text
id uuid PK
user_id uuid FK
category varchar(50)
exercise_id uuid FK
variation_id uuid FK
load_kg numeric(6,2)
value numeric(12,3)
unit varchar(30)
achieved_at timestamptz
session_id uuid FK
previous_record_id uuid FK personal_records.id
created_at timestamptz
```

---

# 75. Personal Record Indexes

```text
INDEX(user_id, exercise_id)
INDEX(user_id, category)
INDEX(achieved_at)
```

---

# 76. Progress Snapshots

```text
progress_snapshots
```

Columns:

```text
id uuid PK
user_id uuid FK
snapshot_date date
snapshot_type varchar(40)
training_level training_level
performance_snapshot_id uuid FK
assessment_id uuid FK
consistency_percent numeric(5,2)
summary_data jsonb
analytics_version varchar(30)
created_at timestamptz
```

---

# 77. Football Activities

```text
football_activities
```

Columns:

```text
id uuid PK
user_id uuid FK
activity_date date
status varchar(30)
duration_minutes integer
rpe smallint
notes text
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 78. Jogging Activities

```text
jogging_activities
```

Columns:

```text
id uuid PK
user_id uuid FK
activity_date date
duration_minutes integer
distance_km numeric(7,2)
rpe smallint
notes text
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
version integer
```

---

# 79. Activity Constraints

RPE:

```text
1–10
```

Duration:

```text
>= 0
```

Distance:

```text
>= 0
```

---

# 80. Progression Decisions

```text
progression_decisions
```

Columns:

```text
id uuid PK
user_id uuid FK
exercise_id uuid FK
decision_type varchar(50)
previous_state jsonb
new_state jsonb
reason_codes text[]
engine_version varchar(30)
created_at timestamptz
```

This table should be treated as audit history.

---

# 81. Progression Decision Index

```text
INDEX(user_id, exercise_id, created_at)
```

---

# 82. AI Insights

```text
ai_insights
```

Columns:

```text
id uuid PK
user_id uuid FK
insight_type varchar(50)
source_id uuid
content jsonb
provider varchar(100)
model varchar(150)
prompt_version varchar(30)
status ai_insight_status
generated_at timestamptz
created_at timestamptz
updated_at timestamptz
```

---

# 83. AI Insight Source

`source_id` is intentionally generic because the source may be:

- workout session;
- assessment;
- training block;
- level review.

V1 can keep this polymorphic reference without a database FK.

The service layer must validate source existence.

---

# 84. AI Conversations

```text
ai_conversations
```

Columns:

```text
id uuid PK
user_id uuid FK
created_at timestamptz
updated_at timestamptz
deleted_at timestamptz
```

---

# 85. AI Messages

```text
ai_messages
```

Columns:

```text
id uuid PK
conversation_id uuid FK
role varchar(20)
content text
created_at timestamptz
```

Index:

```text
(conversation_id, created_at)
```

---

# 86. User Settings

```text
user_settings
```

Columns:

```text
user_id uuid PK/FK
voice_enabled boolean
voice_mode varchar(20)
theme varchar(20)
notifications_enabled boolean
created_at timestamptz
updated_at timestamptz
version integer
```

---

# 87. Sync Audit Table

The main server database does not need to mirror the client's queue.

A lightweight sync audit table can help debugging:

```text
sync_operations
```

Columns:

```text
id uuid PK
user_id uuid FK
client_operation_id uuid
entity_type varchar(60)
entity_id uuid
operation varchar(20)
client_version integer
server_version integer
status varchar(30)
created_at timestamptz
```

Unique:

```text
client_operation_id
```

---

# 88. Why Sync Queue Remains Client-Side

The queue's purpose is to track unsent local changes.

Therefore the actual:

```text
sync_queue
```

belongs primarily in IndexedDB.

PostgreSQL only needs:

- entity state;
- version;
- optional sync audit.

---

# 89. Server Authentication Fields

Authentication is deferred, but future users table may add:

```text
email
password_hash
email_verified_at
auth_provider
```

V1 does not require these fields yet.

Avoid building unused authentication complexity into migration 001.

---

# 90. Future Subscription Tables

Do not include in initial migrations.

Later possible:

```text
subscriptions
entitlements
payment_events
```

The initial training schema must not depend on subscriptions.

---

# 91. Foreign-Key Deletion Rules

Use deletion rules deliberately.

Examples:

## User-owned history

Prefer:

```text
ON DELETE CASCADE
```

if the entire user is permanently deleted.

## Exercise Library

Avoid cascading exercise deletion into historical workouts.

Exercises should generally be:

**deactivated, not deleted.**

---

# 92. Exercise FK Strategy

Historical records referencing exercises require exercises to remain available.

Therefore:

```text
exercises.active = false
```

should replace destructive deletion.

---

# 93. Variation FK Strategy

Same principle:

old variations should remain in database even if no longer offered.

Use:

```text
active = false
```

---

# 94. JSONB Usage

Appropriate JSONB fields:

- instructions;
- coaching cues;
- common mistakes;
- engine snapshots;
- contributing metrics;
- summary data;
- AI structured content.

Do not use JSONB for strongly relational frequently queried entities.

---

# 95. Arrays

PostgreSQL arrays are acceptable for small stable sets such as:

```text
reason_codes
soreness_locations
pain_locations
```

Avoid large embedded collections that should be relational tables.

---

# 96. Numeric Types

Recommended:

Weights:

```text
numeric(6,2)
```

Measurements:

```text
numeric(6,2)
```

Scores:

```text
numeric(5,2)
```

Distances:

```text
numeric(7,2)
```

Avoid PostgreSQL floating point for stored user measurements where exact decimal representation is useful.

---

# 97. Integer Types

Use integers for:

- reps;
- rounds;
- duration seconds;
- quantity;
- priority;
- rank.

---

# 98. Boolean Defaults

Examples:

```text
active default true
onboarding_completed default false
football_enabled default false
jogging_enabled default false
```

---

# 99. Timestamp Defaults

Typically:

```text
created_at default now()
updated_at default now()
```

Application code should update `updated_at`.

---

# 100. Drizzle Schema Folder

Recommended:

```text
apps/api/src/database/
├── schema/
│   ├── enums.ts
│   ├── users.ts
│   ├── training.ts
│   ├── exercises.ts
│   ├── workouts.ts
│   ├── safety.ts
│   ├── assessments.ts
│   ├── performance.ts
│   ├── activities.ts
│   ├── ai.ts
│   ├── sync.ts
│   ├── relations.ts
│   └── index.ts
│
├── migrations/
├── seeds/
│   ├── exercises.ts
│   ├── variations.ts
│   ├── substitutions.ts
│   ├── phases.ts
│   └── templates.ts
│
├── client.ts
└── migrate.ts
```

---

# 101. Example Drizzle Users Table

Conceptually:

```ts
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),

  displayName: varchar("display_name", { length: 120 }),

  dateOfBirth: date("date_of_birth"),

  heightCm: numeric("height_cm", {
    precision: 5,
    scale: 2,
  }),

  currentTrainingLevel: trainingLevelEnum("current_training_level")
    .notNull()
    .default("NOVICE"),

  currentPhase: varchar("current_phase", {
    length: 100,
  }),

  onboardingCompleted: boolean("onboarding_completed").notNull().default(false),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
```

---

# 102. Example Drizzle Workout Session Table

Conceptually:

```ts
export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  workoutId: uuid("workout_id")
    .notNull()
    .references(() => workouts.id),

  status: workoutSessionStatusEnum("status").notNull(),

  startedAt: timestamp("started_at", {
    withTimezone: true,
  }).notNull(),

  completedAt: timestamp("completed_at", {
    withTimezone: true,
  }),

  currentRound: integer("current_round").notNull().default(1),

  currentExerciseIndex: integer("current_exercise_index").notNull().default(0),

  plannedRounds: integer("planned_rounds").notNull(),

  completedRounds: integer("completed_rounds").notNull().default(0),

  sessionRpe: smallint("session_rpe"),

  notes: text("notes"),

  version: integer("version").notNull().default(1),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});
```

---

# 103. Drizzle Relations

Use Drizzle relations for developer ergonomics.

Examples:

```text
User
 ├── TrainingProfile
 ├── Equipment
 ├── WorkoutSessions
 ├── Assessments
 ├── PainEvents
 └── PerformanceSnapshots
```

Database foreign keys remain authoritative.

---

# 104. Initial Migration Strategy

Do not generate one enormous uncontrolled migration after weeks of coding.

Recommended staged migrations.

---

# 105. Migration 0001 — Foundation

Create:

- enums;
- users;
- training_profiles;
- user_training_goals;
- user_equipment;
- user_settings.

---

# 106. Migration 0002 — Exercise Library

Create:

- exercises;
- exercise_categories;
- exercise_movement_patterns;
- exercise_equipment_requirements;
- exercise_variations;
- exercise_progressions;
- exercise_substitutions;
- exercise_media.

---

# 107. Migration 0003 — Training State

Create:

- user_exercise_states;
- exercise_load_history;
- training_phases;
- user_training_level_states;
- training_blocks;
- recovery_blocks.

---

# 108. Migration 0004 — Workout Generation

Create:

- workout_templates;
- workout_template_slots;
- workouts;
- workout_exercises;
- workout_generation_records.

---

# 109. Migration 0005 — Workout Sessions

Create:

- workout_sessions;
- exercise_session_records;
- workout_substitutions;
- session_timer_states.

Add active-session partial unique index.

---

# 110. Migration 0006 — Readiness & Safety

Create:

- readiness_checks;
- pain_events;
- exercise_safety_states.

---

# 111. Migration 0007 — Assessments & Performance

Create:

- assessments;
- assessment_media;
- performance_tests;
- performance_test_results;
- performance_snapshots;
- performance_category_scores;
- personal_records;
- progress_snapshots.

---

# 112. Migration 0008 — Activities

Create:

- football_activities;
- jogging_activities.

---

# 113. Migration 0009 — Engine Audit

Create:

- progression_decisions.

Workout generation audit already exists from migration 0004.

---

# 114. Migration 0010 — AI

Create:

- ai_insights;
- ai_conversations;
- ai_messages.

---

# 115. Migration 0011 — Sync Audit

Create:

- sync_operations.

Add any additional version/index changes needed by sync implementation.

---

# 116. Migration Order Rationale

Dependencies flow:

```text
User
 ↓
Exercises / Training Definitions
 ↓
Training State
 ↓
Generated Workouts
 ↓
Workout Sessions
 ↓
Safety
 ↓
Assessments / Analytics
 ↓
AI / Sync
```

This minimizes circular migration dependencies.

---

# 117. Migration Commands

Recommended scripts:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx src/database/migrate.ts",
    "db:seed": "tsx src/database/seeds/index.ts",
    "db:studio": "drizzle-kit studio"
  }
}
```

Exact paths can adjust to monorepo structure.

---

# 118. Migration Policy

Migrations should be:

- version-controlled;
- immutable after shared/deployed use;
- reviewed before production.

Do not edit already-applied production migrations to change history.

Create a new migration.

---

# 119. Development Reset

Development may support:

```text
db:reset
```

but this must never be used against production.

---

# 120. Seed Strategy

Seed data falls into two categories.

## Required Static Seed Data

- exercises;
- variations;
- substitutions;
- Training Phases;
- workout templates.

## Development Demo Data

- fake users;
- workouts;
- assessments.

Keep these separate.

---

# 121. Seed IDs

Static training entities should use stable deterministic IDs or stable UUID constants.

Example:

```text
KB_GOBLET_SQUAT_ID
```

This avoids seed recreation generating duplicate exercises.

---

# 122. Exercise Seed Example

Required initial exercises:

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
KB_FLOOR_PRESS
PUSHUP
GLUTE_BRIDGE
DEAD_BUG
SKIPPING
SUITCASE_MARCH
```

Push-up variations belong under the Push-Up exercise.

---

# 123. Push-Up Variation Seeds

Examples:

```text
STANDARD
TEMPO
PAUSE
DECLINE
DECLINE_TEMPO
DECLINE_PAUSE
EXPLOSIVE
```

Only variations approved by the training specs should be activated.

---

# 124. Exercise Seed Versioning

Store a seed/config version where useful.

Do not rewrite historical workouts if a seed definition later changes.

Workout session snapshots preserve original prescriptions.

---

# 125. IndexedDB-to-PostgreSQL Mapping

Not every IndexedDB store requires a one-to-one PostgreSQL table.

Example:

```text
IndexedDB activeSessions
→ workout_sessions
```

```text
IndexedDB syncQueue
→ no direct PostgreSQL equivalent
```

```text
IndexedDB exerciseMetadata
→ exercises + variations + related server seed tables
```

---

# 126. Client/Server Field Naming

API boundary should normally use camelCase.

Example frontend/API:

```json
{
  "userId": "...",
  "completedRounds": 4
}
```

Database:

```text
user_id
completed_rounds
```

Repository/mapping layer converts between them.

---

# 127. Local Active Workout Authority

While a workout is ACTIVE:

IndexedDB state should be treated as authoritative.

Backend state may lag.

After completion and successful sync:

PostgreSQL becomes authoritative long-term storage.

---

# 128. Sync Metadata on Client

Local syncable entity may include:

```ts
interface LocalSyncMetadata {
  syncState: SyncState;
  version: number;
  updatedAt: string;
  deletedAt?: string;
}
```

---

# 129. Server Version Conflict

Example:

Client has:

```text
version 3
```

Server has:

```text
version 4
```

Client attempts update from version 3.

Server should identify a conflict rather than blindly overwrite version 4.

---

# 130. Sync Conflict Response

Possible API result:

```json
{
  "status": "CONFLICT",
  "entityId": "...",
  "clientVersion": 3,
  "serverVersion": 4
}
```

Actual REST contract belongs in the next API specification.

---

# 131. Active Session Sync Conflict

For future multi-device support:

If local device has an actively progressing session and server has an older ACTIVE version:

local may win.

The conflict policy must still preserve server data for audit if necessary.

---

# 132. Pain Event Conflict

Pain events are append-oriented.

If two devices create different pain events:

preserve both.

Do not merge one away.

---

# 133. Assessment Conflict

If the same assessment ID is edited on two devices:

explicit conflict resolution may be required.

V1 single-user/single-device risk is low.

---

# 134. Database Transactions

Use PostgreSQL transactions for operations such as:

- final workout synchronization;
- assessment + snapshot creation;
- Training Level transition;
- block completion + new block creation.

Avoid partial multi-table state.

---

# 135. Workout Completion Transaction

Server-side sync may transactionally persist:

1. Workout Session.
2. Exercise Session Records.
3. Substitutions.
4. Pain Events.

Derived analytics can happen afterward if required.

---

# 136. Immutable History Principle

Records like:

- PainEvent;
- ProgressionDecision;
- PersonalRecord history

should generally be append-oriented.

Corrections may add updated records or audit fields rather than erase important history.

---

# 137. Analytics Recalculation

Because formulas will change, keep raw data.

Derived tables such as:

```text
performance_snapshots
progress_snapshots
```

may be regenerated where needed.

Raw workouts should never be discarded in favor of summaries.

---

# 138. Performance Snapshot Versioning

Store:

```text
scoring_version
```

This allows:

```text
1.0
1.1
2.0
```

without pretending historic scores were calculated using the same rules.

---

# 139. Analytics Version

Progress snapshots should store:

```text
analytics_version
```

for the same reason.

---

# 140. Engine Audit Versioning

Progression decisions store:

```text
engine_version
```

Workout generation records store:

```text
generator_version
```

This is required for explainability.

---

# 141. Database Security Future

Once authentication exists, every user-owned query must scope by authenticated user.

Never rely on:

```text
WHERE id = :recordId
```

alone.

Prefer:

```text
WHERE id = :recordId
AND user_id = :authenticatedUserId
```

---

# 142. Database Roles

Future production should use a limited application DB role.

The Express API should not connect using a PostgreSQL superuser account.

---

# 143. Database Connection Configuration

Environment:

```text
DATABASE_URL
```

Use connection pooling appropriate to deployment provider.

Keep DB credentials server-side only.

---

# 144. Migration Environment Safety

Before running migrations:

- confirm environment;
- log target database safely;
- prevent accidental production destructive reset.

---

# 145. PostgreSQL Backup

Once real training history exists:

enable automatic PostgreSQL backups.

Loss of long-term workout history would undermine BellGrinda's core value.

---

# 146. Index Strategy

Do not index every column.

Prioritize real query patterns:

- history by user/date;
- exercise performance by exercise;
- assessments by user/date;
- pain by user/exercise;
- snapshots by user/date;
- AI messages by conversation.

---

# 147. Potential Composite Indexes

Recommended:

```text
workout_sessions(user_id, started_at DESC)

exercise_session_records(
  exercise_id,
  completed_at DESC
)

pain_events(
  user_id,
  exercise_id,
  occurred_at DESC
)

assessments(
  user_id,
  assessment_date DESC
)

performance_snapshots(
  user_id,
  snapshot_date DESC
)
```

---

# 148. Personal Record Query

Likely query:

Find latest/best PR per:

```text
user
exercise
variation
load
category
```

Indexes should be adjusted after actual query patterns emerge.

Do not prematurely create extremely wide indexes.

---

# 149. Check Constraints

Useful checks include:

```text
reps >= 0
rounds >= 0
weights > 0
scores between 0 and 100
RPE between 1 and 10
duration >= 0
```

Database constraints protect integrity if application validation fails.

---

# 150. Null Semantics

Use null to mean:

**not recorded / not applicable**

Do not use magic values such as:

```text
weight = -1
```

or:

```text
rpe = 0
```

when the real value is unknown.

---

# 151. Current State vs History

BellGrinda frequently needs both.

Example:

`user_exercise_states`

contains current load/state.

`exercise_load_history`

contains historical changes.

Do not reconstruct every current state by scanning years of history on every request.

---

# 152. Denormalized Current Fields

Strategic denormalization is acceptable.

Example:

`users.current_training_level`

can coexist with:

`user_training_level_states`.

The former supports quick current-state access.

The latter preserves history.

The service layer must update both transactionally during level changes.

---

# 153. Generated Workout vs Session

These remain separate.

`workouts` represents:

**what BellGrinda prescribed**

`workout_sessions` represents:

**what the user actually performed**

This separation is essential for analytics.

---

# 154. Planned vs Actual Data

Likewise:

`workout_exercises`

stores:

- planned load;
- planned reps.

`exercise_session_records`

stores:

- actual load;
- actual reps.

Never overwrite prescription with actual performance.

---

# 155. Workout Snapshot Integrity

A started session should retain the relevant prescription even if:

- exercise metadata changes;
- template changes;
- generator changes.

At minimum, session-linked workout records must not be mutated after session start.

---

# 156. Snapshot Enhancement

If needed later, `workout_sessions` may contain:

```text
prescription_snapshot jsonb
```

for absolute historical resilience.

This is optional in V1 because normalized workout records already provide the prescription.

---

# 157. AI Data Boundary

AI conversations should not become the training database.

For example:

User tells AI:

“I bought a 20 kg kettlebell.”

The backend should eventually update `user_equipment` through an explicit structured action rather than relying on `ai_messages`.

---

# 158. AI Insight Regeneration

If a report is regenerated:

Either:

- create a new insight row;
- or retain revision metadata.

Do not silently replace historically significant reports if comparison matters.

---

# 159. AI Insight Indexes

Suggested:

```text
INDEX(user_id, insight_type, created_at)
INDEX(source_id)
```

---

# 160. V1 Tables Required to Start Building

The minimum useful first database milestone is:

```text
users
training_profiles
user_training_goals
user_equipment

exercises
exercise_variations
exercise_substitutions

user_exercise_states

training_phases
user_training_level_states

workouts
workout_exercises
workout_sessions
exercise_session_records

readiness_checks
pain_events
exercise_safety_states

assessments
```

Other tables can follow.

---

# 161. V1 Tables Required Before Analytics

Add:

```text
performance_tests
performance_test_results
performance_snapshots
performance_category_scores
personal_records
progress_snapshots
progression_decisions
```

---

# 162. V1 Tables Required Before AI

Add:

```text
ai_insights
ai_conversations
ai_messages
```

The AI Gateway can exist before all AI persistence tables if needed for development.

---

# 163. Seed Order

Recommended:

1. Exercises.
2. Movement/category relationships.
3. Variations.
4. Progression relationships.
5. Substitutions.
6. Training phases.
7. Workout templates.
8. Template slots.

---

# 164. Seed Idempotency

Seed scripts must be safe to run more than once.

Use:

- stable IDs;
- `ON CONFLICT`;
- Drizzle upsert equivalents.

Running seed should not create duplicate exercises.

---

# 165. Seed Environment

Required static seeds:

Run in:

- development;
- staging;
- production.

Demo user/session seeds:

development only.

---

# 166. Schema Review Before Build

Before implementation, validate that every major feature has a storage path.

Examples:

## Can we restore workout state?

Yes:
`workout_sessions` + local timer state.

## Can we know what was prescribed?

Yes:
`workouts` + `workout_exercises`.

## Can we know what actually happened?

Yes:
`exercise_session_records`.

## Can we explain a load progression?

Yes:
`user_exercise_states` + `exercise_load_history` + `progression_decisions`.

## Can we track pain?

Yes:
`pain_events` + `exercise_safety_states`.

---

# 167. Key Entity Relationships

Conceptually:

```text
User
│
├── TrainingProfile
├── Goals
├── Equipment
├── ExerciseStates
├── TrainingLevelStates
├── TrainingBlocks
├── Workouts
│    └── WorkoutExercises
│
├── WorkoutSessions
│    ├── ExerciseSessionRecords
│    ├── WorkoutSubstitutions
│    └── PainEvents
│
├── ReadinessChecks
├── ExerciseSafetyStates
├── Assessments
├── PerformanceTests
├── PerformanceSnapshots
├── PersonalRecords
├── Activities
├── ProgressionDecisions
└── AI Data
```

---

# 168. Database Diagram — Simplified

```text
users
  │
  ├──── training_profiles
  ├──── user_equipment
  ├──── user_exercise_states ─── exercises
  ├──── user_training_level_states
  ├──── training_blocks
  │
  ├──── workouts
  │       │
  │       └──── workout_exercises ─── exercises
  │
  ├──── workout_sessions
  │       │
  │       ├──── exercise_session_records
  │       ├──── workout_substitutions
  │       └──── pain_events
  │
  ├──── readiness_checks
  ├──── exercise_safety_states
  ├──── assessments
  ├──── performance_tests
  ├──── performance_snapshots
  │       └──── performance_category_scores
  │
  ├──── personal_records
  ├──── progression_decisions
  └──── ai_insights
```

---

# 169. Database Success Criteria

The schema succeeds if BellGrinda can reliably answer:

- What was today's prescription?
- What did the user actually complete?
- Which load is approved for this exercise?
- Why did progression occur?
- Which exercises are restricted?
- What pain has occurred historically?
- What was the user's Performance Grade at a specific point?
- What are the user's Personal Records?
- What changed between assessments?
- Can an offline workout sync without duplication?

---

# 170. Database Failure Conditions

The schema should be reconsidered if:

- current and historical exercise states are indistinguishable;
- planned and actual workouts overwrite each other;
- pain data can disappear through ordinary updates;
- AI chat becomes the source of structured training state;
- offline-created records cannot have stable IDs;
- analytics cannot trace back to raw sessions;
- deleting an exercise destroys old workout history;
- migration changes cannot be audited.

---

# 171. V1 Database Principle

BellGrinda should store:

**raw evidence first**

and

**derived interpretation second.**

Raw workout, assessment, pain, and activity data is the foundation.

Scores, trends, AI reports, and recommendations can be recalculated as BellGrinda improves.

---

# 172. Next Specification

With PostgreSQL structure now defined, the next planning document should be:

# BellGrinda Express REST API Contract Specification

It should define the exact network contract between:

**React PWA**

and

**Express.js backend**

including:

- `/api/v1` structure;
- health endpoint;
- user/profile endpoints;
- equipment endpoints;
- exercise-library endpoints;
- workout endpoints;
- workout-session synchronization;
- readiness;
- pain events;
- assessments;
- performance;
- Personal Records;
- football/jogging activities;
- AI Coach;
- AI recap;
- sync endpoint;
- pagination;
- filtering;
- validation;
- error responses;
- HTTP status codes;
- idempotency;
- optimistic concurrency;
- authentication-ready request handling;
- offline batch sync payload;
- API versioning.

After the REST contract, BellGrinda will have enough specification depth to build the first implementation roadmap and begin converting these documents into actual development tasks.
