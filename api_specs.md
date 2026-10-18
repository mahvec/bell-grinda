# BellGrinda Express REST API Contract Specification

**Version:** 0.1  
**Backend:** Node.js + TypeScript + Express.js  
**Database:** PostgreSQL + Drizzle ORM  
**Frontend Client:** React + TypeScript PWA  
**API Style:** REST  
**Base Path:** `/api/v1`  
**Primary Principle:** The API supports synchronization, persistence, AI, and future multi-device use without becoming a dependency for every workout action.

---

# 1. Purpose

This specification defines the network contract between:

**BellGrinda React PWA**

and

**BellGrinda Express.js backend**

It defines:

- endpoint structure;
- HTTP methods;
- request bodies;
- response bodies;
- validation rules;
- status codes;
- pagination;
- filtering;
- idempotency;
- optimistic concurrency;
- synchronization;
- AI endpoints;
- future authentication behavior.

The API should remain predictable and boring.

That is a positive quality.

---

# 2. API Base URL

All V1 routes should live under:

```text
/api/v1
```

Examples:

```text
GET /api/v1/health
GET /api/v1/profile
GET /api/v1/workouts
POST /api/v1/sync
POST /api/v1/ai/coach
```

---

# 3. API Versioning

Breaking changes should not silently alter `/api/v1`.

Future breaking contract:

```text
/api/v2
```

Non-breaking changes may extend V1.

Examples:

- adding optional response fields;
- adding new endpoints;
- adding new filter parameters.

---

# 4. Content Type

Requests and responses should generally use:

```text
Content-Type: application/json
```

Exceptions:

- file upload;
- direct-to-object-storage flows.

These are outside core V1.

---

# 5. Standard Success Envelope

BellGrinda should use a consistent response shape.

```ts
interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}
```

Example:

```json
{
  "success": true,
  "data": {
    "id": "..."
  }
}
```

---

# 6. Standard Error Envelope

```ts
interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request body is invalid."
  }
}
```

---

# 7. Error Philosophy

Errors should be:

- machine-readable;
- human-readable;
- consistent;
- safe for production.

Do not expose:

- database stack traces;
- SQL text;
- provider secrets;
- internal file paths.

---

# 8. Request IDs

Every request should have a request identifier.

Header:

```text
X-Request-Id
```

If client does not provide one, Express generates one.

Include it in logs and error responses where useful.

---

# 9. Authentication State

V1 may run without full auth.

However, endpoints should be structured as if the backend can later determine:

```text
req.user.id
```

Future authenticated routes should derive user identity from the authenticated session/token.

Do not trust a client-supplied arbitrary `userId` as authorization.

---

# 10. V1 Local User Strategy

For personal V1, backend may use a configured development/local user.

Example:

```text
LOCAL_USER_ID
```

This is temporary.

The API surface should still avoid requiring `userId` in every route.

Prefer:

```text
GET /profile
GET /workouts
```

not:

```text
GET /users/:userId/workouts
```

for ordinary self-service endpoints.

---

# 11. Future Auth Header

Future token-based auth may use:

```text
Authorization: Bearer <token>
```

The exact authentication system is deferred.

---

# 12. Resource Ownership

Every user-owned resource must eventually be scoped to the authenticated user.

Example service query:

```text
WHERE id = resourceId
AND user_id = req.user.id
```

---

# 13. HTTP Status Conventions

Use:

```text
200 OK
201 Created
204 No Content
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

---

# 14. 400 vs 422

Recommended BellGrinda convention:

## 400

Malformed request syntax/query/JSON.

## 422

Structurally valid request that fails domain validation.

Example:

Valid JSON requests:

```text
sessionRpe = 14
```

→ `422`.

---

# 15. Health Endpoint

```text
GET /api/v1/health
```

Purpose:

- deployment health;
- client connectivity testing.

Response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "version": "0.1.0"
  }
}
```

Do not expose sensitive infrastructure detail.

---

# 16. Readiness Endpoint for Backend Dependencies

Optional:

```text
GET /api/v1/health/ready
```

May check:

- database connectivity.

Do not require AI providers to be healthy for BellGrinda backend readiness.

AI is optional.

---

# 17. Profile Endpoints

## Get Profile

```text
GET /api/v1/profile
```

Response may include:

- User.
- TrainingProfile.
- Goals.
- Current Training Level.

---

# 18. Profile Response

Example:

```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "displayName": "Victor",
    "heightCm": 183,
    "currentTrainingLevel": "NOVICE",
    "currentPhase": "PHASE_1",
    "onboardingCompleted": true,
    "trainingProfile": {
      "preferredSessionMinutes": 40,
      "preferredTrainingDays": [1, 2, 3, 4, 5],
      "footballEnabled": true,
      "joggingEnabled": true
    },
    "goals": [
      {
        "code": "ATHLETICISM",
        "priority": 1
      }
    ]
  }
}
```

---

# 19. Update Profile

```text
PATCH /api/v1/profile
```

Only mutable profile fields should be accepted.

Example request:

```json
{
  "displayName": "Victor",
  "heightCm": 183
}
```

