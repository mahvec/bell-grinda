# BellGrinda Workout Session & Logging Specification

**Version:** 0.1  
**Purpose:** Define how BellGrinda executes, persists, restores, completes, and records workout sessions.  
**Applies To:** Novice → Grandmaster  
**Session Type:** Local-first, offline-capable, recoverable  
**Primary Requirement:** An active workout must survive phone locking, browser suspension, refreshes, accidental closure, and temporary loss of internet connectivity.

---

# 1. Purpose

The Workout Session system is responsible for converting a generated workout prescription into an actual recorded training session.

It must manage:

- workout start;
- active workout state;
- exercise progression;
- rounds;
- reps;
- kettlebell loads;
- rest;
- substitutions;
- skipped exercises;
- pain/discomfort;
- pause/resume;
- phone lock/unlock;
- browser refresh;
- unexpected app termination;
- workout completion;
- session abandonment;
- RPE;
- notes;
- Personal Record detection;
- persistence;
- synchronization.

The user must be able to train without worrying that BellGrinda will lose progress.

---

# 2. Core Principle

BellGrinda shall treat active workout data as:

**Critical persistent state**

not temporary React UI state.

The system shall assume that the browser or mobile operating system may suspend or terminate the application at any time.

---

# 3. Session Lifecycle

A workout may move through:

1. Prepared.
2. Active.
3. Paused.
4. Suspended.
5. Resumed.
6. Completed.
7. Abandoned.

Possible flow:

**Generated Workout**

↓

**Start Workout**

↓

**Active**

↓

Possible Pause / Suspend / Restore

↓

**Complete Workout**

↓

**Session Review**

↓

**Persist Final Record**

↓

**AI Recap / Progress Update**

---

# 4. Prepared State

Before workout start, BellGrinda has a generated workout snapshot containing:

- exercises;
- order;
- reps;
- loads;
- variations;
- rounds;
- rest;
- warm-up;
- cooldown;
- substitutions;
- generation reason codes.

The user may review the workout before starting.

---

# 5. Start Workout

When the user presses:

**Start Workout**

BellGrinda shall create a new:

**WorkoutSession**

with:

- unique Session ID;
- source Workout ID;
- date;
- start timestamp;
- Training Level;
- Training Phase;
- readiness state;
- football context;
- workout snapshot;
- status = Active.

The session must be persisted immediately.

---

# 6. Workout Snapshot

Once a workout begins, the prescription becomes a session snapshot.

The system should not silently regenerate the workout while the user is training.

The snapshot stores:

- exercise list;
- exercise order;
- target reps;
- target loads;
- target variation;
- planned rounds;
- rest guidance;
- approved substitutions.

Only safety-related or explicit user changes may alter the active session.

---

# 7. Active Session Data

BellGrinda should maintain at minimum:

```text
WorkoutSession

id
userId
workoutId
status

startedAt
lastUpdatedAt
completedAt

trainingLevel
trainingPhase
blockId

currentRound
currentExerciseIndex

plannedRounds
completedRounds

sessionElapsedTime

readinessStatus
footballStatus

sessionRpe
notes
```

---

# 8. Exercise Session Data

Each exercise within the session should maintain:

```text
ExerciseSession

id
sessionId
exerciseId

plannedVariation
actualVariation

plannedLoad
actualLoad

plannedReps
completedReps

round

status

startedAt
completedAt

rpe
painReported
substituted
skipped
```

---

# 9. Active Workout Player

The Workout Player should prominently display:

**Round 3 / 5**

**Exercise 2 / 5**

One-Arm Row

16 kg

10 reps / side

Primary actions:

- Complete.
- Demo.
- Substitute.
- Report Discomfort.
- Pause.
- End Workout.

The interface must minimize taps during training.

---

# 10. Exercise Completion

When the user taps:

**Complete**

BellGrinda records:

- completed timestamp;
- planned reps;
- actual reps;
- planned load;
- actual load;
- round;
- exercise status.

Then immediately persist the updated session.

---

# 11. Actual Rep Entry

BellGrinda should default to assuming prescribed reps were completed.

Example:

Target:

12 reps.

User taps Complete.

BellGrinda records:

12 reps.