Do not let this endpoint directly change engine-owned historical state.

---

# 20. Update Training Preferences

```text
PATCH /api/v1/profile/training-preferences
```

Request:

```json
{
  "preferredSessionMinutes": 40,
  "preferredTrainingDays": [1, 2, 3, 4, 5],
  "footballEnabled": true,
  "joggingEnabled": true
}
```

---

# 21. Goal Endpoints

## Get Goals

```text
GET /api/v1/profile/goals
```

## Replace Goal Priorities

```text
PUT /api/v1/profile/goals
```

Request:

```json
{
  "goals": [
    {
      "code": "ATHLETICISM",
      "priority": 1
    },
    {
      "code": "CONSISTENCY",
      "priority": 2
    }
  ]
}
```

Using PUT is appropriate because this replaces the ordered goal set.

---

# 22. Equipment Endpoints

## List Equipment

```text
GET /api/v1/equipment
```

## Add Equipment

```text
POST /api/v1/equipment
```

## Update Equipment

```text
PATCH /api/v1/equipment/:equipmentId
```

## Remove Equipment

```text
DELETE /api/v1/equipment/:equipmentId
```

DELETE should soft-delete where sync is enabled.

---

# 23. Add Equipment Request

```json
{
  "id": "client-generated-uuid",
  "equipmentType": "KETTLEBELL",
  "weightKg": 16,
  "quantity": 1,
  "acquiredAt": "2026-11-01"
}
```

Client-generated ID supports offline creation.

---

# 24. Exercise Library Endpoints

## List Exercises

```text
GET /api/v1/exercises
```

Optional filters:

```text
?equipment=KETTLEBELL
?movementPattern=HINGE
?category=STRENGTH
?level=NOVICE
?active=true
```

---

# 25. Exercise Detail

```text
GET /api/v1/exercises/:exerciseId
```

Return:

- base exercise;
- variations;
- substitutions;
- progressions;
- media;
- coaching cues.

---

# 26. Exercise Search

Optional:

```text
GET /api/v1/exercises?search=swing
```

Search should remain lightweight.

---

# 27. User Exercise State Endpoint

```text
GET /api/v1/exercises/:exerciseId/state
```

Returns current personal state:

```json
{
  "success": true,
  "data": {
    "exerciseId": "...",
    "currentVariationId": "...",
    "currentWorkingLoadKg": 12,
    "highestSuccessfulLoadKg": 16,
    "loadStatus": "APPROVED",
    "progressionState": "HOLD",
    "skillStatus": "PROGRESSING"
  }
}
```

---

# 28. Exercise History Endpoint

```text
GET /api/v1/exercises/:exerciseId/history
```

May return:

- recent sessions;
- load history;
- progression decisions;
- PRs.

Pagination applies.

---

# 29. Training Level Endpoint

```text
GET /api/v1/program
```

Returns:

- current level;
- phase/block;
- weekly structure;
- assessment status;
- progression path.

---

# 30. Program History

```text
GET /api/v1/program/history
```

Returns:

- completed levels;
- repeated phases;
- advanced blocks;
- Grandmaster cycles.

---

# 31. Workout Endpoints

## List Workouts

```text
GET /api/v1/workouts
```

Filters:

```text
?from=2026-10-01
?to=2026-10-31
?status=scheduled
?page=1
?pageSize=20
```

---

# 32. Get Today's Workout

```text
GET /api/v1/workouts/today
```

Important:

This is primarily for synchronized/cloud representation.

The local PWA may generate/use the local workout without requiring this route.

---

# 33. Get Workout

```text
GET /api/v1/workouts/:workoutId
```

Returns:

- prescription;
- workout exercises;
- generation record where appropriate.

---

# 34. Create/Sync Workout

```text
POST /api/v1/workouts
```

Used when synchronizing an offline-created generated workout.

Request:

```json
{
  "id": "uuid",
  "scheduledDate": "2026-10-18",
  "trainingLevel": "NOVICE",
  "phaseId": "...",
  "focus": "FULL_BODY_STRENGTH",
  "plannedRounds": 5,
  "estimatedDurationMinutes": 40,
  "generatorVersion": "1.0.0",
  "exercises": []
}
```

---

# 35. Workout Creation Idempotency

If workout ID already exists:

- do not duplicate;
- compare version/state;
- return existing or conflict.

Possible status:

```text
200
```

for idempotent replay.

---

# 36. Workout Session Endpoints

## List Sessions

```text
GET /api/v1/workout-sessions
```

Filters:

```text
?status=COMPLETED
?from=
?to=
?page=
?pageSize=
```

---

# 37. Get Session

```text
GET /api/v1/workout-sessions/:sessionId
```

Return:

- session;
- exercise records;
- substitutions;
- pain events;
- AI recap reference where available.

---

# 38. Create Session

```text
POST /api/v1/workout-sessions
```

This is mainly a sync endpoint for sessions already started locally.

Request:

```json
{
  "id": "session-uuid",
  "workoutId": "workout-uuid",
  "status": "ACTIVE",
  "startedAt": "2026-10-18T15:30:00Z",
  "currentRound": 1,
  "currentExerciseIndex": 0,
  "plannedRounds": 5,
  "completedRounds": 0,
  "readinessStatus": "GREEN",
  "schemaVersion": "1.0",
  "version": 1
}
```

---

# 39. Update Session

```text
PATCH /api/v1/workout-sessions/:sessionId
```

Example:

```json
{
  "status": "COMPLETED",
  "completedAt": "2026-10-18T16:10:00Z",
  "completedRounds": 5,
  "sessionRpe": 7,
  "notes": "Good session.",
  "version": 4
}
```

---

# 40. Optimistic Concurrency

Client sends its expected version.

Possible approaches:

Body:

```json
{
  "version": 4
}
```

or header:

```text
If-Match: 4
```

Recommended V1:

Use body field in sync operations and later add HTTP ETag semantics if needed.

---

# 41. Session Version Conflict

If client expects version 4 but server is version 5:

Return:

```text
409 Conflict
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "VERSION_CONFLICT",
    "message": "This workout session has a newer server version.",
    "details": {
      "clientVersion": 4,
      "serverVersion": 5
    }
  }
}
```

---

# 42. Exercise Session Record Endpoint

Ordinary app interaction should not call the server for every set.

For explicit CRUD/debug use:

```text
GET /api/v1/workout-sessions/:sessionId/exercises
```

Cloud writes should usually arrive through synchronization/batch session payloads.

---

# 43. Finalize Session Endpoint

Optional convenience endpoint:

```text
POST /api/v1/workout-sessions/:sessionId/finalize
```

May persist a complete session bundle.

Request:

```json
{
  "session": {},
  "exerciseRecords": [],
  "substitutions": [],
  "painEvents": []
}
```

However, V1 should avoid duplicating logic between this and `/sync`.

Recommended:

Use `/sync` as the canonical offline synchronization path.

---

# 44. Readiness Endpoints

## List Readiness Checks

```text
GET /api/v1/readiness
```

## Get Specific

```text
GET /api/v1/readiness/:readinessId
```

## Create/Sync

```text
POST /api/v1/readiness
```

---

# 45. Readiness Request

```json
{
  "id": "uuid",
  "workoutId": "uuid",
  "checkDate": "2026-10-18",
  "energy": 3,
  "sleepQuality": 3,
  "sorenessLevel": "MILD",
  "sorenessLocations": ["LEGS"],
  "painLevel": null,
  "painLocations": [],
  "footballStatus": "NONE",
  "score": 82,
  "classification": "GREEN",
  "reasonCodes": ["NORMAL_RECOVERY"]
}
```

The API stores deterministic output.

It should not recalculate differently unless intentionally validating the engine.

---

# 46. Pain Event Endpoints

## List

```text
GET /api/v1/pain-events
```

Filters:

```text
?exerciseId=
?bodyLocation=
?from=
?to=
```

## Create

```text
POST /api/v1/pain-events
```

Pain events should be append-oriented.

---

# 47. Pain Event Request

```json
{
  "id": "uuid",
  "sessionId": "uuid",
  "exerciseId": "uuid",
  "bodyLocation": "LOWER_BACK",
  "severity": "MILD",
  "source": "WORKOUT",
  "round": 2,
  "notes": "Felt discomfort during swing.",
  "occurredAt": "2026-10-18T15:48:00Z"
}
```

---

# 48. Pain Event Deletion

Ordinary users should generally not delete pain events casually.

If correction is needed:

- allow administrative/correction path later;
- or append corrected metadata.

V1 can omit DELETE pain event endpoint.

---

# 49. Exercise Safety State

```text
GET /api/v1/safety/exercises
```

Returns all current exercise safety states.

Specific:

```text
GET /api/v1/safety/exercises/:exerciseId
```

---

# 50. Safety State Write Policy

The frontend should not arbitrarily set:

```text
RESTRICTED → ACTIVE
```

through a generic PATCH.

Safety state changes should come through controlled domain actions.

Therefore no generic public:

```text
PATCH /safety/exercises/:id
```

in V1.

---

# 51. Assessments Endpoints

## List

```text
GET /api/v1/assessments
```

Filters:

```text
?type=BIWEEKLY
?from=
?to=
```

## Get

```text
GET /api/v1/assessments/:assessmentId
```

## Create

```text
POST /api/v1/assessments
```

## Edit

```text
PATCH /api/v1/assessments/:assessmentId
```

---

# 52. Assessment Request

```json
{
  "id": "uuid",
  "assessmentType": "BIWEEKLY",
  "assessmentDate": "2026-11-01",
  "bodyweightKg": 93.4,
  "bodyweightSource": "MEASURED",
  "waistCm": 93,
  "chestCm": 105,
  "maxStandardPushups": 25,
  "currentPushupVariationId": "uuid",
  "notes": ""
}
```

---

# 53. Assessment Response

May include linked derived result:

```json
{
  "success": true,
  "data": {
    "assessment": {},
    "performanceSnapshot": {},
    "comparison": {}
  }
}
```