The user may adjust actual reps when needed.

This minimizes logging friction.

---

# 12. Rep Adjustment

If the target is 12 but the user completed 9:

The user may quickly change:

**12 → 9**

before confirming completion.

BellGrinda stores:

Planned: 12.

Completed: 9.

---

# 13. Load Adjustment

The Workout Player shall show prescribed load.

Example:

**16 kg**

The user may choose:

- prescribed load;
- lighter available load;
- manually selected heavier load.

Downward changes require no warning.

Unsafe upward changes may trigger a warning.

---

# 14. Actual Load Logging

BellGrinda must store:

**Prescribed Load**

separately from:

**Actual Load**

Example:

Prescribed:
16 kg.

Actual:
12 kg.

This becomes important for Progression Engine decisions.

---

# 15. Round Tracking

BellGrinda shall automatically manage round progression.

Example:

After Exercise 5 is completed:

Round 1 becomes:

**Completed**

The app transitions into:

**Round Rest**

then:

**Round 2 / 5**

---

# 16. Partial Round

If the user ends the workout partway through a round:

BellGrinda shall preserve:

- completed exercises;
- skipped exercises;
- incomplete exercises.

Do not discard the entire round.

---

# 17. Round Completion

A round is complete when all required exercise slots are:

- completed;
- skipped;
- substituted and completed.

The session then increments:

`currentRound`

---

# 18. Rest Timer

BellGrinda shall support:

- between-exercise rest;
- between-round rest.

Rest timers must use timestamps rather than only in-memory countdown values.

---

# 19. Timer Data

Persist:

```text
restStartedAt
restDurationSeconds
restType
```

rather than only:

```text
remainingSeconds
```

---

# 20. Timer Restoration

When BellGrinda resumes:

```text
elapsed = now - restStartedAt
remaining = restDuration - elapsed
```

If:

remaining <= 0

display:

**Rest Complete**

This prevents timers freezing while the phone is locked.

---

# 21. Rest Timer Controls

User may:

- Skip Rest.
- Add 15 seconds.
- Add 30 seconds.
- Pause workout.

Extended rest should be logged where useful but never treated as failure.

---

# 22. Workout Duration

Workout elapsed time shall use:

- session startedAt;
- pause periods;
- current timestamp.

BellGrinda should distinguish:

**Total elapsed time**

from

**Active workout time**

where practical.

---

# 23. Pause Workout

When Pause is selected:

- status = Paused;
- pause timestamp recorded;
- active timer stops;
- session persisted.

The user may later:

**Resume Workout**

---

# 24. Pause Reason

Optional reasons may include:

- phone call;
- bathroom;
- interruption;
- fatigue;
- other.

V1 does not require pause-reason entry.

---

# 25. Phone Lock Handling

The application must assume the user may lock the phone during:

- an exercise;
- rest;
- pause;
- transitions.

Locking the phone must not destroy session state.

---

# 26. App Backgrounding

When BellGrinda becomes hidden:

via:

- phone lock;
- app switch;
- browser tab switch;

the system should attempt to flush the current active state to persistent local storage.

Browser lifecycle signals may include:

- `visibilitychange`;
- `pagehide`.

However, BellGrinda must not rely exclusively on these events.

---

# 27. Incremental Persistence

Critical session state shall be persisted after:

- workout start;
- exercise completion;
- rep modification;
- load modification;
- round completion;
- substitution;
- skip;
- pain report;
- pause;
- resume;
- meaningful rest state creation;
- workout completion.

This prevents large amounts of progress from being lost.

---

# 28. Local Persistence Technology

BellGrinda should use:

**IndexedDB**

or equivalent durable browser database for:

- active session;
- workout history;
- exercise session records;
- pain events;
- session review;
- synchronization queue.

`localStorage` should not be the primary workout database.

---

# 29. Redux / Application State

In-memory application state may use:

**Redux Toolkit**

for active UI/application behavior.

Persistent state should be stored separately.

Conceptual flow:

**IndexedDB**

↓

hydrate

↓

**Redux**

↓

user action

↓

update Redux

↓

persist critical state back to IndexedDB.

---

# 30. Application Startup

When BellGrinda launches:

1. Check for unfinished active session.
2. Validate stored session.
3. Restore if appropriate.
4. Recalculate timers.
5. Rehydrate Workout Player state.

---

# 31. Active Session Recovery

If an unfinished workout exists:

Display:

# Workout in Progress

Wednesday — Upper Body Strength

Round 3 / 5

Exercise 4 / 5

Last activity:

7 minutes ago.

Actions:

- Resume Workout.
- End Session.

---

# 32. Automatic Resume

For short interruptions:

BellGrinda may directly restore the Workout Player.

Example:

Phone locked for:

2 minutes.

Unlock:

Return directly to workout.

---

# 33. Resume Confirmation

For longer interruptions:

BellGrinda should request confirmation.

Example:

Last active:

45 minutes ago.

Options:

- Resume.
- End Session.

---

# 34. Long Suspension

If an active workout has been inactive for many hours:

BellGrinda should not automatically assume the workout is still ongoing.

Possible state:

**Interrupted Session**

The user may:

- Resume.
- Complete as partial.
- Abandon.

---

# 35. Browser Refresh

Refreshing the browser must:

- reload app;
- detect active session;
- hydrate session state;
- restore current round;
- restore exercise;
- restore completed work.

The user must not return to Round 1.

---

# 36. Browser Crash

If the browser crashes:

BellGrinda should restore from the latest persisted session snapshot on reopening.

At worst, only the last unpersisted micro-action should be at risk.

---

# 37. Device Restart

If the device restarts:

BellGrinda should restore unfinished session state after reopening the PWA.

This requires IndexedDB/local persistence.

---

# 38. Offline Workout

Workout execution must work without internet access.

Offline-supported actions:

- view workout;
- complete exercises;
- modify reps;
- modify load;
- timers;
- rounds;
- substitutions;
- pain reports;
- pause/resume;
- finish workout;
- session review.

AI recap may wait until connectivity returns.

---

# 39. Offline Media

Exercise demonstration media may be:

- cached;
- selectively downloaded;
- unavailable offline if not cached.

Failure to load a demo video must never block the workout.

Written cues should remain available offline.

---

# 40. Skip Exercise

The user may select:

**Skip**

BellGrinda should ask for an optional quick reason.

Possible reasons:

- too difficult;
- equipment issue;
- discomfort;
- time;
- other.

A skip is stored separately from completion.

---

# 41. Skip Safety

If the user skips due to discomfort:

BellGrinda should offer:

**Report Discomfort**

rather than forcing extra data entry.

---

# 42. Exercise Substitution

Tap:

**Substitute**

BellGrinda displays approved substitutions.

Example:

Swing

→ Deadlift  
→ Glute Bridge

The user selects replacement.

The replacement becomes active for:

- current round only;
- or remaining rounds.

---

# 43. Substitution Scope

BellGrinda should ask:

**Use for:**

- This round.
- Remaining workout.

Default:

Remaining workout.

---

# 44. Substitution Logging

Record:

- original exercise;
- replacement;
- reason;
- round;
- remaining-session scope;
- user or engine initiated.

---

# 45. Pain Reporting During Workout

Tap:

**Report Discomfort**

Then:

1. Select location.
2. Select severity.
3. Optional note.

BellGrinda immediately stores the PainEvent.

---

# 46. Pain Response

Depending on severity:

## Mild

Monitor and offer substitution.

## Moderate

Stop current exercise.

Recommend substitute/skip.

## Severe

Stop exercise and recommend ending relevant workload and appropriate evaluation.

The active session record must retain the event.

---

# 47. Safety Persistence

Pain and restriction events must be persisted immediately.

They must survive:

- refresh;
- lock;
- crash;
- offline state.

Safety-critical data takes priority over analytics.

---

# 48. Mid-Workout Exercise Restriction

If an exercise becomes Restricted during a session:

it must not appear in subsequent rounds.

BellGrinda should replace it with:

- approved substitute;
- skip slot if none exists.

---

# 49. Workout Abandonment

If the user chooses:

**End Workout**

before completion:

BellGrinda should ask:

- Complete as Partial.
- Abandon Workout.
- Continue Training.

---

# 50. Partial Completion

A Partial session stores:

- completed rounds;
- completed exercises;
- actual reps;
- duration;
- pain events;
- substitutions.

Partial training should remain useful data.

---

# 51. Abandoned Session

An Abandoned workout should retain a minimal historical record:

- date;
- start time;
- amount completed;
- reason where supplied.

The session should not simply disappear.

---

# 52. Accidental Abandonment Prevention

Ending an active workout requires confirmation.

Example:

**End this workout?**

You have completed:

3 of 5 rounds.

Options:

- Continue.
- Complete as Partial.
- Abandon.

---

# 53. Workout Completion

When final exercise of final round is completed:

BellGrinda transitions to:

# Workout Complete

The session enters:

**Review Pending**

rather than immediately becoming immutable.

---

# 54. Session Review

Review screen should show:

- duration;
- rounds;
- exercises;
- planned vs completed reps;
- loads;
- substitutions;
- skipped movements;
- pain reports;
- Personal Records.

Then ask:

**How hard was this workout?**

RPE:

1–10.

---

# 55. Session RPE

RPE entry should be required or strongly encouraged before finalizing.

Allow:

**Skip for now**

if necessary.

Missing RPE should reduce confidence in some progression decisions but not invalidate the workout.

---

# 56. Workout Notes

Optional free-text notes.

Examples:

- Presses felt easier.
- Legs were tired after football.
- Swing felt uncomfortable.
- Great session.

Notes should not be required.

---

# 57. Session Finalization

When review is confirmed:

status becomes:

**Completed**

Store:

- completedAt;
- final duration;
- session RPE;
- final notes;
- actual exercise data;
- pain events;
- substitutions.

---

# 58. Finalized Session Immutability

A finalized session should not be casually rewritten.

Users may later correct:

- reps;
- load;
- notes;
- RPE.

Edits should preserve:

- original value;
- updated value;
- timestamp

where practical.

---

# 59. Progression Processing

After session completion:

BellGrinda sends session data to:

**Progression Engine**

Inputs include:

- exercise results;
- RPE;
- pain;
- load;
- reps;
- completion.

The engine then updates future progression states.

---

# 60. Personal Record Detection

After finalization:

BellGrinda evaluates:

- push-up max;
- highest load;
- highest reps at load;
- circuit completion;
- fastest circuit;
- density;
- streaks.

PRs should be detected from validated completed data.

---

# 61. PR Notification

Example:

**New Personal Record**

One-Arm Row

20 kg × 10

Previous:

20 kg × 8

Notifications should remain brief.

---

# 62. PR Confirmation

BellGrinda does not need user confirmation for obvious data-derived PRs.

The user may correct the underlying workout if the record was logged incorrectly.

---

# 63. Workout Streak

A streak should count scheduled BellGrinda adherence.

Approved:

- normal workout;
- Yellow modified workout;
- Red recovery workout;
- football-adjusted session.

Missed workout:

breaks or affects streak according to final streak design.

Pain reporting must never break a streak by itself.

---

# 64. Session Completion Percentage

BellGrinda may calculate:

```text
completedRequiredWork / plannedRequiredWork
```

Example:

4 of 5 rounds:

approximately 80%.

This may feed consistency analytics.

---

# 65. Active vs Historical Session

BellGrinda shall maintain only one active primary workout session at a time in V1.

Historical sessions are immutable records.

---

# 66. Duplicate Session Prevention

Starting Today's Workout while one active session exists should trigger:

**Workout already in progress**

Options:

- Resume Existing.
- End Existing Session.

BellGrinda should not silently create a duplicate.

---

# 67. Unique Session ID

Every workout session must receive a globally unique identifier.

This ID is used for:

- local persistence;
- backend sync;
- deduplication.

---

# 68. Sync Queue

Offline-created records enter:

**Sync Queue**

Potential records:

- workout session;
- exercise sessions;
- pain events;
- readiness data;
- RPE;
- PRs;
- assessments.

---

# 69. Sync State

Records may have:

- Local Only.
- Pending Sync.
- Syncing.
- Synced.
- Conflict.
- Failed.

Workout usability must not depend on sync success.

---

# 70. Sync Trigger

Synchronization may occur when:

- connectivity returns;
- app opens online;
- workout finishes online;
- background sync is available.