Whether derived analytics are produced synchronously or separately can evolve.

---

# 54. Performance Tests

## List

```text
GET /api/v1/performance-tests
```

## Get

```text
GET /api/v1/performance-tests/:testId
```

## Create

```text
POST /api/v1/performance-tests
```

---

# 55. Performance Snapshot Endpoints

## Latest

```text
GET /api/v1/performance/latest
```

## History

```text
GET /api/v1/performance
```

Filters:

```text
?from=
?to=
?page=
?pageSize=
```

## Specific

```text
GET /api/v1/performance/:snapshotId
```

---

# 56. Performance Response

Example:

```json
{
  "success": true,
  "data": {
    "overallScore": 77,
    "overallGrade": "STRONG",
    "trend": "IMPROVING",
    "confidence": "ESTABLISHED",
    "categories": [
      {
        "category": "PUSH",
        "score": 74,
        "grade": "STRONG"
      }
    ]
  }
}
```

---

# 57. Personal Record Endpoints

## List

```text
GET /api/v1/personal-records
```

Filters:

```text
?exerciseId=
?category=
?from=
?to=
```

## Specific

```text
GET /api/v1/personal-records/:recordId
```

PRs are engine-generated.

No ordinary client endpoint should allow arbitrary creation of fake PRs.

---

# 58. Progress Endpoint

Dashboard-friendly aggregate:

```text
GET /api/v1/progress/overview
```

Return:

- Training Level.
- Performance Grade.
- consistency.
- latest PR.
- assessment delta.
- key exercise trends.

This reduces excessive client requests.

---

# 59. Progress Exercise Endpoint

```text
GET /api/v1/progress/exercises/:exerciseId
```

Returns:

- working load;
- highest load;
- recent records;
- PRs;
- trend;
- progression decisions.

---

# 60. Measurement History

```text
GET /api/v1/progress/measurements
```

Response:

```json
{
  "success": true,
  "data": {
    "bodyweight": [],
    "waist": [],
    "chest": [],
    "pushups": []
  }
}
```

Derived from assessments.

---

# 61. Football Activity Endpoints

```text
GET /api/v1/activities/football
POST /api/v1/activities/football
PATCH /api/v1/activities/football/:activityId
DELETE /api/v1/activities/football/:activityId
```

---

# 62. Football Request

```json
{
  "id": "uuid",
  "activityDate": "2026-10-23",
  "status": "HIGH",
  "durationMinutes": 70,
  "rpe": 8,
  "notes": "Five-a-side match."
}
```

---

# 63. Jogging Activity Endpoints

```text
GET /api/v1/activities/jogging
POST /api/v1/activities/jogging
PATCH /api/v1/activities/jogging/:activityId
DELETE /api/v1/activities/jogging/:activityId
```

---

# 64. AI Endpoint Principles

AI endpoints must:

- use server-side provider secrets;
- build structured context;
- validate output;
- enforce safety boundaries;
- not modify deterministic training state directly.

---

# 65. Workout Recap AI Endpoint

```text
POST /api/v1/ai/workout-recap
```

Request:

```json
{
  "sessionId": "uuid"
}
```

The backend retrieves verified session data.

Do not send the entire session payload from client unless needed for offline pending workflows.

---

# 66. Workout Recap Response

```json
{
  "success": true,
  "data": {
    "insightId": "uuid",
    "status": "GENERATED",
    "recap": {
      "summary": "...",
      "wins": [],
      "attentionAreas": [],
      "recoveryNote": "...",
      "nextFocus": "..."
    }
  }
}
```

---

# 67. Existing AI Recap

If recap already exists and source data has not changed:

Return cached insight.

Avoid paying for another model call unnecessarily.

---

# 68. Assessment AI Endpoint

```text
POST /api/v1/ai/assessment-report
```

Request:

```json
{
  "assessmentId": "uuid"
}
```

Backend retrieves:

- assessment;
- previous assessment;
- performance snapshot;
- relevant trends.

---

# 69. Coach Endpoint

```text
POST /api/v1/ai/coach
```

Request:

```json
{
  "conversationId": "uuid",
  "message": "Why am I still using 12 kg for overhead press?"
}
```

---

# 70. Coach Response

```json
{
  "success": true,
  "data": {
    "conversationId": "uuid",
    "message": {
      "id": "uuid",
      "role": "ASSISTANT",
      "content": "..."
    }
  }
}
```

---

# 71. Coach Conversation Endpoints

```text
GET /api/v1/ai/conversations
POST /api/v1/ai/conversations
GET /api/v1/ai/conversations/:conversationId
DELETE /api/v1/ai/conversations/:conversationId
```

Deletion may soft-delete.

---

# 72. AI Error Handling

Provider failure:

```text
503 Service Unavailable
```

Example:

```json
{
  "success": false,
  "error": {
    "code": "AI_PROVIDER_UNAVAILABLE",
    "message": "AI coaching is temporarily unavailable."
  }
}
```

Core training data remains unaffected.

---

# 73. AI Rate Limits

Future commercial version should rate-limit:

- Coach messages;
- report regeneration;
- expensive multimodal endpoints.

Do not rate-limit ordinary workout synchronization aggressively.

---

# 74. Synchronization Endpoint

Canonical local-first sync endpoint:

```text
POST /api/v1/sync
```

This is one of the most important API contracts.

---

# 75. Sync Request Envelope

Conceptual:

```json
{
  "clientId": "device-or-installation-id",
  "operations": [
    {
      "operationId": "uuid",
      "entityType": "WORKOUT_SESSION",
      "entityId": "uuid",
      "operation": "UPSERT",
      "baseVersion": 3,
      "updatedAt": "2026-10-18T16:00:00Z",
      "data": {}
    }
  ]
}
```

---

# 76. Sync Operation Types

Recommended:

```text
UPSERT
DELETE
```

No need to distinguish CREATE vs UPDATE at the transport layer if stable IDs exist.

Server determines current state.

---

# 77. Sync Entity Types

Initial supported types:

```text
PROFILE
TRAINING_PROFILE
TRAINING_GOAL
EQUIPMENT
WORKOUT
WORKOUT_SESSION
EXERCISE_SESSION_RECORD
WORKOUT_SUBSTITUTION
READINESS_CHECK
PAIN_EVENT
ASSESSMENT
FOOTBALL_ACTIVITY
JOGGING_ACTIVITY
```

Derived records generally do not need arbitrary client writes.

---

# 78. Sync Batch Size

Set a safe maximum.

Example:

```text
100 operations per request
```

The exact number may be tuned.

Reject excessively large requests.

---