---

# 71. Duplicate Prevention

Backend synchronization shall use:

**Session ID**

as an idempotency key.

Submitting the same workout twice must not create duplicate workouts.

---

# 72. Conflict Handling

If local and server versions differ:

BellGrinda should prefer:

- preserving the most complete workout;
- preserving safety data;
- preserving explicit user edits.

Conflicts should never silently delete PainEvents.

---

# 73. Local-First Principle

Local workout state is authoritative while an active session is in progress.

Server synchronization should not overwrite active local progress with stale data.

---

# 74. Completion Sync

A completed workout may remain:

**Completed — Pending Sync**

The user can continue using BellGrinda normally.

---

# 75. Crash Recovery Marker

BellGrinda should maintain:

```text
lastPersistedAt
```

for active sessions.

This helps determine the freshness of recovered state.

---

# 76. Persistence Frequency

BellGrinda should persist after actions rather than continuously writing every second.

Timers can be reconstructed from timestamps.

This reduces unnecessary storage writes.

---

# 77. Critical Persistence Events

Mandatory write events:

- Start.
- Exercise Complete.
- Rep Edit.
- Load Edit.
- Substitution.
- Skip.
- Pain Report.
- Round Complete.
- Pause.
- Resume.
- Workout End.
- RPE Save.

---

# 78. Non-Critical State

Not everything needs persistence.

Examples:

- current animation;
- open tooltip;
- scroll position;
- temporary modal state.

Critical workout state and temporary UI state shall remain separate.

---

# 79. Workout Player Navigation

The user should be able to view:

- previous exercise;
- current exercise;
- next exercise.

However, moving backward should not automatically erase completed data.

---

# 80. Edit Completed Exercise

The user may tap a completed exercise and correct:

- reps;
- load;
- notes.

The correction is persisted immediately.

---

# 81. Undo Completion

BellGrinda may allow:

**Undo Complete**

for the most recent exercise.

This is useful for accidental taps.

---

# 82. Prevent Double Completion

Rapid double-tapping Complete must not advance two exercises.

The action should be idempotent or temporarily disabled while state commits.

---

# 83. Workout Timer After Refresh

Example:

Workout began:
18:00.

Phone/browser suspended:
18:17.

Returns:
18:23.

BellGrinda should know approximately:

23 minutes have elapsed,

while accounting for explicitly paused periods.

---

# 84. Rest Timer After Lock

Rest began:

18:17:00.

Duration:

60 seconds.

User unlocks:

18:19:00.

BellGrinda displays:

**Rest Complete**

not:

**60 seconds remaining**

---

# 85. Phone Call Scenario

If a phone call interrupts the session:

BellGrinda may remain Active or auto-pause depending on final UX.

Recommended:

Do not automatically pause based only on app backgrounding.

Instead:

Timers continue based on real-world time.

The user can manually Pause if necessary.

---

# 86. Why Backgrounding Should Not Equal Pause

The user may intentionally lock the phone during a 60-second rest.

Automatically pausing would make rest timing inaccurate.

Therefore:

**App hidden ≠ Workout paused**

Pause must be explicit.

---

# 87. Explicit Pause Timing

If user selects Pause:

Workout active time stops.

Rest timer also pauses or ends according to UX design.

Recommended:

Pause suspends workout timing entirely.

---

# 88. Audio / Voice Guidance

If enabled:

BellGrinda may announce:

- next exercise;
- reps;
- load;
- rest complete;
- next round.

Voice should not be required for session operation.

---

# 89. Voice Offline Behavior

If TTS requires internet and connectivity is lost:

Workout continues normally without voice.

Locally available browser/device TTS may be used where practical.

---

# 90. Haptic / Notification Support

Future PWA enhancements may provide:

- vibration when rest ends;
- notification when rest ends while screen is locked.

Support varies by platform/browser and should not be required for V1 correctness.

---

# 91. Workout Player Offline Indicator

BellGrinda may display a small:

**Offline**

indicator.

Avoid alarming messaging.

Workout remains fully functional.

---

# 92. Unsynced Indicator

Example:

**Saved on device — sync pending**

This reassures the user that data is not lost.

---

# 93. Session Recovery Validation

When restoring an active workout, BellGrinda should validate:

- session record readable;
- workout snapshot exists;
- current round valid;
- exercise index valid.

If partially corrupted:

restore maximum valid progress where possible.

---

# 94. Recovery Failure

If active data cannot be restored:

BellGrinda should not silently discard it.

Possible action:

**Workout recovery issue**

Offer:

- recover partial session;
- save available data;
- start fresh.

---

# 95. Database Migration

Because PWA versions will evolve, IndexedDB schema must be versioned.

Database migrations should preserve:

- active sessions;
- workout history;
- PainEvents.

---

# 96. App Update During Active Session

If a new BellGrinda version becomes available:

do not force refresh during active workout.

Apply update after:

- session completion;
- session pause with confirmation;
- next app launch.

---

# 97. Active Session Protection

Service worker updates should not unexpectedly destroy the Workout Player.

This is a critical PWA requirement.

---

# 98. Session Audit Log

BellGrinda may maintain lightweight event history:

```text
WORKOUT_STARTED
EXERCISE_COMPLETED
LOAD_CHANGED
PAIN_REPORTED
EXERCISE_SUBSTITUTED
WORKOUT_PAUSED
WORKOUT_RESUMED
WORKOUT_COMPLETED
```

This is useful for debugging and recovery.

---

# 99. Session Event Timestamp

Every important event should receive a timestamp.

This enables:

- recovery;
- auditability;
- future analytics.

---

# 100. Session Analytics

Useful derived metrics include:

- total duration;
- active duration;
- average round duration;
- rest usage;
- completion percentage;
- total reps;
- per-exercise volume;
- substitutions;
- pain events;
- RPE.

Not all metrics need to be displayed.

---

# 101. Volume Calculation

For loaded movements, BellGrinda may calculate:

```text
load × completed reps
```

as simple training volume.

For unilateral movements, both sides should be included appropriately.

Volume should not be treated as the sole measure of performance.

---

# 102. Bodyweight Exercise Logging

For push-ups and similar exercises:

store:

- variation;
- reps;
- RPE where available.

Do not invent fake external load values.

---

# 103. Asymmetrical Exercise Logging

For unilateral exercises BellGrinda may allow:

Right:
10 reps.

Left:
8 reps.

V1 may default to equal reps but should support asymmetrical data structurally.

---

# 104. Failed Exercise

BellGrinda should not need a dramatic:

**FAIL**

state.

If user cannot complete target:

record actual reps.

Example:

Target: 10.

Actual: 6.

The Progression Engine interprets it afterward.

---

# 105. Mid-Session RPE

V1 should not ask for RPE after every exercise by default.

This would create excessive logging friction.

Optional exercise-specific RPE may be available when:

- load trial;
- performance test;
- user chooses to record it.

---

# 106. Load Trial Logging

When testing a new load:

Workout Player should clearly display:

**Load Trial**

After completion BellGrinda may ask:

**How did this load feel?**

- Comfortable.
- Challenging.
- Too heavy.

This can supplement RPE.

---

# 107. Performance Test Sessions

Performance Tests use the same session infrastructure but may have:

- different rounds;
- mandatory result fields;
- stricter historical comparison;
- no automatic exercise substitution where test integrity matters.

Pain rules still override testing.

---

# 108. Football Sessions

Football can be logged as a separate ActivitySession.

Potential fields:

- date;
- duration;
- intensity;
- competition state;
- soreness;
- pain/injury.

Football records feed readiness and workload history.

---

# 109. Jogging Sessions

Jogging may similarly store:

- duration;
- optional distance;
- intensity/RPE.

It does not need the full circuit session model.

---

# 110. Workout History

Completed and partial sessions appear in Workout History.

Each record should show:

- date;
- workout focus;
- level;
- completion;
- duration;
- RPE;
- key PR if any.

---

# 111. Workout Detail History

Opening a session shows:

- all exercises;
- loads;
- reps;
- rounds;
- substitutions;
- skips;
- pain;
- RPE;
- notes;
- AI recap.

---

# 112. Session Editing

Historical editing should be possible for obvious mistakes.

BellGrinda should warn before deleting entire sessions.

---

# 113. Session Deletion