# 79. Sync Response

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "operationId": "uuid",
        "entityType": "WORKOUT_SESSION",
        "entityId": "uuid",
        "status": "APPLIED",
        "serverVersion": 4
      }
    ],
    "serverTime": "2026-10-18T16:03:00Z"
  }
}
```

---

# 80. Sync Result States

Possible:

```text
APPLIED
NO_CHANGE
CONFLICT
REJECTED
```

---

# 81. Sync Conflict Result

```json
{
  "operationId": "uuid",
  "entityType": "ASSESSMENT",
  "entityId": "uuid",
  "status": "CONFLICT",
  "serverVersion": 5,
  "serverData": {}
}
```

Only return server data where useful and safe.

---

# 82. Idempotent Sync Operations

`operationId` must be unique.

If client retries the same operation:

Server returns the previous result.

Do not apply twice.

---

# 83. Pain Event Sync

Pain Event UPSERT behavior should be especially conservative.

If event ID exists:

- do not silently delete or replace different data without version checks.

If event IDs differ:

- preserve both.

---

# 84. Delete Sync

DELETE operation:

```json
{
  "operationId": "...",
  "entityType": "EQUIPMENT",
  "entityId": "...",
  "operation": "DELETE",
  "baseVersion": 2
}
```

Server generally applies:

```text
deleted_at = now()
version += 1
```

for soft-deletable resources.

---

# 85. Pull Synchronization

V1 may also require:

```text
GET /api/v1/sync/changes
```

Parameters:

```text
?since=2026-10-18T10:00:00Z
```

---

# 86. Pull Sync Response

```json
{
  "success": true,
  "data": {
    "changes": [],
    "nextCursor": "..."
  }
}
```

Cursor-based sync is more reliable than timestamp-only sync long-term.

---

# 87. Sync Cursor

Recommended future-ready approach:

Client stores:

```text
lastSyncCursor
```

Then:

```text
GET /sync/changes?cursor=...
```

V1 implementation can begin simpler but should not lock out cursors.

---

# 88. Pagination Standard

For ordinary lists use:

```text
?page=1
&pageSize=20
```

Response metadata:

```json
{
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 86,
    "totalPages": 5
  }
}
```

---

# 89. Cursor Pagination

For:

- AI messages;
- future sync change feed;
- potentially large activity histories;

cursor pagination may be preferable.

Do not mix patterns randomly.

---

# 90. Default Page Size

Recommended:

```text
20
```

Maximum:

```text
100
```

unless endpoint specifically requires otherwise.

---

# 91. Sorting

Use predictable query:

```text
?sort=-startedAt
```

Convention:

```text
-field
```

means descending.

V1 can limit allowed sort fields per endpoint.

---

# 92. Date Filtering

Use:

```text
?from=YYYY-MM-DD
?to=YYYY-MM-DD
```

For timestamp-specific APIs use ISO 8601.

---

# 93. Validation

Every endpoint should validate:

- params;
- query;
- body.

Use Zod.

Example:

```ts
const createAssessmentSchema = z.object({
  body: z.object({
    id: z.string().uuid(),
    assessmentType: z.enum([
      "BASELINE",
      "BIWEEKLY",
      "LEVEL_COMPLETION",
      "DECEMBER_INITIAL",
      "ANNUAL",
    ]),
  }),
});
```

---

# 94. Unknown Request Fields

Recommended:

Reject or strip unexpected fields deliberately.

For API integrity, prefer strict schemas for writes.

This helps catch client/server drift.

---

# 95. Date Validation

Scheduled dates:

```text
YYYY-MM-DD
```

Timestamps:

```text
ISO 8601 with timezone
```

Do not accept ambiguous locale strings like:

```text
18/10/26
```

---

# 96. Unit Validation

Backend expects:

- kilograms;
- centimeters;
- seconds;
- kilometers where relevant.

API should not accept formatted:

```text
"16kg"
```

for numeric fields.

---

# 97. Numeric Range Validation

Examples:

```text
RPE: 1–10
Performance score: 0–100
Weight: >0
Duration: >=0
Reps: >=0
Rounds: >=0
```

---

# 98. Enum Validation

Reject unknown states.

Example:

```text
"SUPER_READY"
```

must not silently become GREEN.

---

# 99. Domain Validation

Schema validation alone is not enough.

Example:

Request:

```text
16 kg overhead press
```

may be syntactically valid but may violate current approved-load rules.

Domain service determines whether an operation is permitted.

---

# 100. Client Authority Boundary

The local client may legitimately generate:

- readiness score;
- workout prescription;
- progression result

using the shared deterministic engine.

When synced, backend may validate:

- engine version;
- data integrity;
- safety invariants.

Do not let backend silently reinterpret history with a different current engine version.

---

# 101. Engine Version Fields

Relevant API payloads should include:

```text
generatorVersion
progressionEngineVersion
readinessEngineVersion
scoringVersion
```

where the record depends on an engine calculation.

---

# 102. Immutable Records

Certain resources should be effectively immutable once finalized.

Examples:

- finalized workout prescription;
- historical progression decision;
- generated Performance Snapshot.

Corrections should be explicit rather than arbitrary PATCH.

---

# 103. Partial Updates

PATCH semantics:

Only provided fields change.

Example:

```json
{
  "notes": "Updated note."
}
```

must not null all omitted fields.

---

# 104. PUT Semantics

Use PUT only when replacing the whole conceptual resource.

Example:

```text
PUT /profile/goals
```

replaces the ordered goal set.

---

# 105. DELETE Response

Recommended:

```text
204 No Content
```

for successful ordinary deletion.

If soft deletion returns updated resource, 200 is also acceptable.

Choose one convention consistently.

Recommended BellGrinda:

`204`.

---

# 106. Not Found

Example:

```json
{
  "success": false,
  "error": {
    "code": "WORKOUT_NOT_FOUND",
    "message": "Workout not found."
  }
}
```

---

# 107. Conflict Codes

Useful error codes:

```text
VERSION_CONFLICT
ACTIVE_SESSION_EXISTS
DUPLICATE_RESOURCE
SYNC_CONFLICT
```

---

# 108. Safety Domain Error Codes

Examples:

```text
EXERCISE_RESTRICTED
LOAD_NOT_APPROVED
SAFETY_STATE_CONFLICT
```

Do not use generic 500 errors for domain decisions.

---

# 109. Active Session Exists

If attempting to create another active session:

```text
409 Conflict
```

Response:

```json
{
  "success": false,
  "error": {
    "code": "ACTIVE_SESSION_EXISTS",
    "message": "A workout session is already active.",
    "details": {
      "sessionId": "..."
    }
  }
}
```

---

# 110. Rate Limits

Potential:

## General API

Reasonable broad limit.

## AI

Lower task-specific limits.

## Auth future

Stricter login/reset limits.

Sync must tolerate reconnect bursts.

---

# 111. CORS

Production should allow only configured BellGrinda clients.

Example environment:

```text
CORS_ORIGIN=https://app.bellgrinda.com
```

Development may allow local frontend origins.

---

# 112. Security Headers

Use Helmet or equivalent.

API responses should not depend on browser security defaults alone.

---

# 113. Payload Size

Set request body limits.

Normal JSON API does not need massive payloads.

Sync bundles may need slightly larger limits than normal endpoints.

---

# 114. Logging

Log:

- request ID;
- route;
- method;
- status;
- latency;
- authenticated user ID where appropriate;
- error code.

Avoid logging full sensitive payloads by default.

---

# 115. AI Logging

Do not blindly log:

- full Coach conversations;
- health/safety notes;
- prompt content.

Log operational metadata instead where possible.

---

# 116. API Module Structure

Recommended Express module:

```text
modules/
└── workouts/
    ├── workout.routes.ts
    ├── workout.controller.ts
    ├── workout.service.ts
    ├── workout.repository.ts
    ├── workout.schema.ts
    ├── workout.mapper.ts
    └── workout.types.ts
```

---

# 117. Controller Responsibility

Controllers should:

- read validated request;
- call service;
- map service result to HTTP response.

Controllers should not contain:

- SQL;
- progression rules;
- AI prompting logic.

---

# 118. Service Responsibility

Services coordinate:

- repositories;
- domain engines;
- transactions;
- authorization;
- secondary actions.

---

# 119. Repository Responsibility

Repositories:

- query Drizzle;
- persist records;
- return database/domain data.

Repositories do not decide:

- whether user is ready to progress;
- whether pain should restrict exercise.

Those are domain concerns.

---

# 120. Mapper Responsibility

Mappers convert:

```text
database row
↔
domain model
↔
API DTO
```

This prevents PostgreSQL details leaking through the whole system.

---

# 121. API DTOs

API types should be distinct where needed from:

- Drizzle inferred rows;
- internal domain models.

Do not expose every database field automatically.

---

# 122. Example DTO

```ts
interface WorkoutSessionDto {
  id: string;
  workoutId: string;
  status: WorkoutSessionStatus;
  startedAt: string;
  completedAt?: string;
  currentRound: number;
  completedRounds: number;
  sessionRpe?: number;
  version: number;
}
```

No `userId` needed in self-service response unless useful.

---

# 123. OpenAPI

BellGrinda should eventually generate or maintain an OpenAPI specification.

Benefits:

- backend documentation;
- frontend contract clarity;
- automated API client possibilities;
- testing.

This can follow once endpoints stabilize.

---

# 124. API Documentation Route

Development/staging may expose:

```text
/api/docs
```

Do not necessarily expose administrative documentation publicly in production.

---

# 125. RTK Query Integration

Frontend API layer should group endpoints by resource.

Example:

```text
profileApi
equipmentApi
exerciseApi
workoutApi
progressApi
aiApi
syncApi
```

Active workout interactions still use Redux + IndexedDB directly.

---

# 126. RTK Query Rule

Do not use RTK Query mutation for every:

```text
Complete Exercise
```

during the workout.

The interaction should be:

```text
UI
↓
Redux
↓
IndexedDB
↓
sync later
```

not:

```text
UI
↓
Express
↓
wait
↓
advance workout
```

---

# 127. Offline Mutation Strategy

Offline-created data enters the local sync queue.

Example:

```text
Complete Assessment
 ↓
Save IndexedDB
 ↓
Queue UPSERT
 ↓
Return success to UI
 ↓
Sync later
```

---

# 128. Network Retry

Ordinary GET requests can use reasonable retry.

Mutations should rely on idempotency before automatic retries.

Never blindly retry a non-idempotent mutation without stable IDs/operation IDs.

---

# 129. Timeout Strategy

AI endpoints should have longer timeouts than normal CRUD.

Normal API:

short timeout.

AI:

larger but bounded timeout.

Workout UI must not block on either.

---

# 130. Future WebSocket Need

V1 does not require WebSockets.

Potential future uses:

- coach streaming;
- server-generated notifications;
- multi-device sync.

Do not add WebSockets until needed.

---

# 131. AI Streaming

Coach responses could later support:

```text
SSE
```

or streaming fetch.

V1 may simply return completed responses.

Keep first implementation simple.

---

# 132. Bulk Read Endpoint

Avoid creating giant:

```text
GET /everything
```

endpoint.

But Dashboard/progress aggregate endpoints are acceptable when they model a real UI use case.

---

# 133. Bootstrap Endpoint

A useful optional endpoint:

```text
GET /api/v1/bootstrap
```

Could return:

- profile;
- equipment;
- current program;
- latest performance;
- sync metadata.

However:

V1 local-first app already boots from IndexedDB.

Therefore `/bootstrap` is optional, not required.

---

# 134. Static Exercise Library Delivery

Because exercises are seeded and relatively static, the PWA may:

- bundle core V1 exercises;
- cache server library;
- periodically sync metadata.

The API should not require downloading the entire library every app launch.

---

# 135. Exercise Library Version Endpoint

Optional:

```text
GET /api/v1/exercises/version
```

Response:

```json
{
  "success": true,
  "data": {
    "version": "1.0.3"
  }
}
```

Client updates cached definitions only when needed.

---

# 136. Feature Configuration Endpoint

Optional:

```text
GET /api/v1/config
```

May return public configuration:

```json
{
  "aiCoachEnabled": true,
  "voiceGuidanceEnabled": true
}
```

Never return secrets.

---

# 137. Future Notifications API

Not needed in core V1.

Later:

```text
POST /api/v1/push/subscriptions
DELETE /api/v1/push/subscriptions/:id
```

---

# 138. Future File Upload Contract

Progress photos and video form analysis may later use:

1. request signed upload URL;
2. direct object-storage upload;
3. confirm metadata.

Avoid routing large video uploads through Express memory.

---

# 139. Backward Compatibility

Frontend should tolerate new optional fields.

Backend should not remove/rename existing fields within V1 without coordinated migration.

---

# 140. API Deprecation

Future deprecated fields/endpoints should be:

- documented;
- monitored;
- removed only in a new API version or controlled migration.

---

# 141. API Acceptance Test — Offline Workout

Scenario:

1. Client generates workout offline.
2. Client completes session offline.
3. Client reconnects.
4. Sends sync batch.
5. Express creates workout/session records.
6. Duplicate retry occurs.
7. Server returns idempotent result.
8. No duplicate workout exists.

This is a critical acceptance test.

---

# 142. API Acceptance Test — Conflict

Scenario:

1. Server assessment version = 3.
2. Client edits version = 2.
3. Client sends sync.
4. Express detects mismatch.
5. Returns `CONFLICT`.
6. No silent overwrite.

---

# 143. API Acceptance Test — Pain Preservation

Scenario:

1. Two offline pain events are created.
2. Both sync.
3. Both remain in PostgreSQL.
4. Safety state is not lost.

---

# 144. API Acceptance Test — AI Failure

Scenario:

1. Workout is already finalized.
2. Client requests AI recap.
3. AI provider unavailable.
4. API returns 503 AI-specific error.
5. Workout remains fully saved.
6. Client may retry later.

---

# 145. API Acceptance Test — Authorization Future

Scenario:

User A requests:

```text
/workout-sessions/{User-B-session}
```

Expected:

```text
404 or 403
```

depending chosen privacy convention.

No User B data returned.

---

# 146. Privacy Convention

For user-owned missing/unauthorized resource, BellGrinda may prefer:

```text
404
```

to avoid confirming another user's resource exists.

---

# 147. API Success Criteria

The REST contract succeeds if:

- the PWA can sync offline-created data;
- retries do not create duplicates;
- conflicts are explicit;
- AI failures do not break training;
- safety data is preserved;
- endpoints are consistently validated;
- future auth can be added cleanly;
- API contracts map naturally to RTK Query;
- core workouts do not depend on network availability.

---

# 148. API Failure Conditions

The contract should be reconsidered if:

- every set requires an HTTP request;
- the client can directly manipulate Performance Scores;
- the client can arbitrarily remove restrictions;
- duplicate sync requests duplicate data;
- user ID in body determines authorization;
- AI endpoint invents or mutates training prescriptions;
- errors use inconsistent shapes;
- domain errors become generic 500 responses.

---

# 149. Core V1 Endpoint Set

Minimum backend implementation should include:

```text
GET  /api/v1/health