Deletion should generally use:

**Delete Workout Record**

with confirmation.

For future multi-device support, deletion should sync as a tombstone rather than allowing deleted records to return from server sync.

---

# 114. Data Integrity

Session records must preserve relationships among:

- workout;
- exercise sessions;
- pain events;
- PRs;
- AI recap.

Deleting or editing one record should not silently orphan related data.

---

# 115. Session Finalization Flow

```text
Last Exercise Completed
        ↓
Workout Complete
        ↓
Review Results
        ↓
Enter Session RPE
        ↓
Optional Notes
        ↓
Confirm
        ↓
Finalize Workout
        ↓
Detect PRs
        ↓
Run Progression Engine
        ↓
Update Performance Data
        ↓
Queue Sync
        ↓
Generate AI Recap When Available
```

---

# 116. Active Session Persistence Flow

```text
User Action
     ↓
Update Redux State
     ↓
Write Critical State to IndexedDB
     ↓
Continue Workout
```

If app disappears:

```text
App Relaunch
     ↓
Read IndexedDB
     ↓
Find Active Session
     ↓
Restore Redux
     ↓
Recalculate Timers
     ↓
Resume Exact Workout Position
```

---

# 117. Session State Machine

Conceptually:

```text
PREPARED
   ↓
ACTIVE
 ↙   ↘
PAUSED  SUSPENDED
  ↓       ↓
RESUMED ←
   ↓
ACTIVE
 ↙    ↘
COMPLETED PARTIAL/ABANDONED
```

Suspended is generally an inferred technical state rather than something the user manually selects.

---

# 118. Session Reason Codes

Examples:

- SESSION_STARTED.
- SESSION_RESUMED.
- SESSION_RECOVERED.
- EXERCISE_COMPLETED.
- EXERCISE_SKIPPED.
- EXERCISE_SUBSTITUTED.
- LOAD_MODIFIED.
- REPS_MODIFIED.
- PAIN_REPORTED.
- SESSION_PAUSED.
- SESSION_PARTIAL.
- SESSION_ABANDONED.
- SESSION_COMPLETED.
- SESSION_SYNC_PENDING.
- SESSION_SYNCED.

---

# 119. Session Versioning

Store:

**sessionSchemaVersion**

Example:

1.0.

This helps migrate persistent records over time.

---

# 120. Core UX Principle

The app shall collect as much useful workout data as possible automatically.

During training the user should primarily need to:

- tap Complete;
- occasionally modify reps/load;
- report discomfort;
- substitute when necessary.

BellGrinda should avoid turning exercise into data entry.

---

# 121. Success Criteria

The Workout Session system succeeds if:

- a workout can run fully offline;
- phone locking does not lose state;
- refresh does not lose state;
- browser crashes recover recent progress;
- timers remain accurate after suspension;
- actual reps/load are preserved;
- pain data persists immediately;
- partial sessions remain useful;
- duplicate sessions are prevented;
- syncing does not block training;
- the interface remains low-friction.

---

# 122. Failure Conditions

The system is poorly designed if:

- a phone lock restarts the workout;
- refresh loses rounds;
- internet loss blocks completion;
- timers freeze in the background;
- the user must log every tiny detail manually;
- pain records disappear;
- duplicate workouts appear after sync;
- application updates interrupt active workouts;
- ending one exercise accidentally completes two.

---

# 123. BellGrinda Session Principle

BellGrinda should behave as though:

**The workout is more important than the app.**

The software must quietly preserve data while allowing the user to focus on training.

---

# 124. Next Specification

With workouts now able to be generated, executed, persisted, and recorded, the next item should be:

# BellGrinda Assessments, Progress Analytics & Personal Records Specification

That specification should define:

- baseline assessment;
- biweekly assessments;
- measurement history;
- weight/chest/waist tracking;
- push-up tests;
- Performance Tests;
- Personal Record detection;
- progression charts;
- Training Level history;
- Performance Grade history;
- exercise progression history;
- comparison periods;
- December Initial Assessment;
- long-term annual assessments;
- progress-dashboard data rules;
- how AI reports consume verified progress data.

This creates the analytical layer that turns months of Workout Session data into understandable evidence of progress.