GET  /api/v1/profile
PATCH /api/v1/profile

GET  /api/v1/equipment
POST /api/v1/equipment
PATCH /api/v1/equipment/:id
DELETE /api/v1/equipment/:id

GET  /api/v1/exercises
GET  /api/v1/exercises/:id

GET  /api/v1/program

GET  /api/v1/workouts
GET  /api/v1/workouts/:id

GET  /api/v1/workout-sessions
GET  /api/v1/workout-sessions/:id

GET  /api/v1/readiness
GET  /api/v1/pain-events

GET  /api/v1/assessments
GET  /api/v1/performance/latest
GET  /api/v1/personal-records
GET  /api/v1/progress/overview

POST /api/v1/sync

POST /api/v1/ai/workout-recap
POST /api/v1/ai/assessment-report
POST /api/v1/ai/coach
```

Other endpoints can be added as implementation expands.

---

# 150. Recommended Express Route Registration

Conceptually:

```ts
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/equipment", equipmentRouter);
app.use("/api/v1/exercises", exerciseRouter);
app.use("/api/v1/program", programRouter);
app.use("/api/v1/workouts", workoutRouter);
app.use("/api/v1/workout-sessions", workoutSessionRouter);
app.use("/api/v1/readiness", readinessRouter);
app.use("/api/v1/pain-events", painRouter);
app.use("/api/v1/assessments", assessmentRouter);
app.use("/api/v1/performance", performanceRouter);
app.use("/api/v1/personal-records", personalRecordRouter);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/activities", activityRouter);
app.use("/api/v1/sync", syncRouter);
app.use("/api/v1/ai", aiRouter);
```

---

# 151. API Development Order

## Phase 1 — Foundation

- health;
- shared response/error utilities;
- request ID;
- validation middleware;
- database connection.

## Phase 2 — Read APIs

- profile;
- exercises;
- program;
- equipment.

## Phase 3 — Sync Infrastructure

- sync operation DTOs;
- idempotency;
- version checks;
- sync audit.

## Phase 4 — Workout Cloud History

- workouts;
- sessions;
- readiness;
- pain.

## Phase 5 — Analytics

- assessments;
- performance;
- PRs;
- progress.

## Phase 6 — Activities

- football;
- jogging.

## Phase 7 — AI

- recap;
- assessment report;
- Coach.

## Phase 8 — Future Auth

Add without redesigning the resource contract.

---

# 152. Final API Principle

BellGrinda's Express API should be:

**a reliable synchronization and service boundary**

not

**the thing that makes every workout button work.**

The PWA remains responsible for immediate training execution.

Express is responsible for:

- persistence;
- synchronization;
- cross-device state;
- AI;
- future account services.

---

# 153. Next Specification

With the core product, training engine, frontend architecture, PostgreSQL schema, and Express API contract now defined, the next planning document should be:

# BellGrinda Implementation Roadmap & Milestone Specification

This should define:

- actual development phases;
- milestone order;
- dependencies;
- what gets built first;
- what can be postponed;
- MVP acceptance criteria;
- recommended branch/repository strategy;
- testing gates;
- PWA/offline milestone;
- training-engine milestone;
- Workout Player milestone;
- analytics milestone;
- backend/sync milestone;
- AI milestone;
- December-use readiness target;
- post-V1 backlog.

After that, the roadmap can be converted into **agent-ready development prompts/tasks** so implementation can begin systematically.
