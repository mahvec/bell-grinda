# BellGrinda Workout Generation & Exercise Selection Specification

**Version:** 0.1  
**Purpose:** Define how BellGrinda converts training state, progression state, safety state, equipment, priorities, and weekly workload into an actual workout prescription.  
**Applies To:** Novice → Grandmaster  
**Workout Model:** Primarily 5 exercises × 5 rounds, with approved exceptions  
**Target Session Duration:** Approximately 40 minutes including warm-up, rest, and cooldown  
**Generation Type:** Deterministic, constraint-based, exercise-library driven

---

# 1. Purpose

The Workout Generation Engine determines:

- which exercises appear;
- which exercises are excluded;
- exercise order;
- load;
- repetitions;
- variation;
- rounds;
- rest;
- warm-up;
- cooldown;
- substitutions;
- football-related modifications;
- readiness modifications.

The engine receives decisions from the Progression and Safety layers and converts them into a complete workout.

The engine does not decide whether a user should progress.

It receives progression states and applies them correctly.

---

# 2. Core Generation Principle

Workout generation shall follow:

**Training Goal**

↓

**Training Level / Phase**

↓

**Daily Focus**

↓

**Safety Restrictions**

↓

**Readiness**

↓

**Available Equipment**

↓

**Progression State**

↓

**Exercise Selection**

↓

**Load + Reps + Rest**

↓

**Fatigue Check**

↓

**Duration Check**

↓

**Final Workout**

---

# 3. Required Inputs

Workout generation may use:

## Program Inputs

- Training Level.
- Current Phase.
- Current week.
- Day of week.
- Training block.
- Primary priority.
- Secondary priority.

## User Inputs

- Available equipment.
- Exercise experience.
- Current approved working loads.
- User exercise preferences where supported.

## Safety Inputs

- Readiness classification.
- Exercise restrictions.
- Pain history.
- Current soreness.
- Deload status.
- Reconditioning mode.

## External Workload

- Football status.
- Jogging activity.
- Competition status.

## Progression Inputs

- Exercise progression state.
- Approved variation.
- Approved load.
- Rep range.
- plateau status.

---

# 4. Generation Output

A generated workout shall include:

- Workout ID.
- Date.
- Training Level.
- Training Phase.
- Focus.
- Readiness status.
- Football mode.
- Warm-up.
- Five main exercise slots where appropriate.
- Exercise order.
- Variation.
- Kettlebell load.
- Target reps.
- Total rounds.
- Rest between exercises.
- Rest between rounds.
- Exercise substitutions.
- Cooldown.
- Estimated session duration.
- Generation reason codes.

---

# 5. Daily Training Templates

BellGrinda shall maintain recognizable weekly templates.

Default:

## Monday

Strength / lower-body + pull emphasis.

## Tuesday

Athletic conditioning / power.

## Wednesday

Upper-body strength + chest.

## Thursday

Power / complex / work capacity.

## Friday

Football-aware hybrid or recovery.

Advanced and Grandmaster may modify emphasis according to adaptive priorities.

---

# 6. Workout Slot Architecture

Rather than hard-code specific exercises forever, BellGrinda shall generate workouts from movement slots.

Example basic structure:

1. Primary strength movement.
2. Pull or secondary strength movement.
3. Push/chest movement.
4. Secondary lower-body / hinge / unilateral movement.
5. Conditioning or core movement.

Different training days may use different slot structures.

---

# 7. Monday Slot Template

Default Monday:

## Slot 1

Squat / lower-body strength.

## Slot 2

Pull.

## Slot 3

Push.

## Slot 4

Hinge or unilateral lower-body.

## Slot 5

Carry, core, or light conditioning.

---

# 8. Tuesday Slot Template

Default Tuesday:

## Slot 1

Power or ballistic movement.

## Slot 2

Kettlebell skill.

## Slot 3

Push.

## Slot 4

Unilateral lower-body.

## Slot 5

Conditioning.

---

# 9. Wednesday Slot Template

Default Wednesday:

## Slot 1

Primary upper-body press.

## Slot 2

Pull.

## Slot 3

Chest-focused push.

## Slot 4

Lower-body maintenance.

## Slot 5

Core/stability.

---

# 10. Thursday Slot Template

Default Thursday:

## Slot 1

Power or clean-and-press movement.

## Slot 2

Hinge / ballistic movement.

## Slot 3

Push.

## Slot 4

Squat/lunge.

## Slot 5

Complex or conditioning.

---

# 11. Friday Slot Template

Friday generation depends on football status.

## No Football

Balanced full-body session.

## Football Scheduled

Reduced-fatigue activation session.

## Competition

Very light activation or recovery only.

## High Fatigue

Recovery-focused session.

---

# 12. Movement Categories

Every exercise shall belong to one or more movement categories.

Required categories:

- Squat.
- Hinge.
- Horizontal Push.
- Vertical Push.
- Pull.
- Unilateral Lower Body.
- Carry.
- Core/Stability.
- Conditioning.
- Ballistic.
- Complex.

---

# 13. Exercise Metadata Requirements

Each exercise must store:

- Exercise ID.
- Name.
- Movement category.
- Equipment required.
- Difficulty.
- Technical demand.
- Fatigue cost.
- Training effect.
- Suitable Training Levels.
- Approved loads.
- Rep ranges.
- Progressions.
- Regressions.
- Substitutions.
- Safety restrictions.
- Unilateral/bilateral.
- Ballistic/non-ballistic.
- Push/pull classification.
- Core/conditioning classification.

---

# 14. Core vs Rotating Exercises

BellGrinda shall distinguish:

## Core Exercises

Appear frequently enough for measurable progression.

Examples:

- Goblet squat.
- Row.
- Push-up.
- Press.
- Deadlift.
- Reverse lunge.
- Swing where safe.

## Rotating Exercises

Used to create variation or target a specific need.

Examples:

- Floor press.
- Suitcase march.
- Decline push-up.
- Hollow-body variation.
- Different complex variations.

---

# 15. Core Exercise Stability

Core exercises should not change randomly every week.

Frequent movement replacement makes progression difficult to measure.

BellGrinda should generally retain core exercises for at least:

**one Phase or training block**

unless:

- pain occurs;
- equipment changes;
- progression requires variation;
- training priority changes.

---

# 16. Rotation Rule

A rotating exercise may change when:

- a Phase changes;
- a priority changes;
- variation progression occurs;
- boredom/preferences justify a safe alternative;
- equipment changes.

Rotation must still preserve the intended movement category.

---

# 17. Exercise Selection Priority

When filling a slot, BellGrinda should evaluate candidate exercises in this order:

1. Safety eligibility.
2. Equipment availability.
3. Training Level suitability.
4. Current progression state.
5. Daily focus match.
6. Weekly movement balance.
7. Fatigue cost.
8. Recent exercise exposure.
9. Training priority.
10. Variation needs.

---

# 18. Exercise Exclusion Rules

An exercise must not be selected if:

- Restricted.
- Required equipment unavailable.
- Outside approved Training Level.
- Pain status blocks it.
- Football workload makes it inappropriate.
- Fatigue budget would be exceeded.
- Exercise duplicates another movement without intentional reason.

---

# 19. Duplicate Movement Prevention

BellGrinda should avoid unnecessary duplication.

Example:

Bad generic workout:

- Goblet squat.
- Front squat.
- Split squat.
- Reverse lunge.
- Skipping.

This overloads one movement pattern.

A session may intentionally contain multiple pushing exercises on chest-focused Wednesday, but duplication must be purposeful.

---

# 20. Same-Pattern Limit

Default maximum within one session:

- Squat-dominant movements: 2.
- Hinge movements: 2.
- Push movements: 2–3 depending on focus.
- Pull movements: 2.
- High-fatigue ballistic exercises: generally 1–2.

This remains configurable.

---

# 21. Weekly Movement Balance

Across a normal week BellGrinda should provide exposure to:

- Squat.
- Hinge.
- Horizontal push.
- Vertical push.
- Pull.
- Unilateral lower body.
- Core.
- Conditioning.

BellGrinda should track exposure frequency.

---

# 22. Weekly Exposure Example

Example:

Squat:
3 days.

Hinge:
2 days.

Pull:
3 days.

Push:
4 days.

Unilateral lower body:
2 days.

Core:
2 days.

Conditioning:
3 days including football.

This may be valid depending on goals.

---

# 23. Weekly Movement Deficit

If a major movement pattern is unintentionally missing:

BellGrinda should prioritize it in a suitable upcoming session.

Example:

No pull movement recorded Monday–Wednesday.

Thursday or Friday may receive additional pull exposure.

Safety and fatigue still override this correction.

---

# 24. Weekly Movement Excess

BellGrinda should detect excessive repetition.

Example:

Push work appears in every workout with high volume.

If pressing fatigue rises:

- reduce push volume;
- use easier variation;
- replace a push slot with core/pull.

This is especially relevant given chest-development goals.

---

# 25. Push Volume Management

BellGrinda must track total weekly pressing volume.

Inputs may include:

- push-up reps;
- floor press;
- overhead press;
- clean and press;
- explosive push-up work.

A push-up rep and a kettlebell press are not identical, so volume should not be reduced to a naive rep total alone.

---

# 26. Exercise Ordering Principles

Normal order should prioritize:

1. High-skill movements.
2. High-priority strength movements.
3. Secondary strength movements.
4. Higher-fatigue conditioning.
5. Core/accessory work.

However, circuit structure may alternate movement patterns to manage fatigue.

---

# 27. Circuit Ordering

BellGrinda should avoid placing two heavily competing exercises back-to-back when possible.

Example:

Better:

Goblet squat  
→ Row  
→ Push-up  
→ Deadlift  
→ Skipping.

Less desirable:

Goblet squat  
→ Reverse lunge  
→ Deadlift  
→ Swing  
→ Skipping.

---

# 28. Upper/Lower Alternation

Where possible, circuits may alternate:

Lower  
→ Upper Pull  
→ Upper Push  
→ Lower/Hinge  
→ Conditioning/Core

This improves workout flow and helps preserve movement quality.

---

# 29. Technical Exercise Placement

High-skill exercises such as:

- snatch;
- clean;
- clean and press;
- advanced complex

should generally appear earlier than maximal-fatigue conditioning movements.

Do not place a highly technical exercise after the user is already severely fatigued unless the exercise is specifically part of an approved complex.

---

# 30. Complex Placement

Complexes should normally appear:

- as Slot 5;
- or as the main Thursday focus.

They should not be combined with multiple other extremely high-fatigue stations.

Example:

Heavy complex + high-volume swings + maximal skipping

may exceed acceptable fatigue.

---

# 31. Load Assignment

After exercise selection, BellGrinda assigns load using:

- current approved working load;
- progression state;
- readiness;
- pain status;
- Training Level;
- exercise complexity.

Load is selected separately for every exercise.

---

# 32. Load Priority

The engine should prefer:

**approved working load**

unless progression state specifically says:

- Trial heavier load.
- Regress load.
- Recovery load.

---

# 33. New Load Trial

When a progression state is:

**Progress Load**

Workout generation should:

- assign new load;
- reduce reps appropriately;
- avoid simultaneous density increase;
- mark load as Trial.

---

# 34. Rep Assignment

Rep assignment is determined from:

- Training Level.
- exercise.
- current load.
- phase.
- progression state.
- readiness.

Each exercise should define:

- minimum reps;
- standard range;
- maximum reps.

---

# 35. Rep Progression Application

If state is:

**Progress Reps**

increase by:

approximately 1–2 reps

within approved range.

Do not exceed maximum.

---

# 36. Hold Application

If state is:

**Hold**

prescription should remain close to previous productive exposure.

No artificial changes are required.

---

# 37. Regression Application

If state is:

**Regress**

the engine may:

- reduce reps;
- reduce load;
- use easier variation;
- extend rest.

The chosen regression should correspond to the triggering problem.

---

# 38. Variation Assignment

If progression state requests:

**Progress Variation**

BellGrinda selects the next approved variation.

Example:

Standard push-up

→ Tempo push-up.

The new variation should usually start near the lower half of its rep range.

---

# 39. Variation Regression

If variation becomes inappropriate:

Example:

Decline push-up causing repeated poor performance.

BellGrinda may return to:

Pause push-up

or

Standard tempo push-up.

---

# 40. Readiness Modification

After the base workout is generated, readiness modifiers are applied.

## Green

No reduction.

## Yellow

Modify 1–2 variables.

## Red

Replace with recovery prescription where necessary.

---

# 41. Yellow Modification Priority

When reducing workload, consider:

1. density;
2. accessory reps;
3. rounds;
4. variation;
5. load.

This may vary according to why the day is Yellow.

---

# 42. Poor Sleep Yellow Example

If Yellow is caused mainly by poor sleep:

- maintain familiar loads;
- reduce reps slightly;
- increase rest;
- avoid new load trials.

---

# 43. Soreness Yellow Example

If legs are moderately sore:

- maintain upper-body work;
- reduce squat/lunge volume;
- select easier lower-body movement.

The entire workout does not need to be reduced equally.

---

# 44. Red Generation

A Red Day should bypass normal generation.

Instead, the engine uses:

**Recovery Template**

or

**Rest Recommendation**

depending on safety state.

---

# 45. Football-Aware Generation

Football context shall be applied before final workout approval.

BellGrinda must recognize:

- no football;
- football scheduled;
- high-intensity match;
- competition;
- tournament;
- recently completed football.

---

# 46. Normal Football Friday

If football is scheduled:

avoid:

- high-volume lower body;
- heavy swings;
- hard skipping;
- demanding complexes.

Prefer:

- row;
- light push-up;
- low-volume squat;
- glute bridge;
- core.

---

# 47. Competition Friday

Generate:

**Activation Session**

approximately:

1–2 rounds.

The purpose is preparation, not conditioning.

---

# 48. Thursday Before Competition

Thursday generation should reduce:

- ballistic load;
- leg fatigue;
- complex density.

The app should not wait until Friday to account for competition.

---

# 49. Post-Football Generation

The following workout should consider:

- soreness;
- match intensity;
- duration;
- pain events.

High football load may turn the next planned workout Yellow.

---

# 50. Jogging-Aware Generation

A normal jog usually does not require modification.

High-intensity or long running may reduce:

- lower-body conditioning;
- skipping;
- ballistic volume.

Use readiness signals to determine whether actual adjustment is necessary.

---

# 51. Fatigue Cost Assignment

Every selected exercise has:

- Low.
- Moderate.
- High

fatigue cost.

The workout can therefore estimate total fatigue burden.

---

# 52. Example Fatigue Costs

Low:

- Dead bug.
- Glute bridge.
- Easy mobility.

Moderate:

- Row.
- Goblet squat.
- Press.
- Lunge.

High:

- Heavy swing.
- Snatch.
- Heavy complex.
- Hard skipping circuit.

---

# 53. Session Fatigue Limit

The engine should define acceptable fatigue ranges based on day.

Example:

Monday:
Moderate–High.

Tuesday:
Moderate–High.

Wednesday:
Moderate.

Thursday:
High.

Friday without football:
Moderate.

Friday with football:
Low.

---

# 54. Fatigue Rebalancing

If generated session exceeds fatigue limit:

BellGrinda should replace or reduce the least important high-fatigue element.

Example:

Thursday contains:

- Clean and press.
- Swing.
- Decline push-up.
- Loaded lunge.
- Heavy complex.

If fatigue exceeds budget:

reduce swing volume

or simplify complex.

---

# 55. Weekly Fatigue Check

Workout generation should also inspect previous sessions.

If:

Monday High  
Tuesday High

then Wednesday should generally not also become High unless deliberately programmed and readiness remains strong.

---

# 56. Session Duration Model

BellGrinda shall estimate duration before finalizing the workout.

Components:

- warm-up;
- exercise execution;
- transitions;
- between-exercise rest;
- between-round rest;
- cooldown.

Target:

approximately **40 minutes**

---

# 57. Exercise Time Estimation

Each exercise may store estimated seconds per rep or estimated set duration.

Example:

Goblet squat:
approximately 2–3 seconds per rep.

Row:
approximately 2–3 seconds per rep per side.

Skipping:
estimated based on reps.

This enables rough workout-duration calculation.

---

# 58. Circuit Duration Estimate

Conceptually:

```text id="cm98z2"
estimatedWorkoutTime =
    warmupTime
  + totalExerciseTime
  + exerciseTransitionTime
  + roundRestTime
  + cooldownTime
```

The estimate need not be perfectly accurate.

It should prevent obvious 60-minute prescriptions from being generated as “40-minute workouts.”

---

# 59. Duration Overrun Rule

If estimate exceeds approximately:

**45 minutes**

reduce where appropriate:

1. complex reps;
2. accessory reps;
3. transition allowance;
4. rounds.

Do not reduce key priority work first unless necessary.

---

# 60. Duration Underrun Rule

If estimated session is significantly below:

**35 minutes**

BellGrinda does not automatically need to add work.

However, it may:

- use upper rep range;
- slightly increase conditioning;
- preserve fuller rest if appropriate.

The goal is not to artificially fill exactly 40 minutes.

---

# 61. Warm-Up Generation

Warm-up should correspond to the planned workout.

Core warm-up elements:

- bodyweight squat;
- hinge drill;
- shoulder preparation;
- glute activation;
- easy push-up or scapular work.

Then add exercise-specific preparation.

---

# 62. Strength-Day Warm-Up

May emphasize:

- squat;
- hinge;
- shoulder prep;
- light loaded movement.

---

# 63. Ballistic-Day Warm-Up

Should include:

- hinge drill;
- glute bridge;
- light deadlift;
- light clean;
- shoulder preparation.

Ballistic movements should not begin completely cold.

---

# 64. Upper-Body Warm-Up

May include:

- arm circles;
- scapular push-up;
- easy push-up;
- light row;
- light press.

---

# 65. Football-Day Warm-Up

Activation session and football warm-up should not redundantly exhaust the user.

BellGrinda's activation should remain brief and low fatigue.

---

# 66. Cooldown Generation

Cooldown should remain simple.

Possible elements:

- slow walking.
- gentle breathing.
- hip-flexor stretch.
- hamstring stretch.
- chest stretch.
- shoulder stretch.

No excessive cooldown complexity is needed.

---

# 67. Exercise Substitution Hierarchy

If an exercise cannot be used:

Choose substitute based on:

1. Same movement pattern.
2. Similar training effect.
3. Lower/equal technical demand.
4. Available equipment.
5. Safe under current restriction.

---

# 68. Example Substitution

Swing restricted.

Preferred substitute:

Kettlebell deadlift.

If deadlift unsuitable:

Glute bridge.

The substitution should preserve hinge intent where possible.

---

# 69. Push Substitution

If decline push-up is inappropriate:

possible chain:

Decline push-up

→ Pause push-up

→ Tempo push-up

→ Standard push-up

→ Incline push-up where necessary.

---

# 70. Press Substitution

If overhead press is restricted:

possible alternatives may include:

- floor press;
- push-up variation

where the restriction permits horizontal pressing.

BellGrinda must not assume all pressing is safe merely because one press variation is restricted.

---

# 71. Substitution Reason Tracking

Every substitution should store:

- original exercise;
- replacement;
- reason;
- safety state;
- user-selected or engine-selected.

Repeated substitutions may influence future program generation.

---

# 72. User-Initiated Substitution

The user may tap:

**Substitute**

BellGrinda displays:

approved alternatives only.

The user should not need to browse the entire exercise library mid-workout.

---

# 73. Advanced Priority Integration

At Advanced, generation should modify slot priority based on block focus.

Example:

Primary Priority:
Push Strength.

Monday:

Push may move from Slot 3 to Slot 2.

Wednesday:

Additional pressing emphasis.

Thursday:

Complex may include press.

However weekly fatigue rules still apply.

---

# 74. Conditioning Priority Example

Primary Priority:
Conditioning.

Possible changes:

- more skipping;
- greater circuit density;
- more appropriate ballistic work;
- conditioning-focused Thursday.

Strength work remains at maintenance dosage.

---

# 75. Recovery Priority Example

Primary Priority:
Recovery Quality.

The generated block may use:

- moderate loads;
- longer rest;
- fewer high-fatigue exercises;
- reduced complexes.

A recovery block should still feel like training.

---

# 76. Grandmaster Generation

Grandmaster uses the same constraint engine but with broader options.

Possible additions:

- higher-load kettlebells;
- advanced push-up variants;
- more advanced complexes;
- challenge sessions.

The engine should remain understandable and deterministic.

---

# 77. Challenge Workout Generation

Grandmaster challenges shall not be randomly generated.

They should use approved challenge templates.

Each challenge defines:

- exercises;
- reps;
- rounds;
- allowed loads;
- scoring method.

---

# 78. Exercise Variety Limit

BellGrinda should avoid excessive novelty.

Recommended:

Most sessions should contain:

**3–4 familiar exercises**

and at most:

**1–2 meaningfully new/rotating elements**

unless entering a new phase deliberately.

---

# 79. New Exercise Introduction

When introducing a new exercise:

- use conservative reps;
- use appropriate load;
- avoid simultaneous high density;
- mark as Learning.

The Progression Engine should gather initial data before progression.

---

# 80. Exercise Learning State

Possible skill status:

- Learning.
- Established.
- Progressing.
- Mastered.

New exercises begin at:

**Learning**

Learning movements receive more conservative prescriptions.

---

# 81. First Exposure Rule

On first exposure:

BellGrinda should avoid:

- high rep maximum;
- heavy load trial;
- minimal rest;
- competition-style testing.

The purpose is data collection and technique familiarity.

---

# 82. Exercise Repetition Across Week

BellGrinda may repeat important core exercises multiple times.

Example:

Push-ups Monday, Wednesday, Thursday.

This is acceptable if:

- variation/intensity differs;
- recovery remains adequate;
- total pressing volume is monitored.

---

# 83. Exercise History Influence

When choosing between two equivalent exercises:

prefer the one that:

- supports current progression;
- has sufficient recent data;
- aligns with current priority.

Do not rotate away from measurable progress unnecessarily.

---

# 84. Variety vs Measurement

BellGrinda should favor:

**enough consistency to measure progress**

plus

**enough variety to prevent monotony and improve broader capacity**

not either extreme.

---

# 85. Exercise Preference

Future BellGrinda may allow:

- Like.
- Neutral.
- Dislike.

Preference may influence equivalent exercise selection.

Preference shall never override safety.

---

# 86. Required Workout Validation

Before a workout becomes active, validate:

- no Restricted exercise selected;
- all required equipment available;
- all loads approved;
- session duration acceptable;
- fatigue budget acceptable;
- football rules satisfied;
- movement balance acceptable;
- no progression conflict;
- rest values valid.

---

# 87. Generation Failure

If no valid exercise can fill a required slot:

BellGrinda should not invent an unsupported movement.

Instead:

- use approved fallback;
- remove the slot;
- reduce session structure;
- notify the user if necessary.

Safety beats structural perfection.

---

# 88. Workout Generation Reason Codes

Examples:

- DAILY_TEMPLATE_STRENGTH.
- PRIORITY_PUSH_STRENGTH.
- LOAD_PROGRESS_APPLIED.
- READINESS_YELLOW.
- FOOTBALL_ADJUSTMENT.
- EXERCISE_RESTRICTED.
- SUBSTITUTE_HINGE.
- FATIGUE_BUDGET_REDUCED.
- SESSION_DURATION_REDUCED.
- COMPLEX_PHASE_PROGRESS.
- MOVEMENT_BALANCE_CORRECTION.

---

# 89. Example Generated Monday

**Training Level:** Intermediate  
**Phase:** Integration  
**Readiness:** Green  
**Football:** None

Warm-up:
5 minutes.

Main workout:

1. Goblet Squat  
   16 kg  
   12 reps

2. One-Arm Row  
   16 kg  
   10/side

3. Decline Push-Up  
   10 reps

4. Reverse Lunge  
   12 kg  
   8/leg

5. Suitcase March  
   20 kg  
   30 steps/side

Rounds: 5.

Round Rest:
45 seconds.

Cooldown:
4 minutes.

Estimated Duration:
39 minutes.

---

# 90. Example Yellow Wednesday

Planned:
Upper-body strength.

Readiness:
Yellow due to poor sleep + moderate shoulder soreness.

Generated:

1. One-arm row — normal.
2. Floor press — lighter load.
3. Standard push-up instead of decline.
4. Goblet squat — normal.
5. Dead bug.

Rounds:
4 instead of 5.

Rest:
60 seconds.

No overhead press.

---

# 91. Example Football Friday

Football:
Normal five-a-side.

Generated:

1. Goblet squat — 8.
2. Row — 8/side.
3. Push-up — 10.
4. Glute bridge — 10.
5. Dead bug — 6/side.

Rounds: 3.

Target RPE:
3–5.

No skipping.

No swings.

---

# 92. Example Restricted Swing

Thursday template requests hinge/ballistic.

Swing state:
Restricted.

Candidate selection:

Swing rejected.

Next approved candidate:

Deadlift.

Workout uses deadlift instead.

Reason:

**EXERCISE_RESTRICTED + SUBSTITUTE_HINGE**

---

# 93. Offline Generation

The basic Workout Generation Engine should work offline.

Required offline data:

- exercise library metadata;
- current program;
- progression states;
- equipment;
- safety states;
- readiness rules;
- generation rules.

AI access must not be required.

---

# 94. Pre-Generation vs On-Demand

BellGrinda may pre-generate upcoming workouts.

However, final workout should be revalidated on the training day after readiness input.

Example:

Workout generated Sunday.

Wednesday user reports shoulder pain.

Wednesday workout must be modified before starting.

---

# 95. Workout Snapshot

Once a session starts, BellGrinda should create a workout snapshot.

This prevents unexpected mid-session regeneration.

Snapshot contains:

- exercises;
- loads;
- reps;
- rounds;
- rest;
- substitutions available.

Safety events may still modify the active session.

---

# 96. Mid-Workout Adjustment

BellGrinda may modify an active workout if:

- pain occurs;
- exercise becomes unsafe;
- user substitutes;
- user reports severe fatigue.

Normal progression changes should wait until after the session.

---

# 97. Generation Auditability

Each generated workout should retain:

- input state;
- template used;
- exercise candidates;
- selected exercises;
- modifications;
- reason codes;
- engine version.

This will be important for debugging.

---

# 98. Generator Versioning

Store:

**workoutGeneratorVersion**

Example:

1.0.

Future generation-rule changes must remain traceable.

---

# 99. Deterministic Generation

Given identical:

- Training Level;
- phase;
- priorities;
- equipment;
- readiness;
- restrictions;
- progression states;
- recent history

BellGrinda should generally produce the same workout.

Controlled variation may be introduced through explicit rotation rules rather than random AI generation.

---

# 100. AI Boundary

AI may:

- explain today's workout;
- explain why exercises were selected;
- explain substitutions;
- describe the training focus.

AI may not:

- insert arbitrary exercises;
- bypass restrictions;
- change loads independently;
- create unsupported complexes.

---

# 101. Example AI Explanation

“Today emphasizes upper-body strength because Wednesday is your chest-focused day. Your overhead press was replaced with floor press because your shoulder is currently monitored. Your goblet squat remains at 16 kg because your lower-body progression is stable.”

The workout itself comes from deterministic rules.

---

# 102. Workout Generation Flow

```text id="bgwg1"
Load Training State
        ↓
Load Daily Template
        ↓
Apply Current Priority
        ↓
Load Equipment
        ↓
Apply Exercise Restrictions
        ↓
Generate Candidate Movements
        ↓
Select Core + Rotating Exercises
        ↓
Apply Progression States
        ↓
Assign Load / Reps / Variation
        ↓
Apply Readiness
        ↓
Apply Football Context
        ↓
Check Fatigue Budget
        ↓
Check Weekly Movement Balance
        ↓
Estimate Duration
        ↓
Adjust if Required
        ↓
Validate Workout
        ↓
Save Workout Snapshot
```

---

# 103. Exercise Selection Flow

```text id="bgwg2"
Movement Slot
     ↓
Find Eligible Exercises
     ↓
Remove Restricted
     ↓
Remove Unavailable Equipment
     ↓
Filter by Training Level
     ↓
Match Training Priority
     ↓
Check Recent Exposure
     ↓
Check Fatigue Cost
     ↓
Select Best Candidate
     ↓
Assign Approved Load
     ↓
Assign Reps / Variation
```

---

# 104. Generator Success Criteria

The Workout Generation Engine succeeds if:

- workouts remain recognizable;
- progression remains measurable;
- exercise variety is controlled;
- restricted exercises never appear;
- loads remain exercise-specific;
- football changes sessions appropriately;
- readiness changes sessions appropriately;
- weekly movement balance remains sensible;
- fatigue is distributed;
- sessions remain near 40 minutes;
- substitutions preserve training intent;
- generated decisions are explainable.

---

# 105. Generator Failure Conditions

The engine is poorly configured if it:

- randomly changes exercises;
- ignores progression history;
- selects Restricted movements;
- generates unrealistic session length;
- stacks excessive lower-body fatigue before football;
- overuses one movement category;
- changes every variable at once;
- requires AI to generate basic workouts;
- assigns one kettlebell weight globally;
- creates variety at the expense of measurable progression.

---

# 106. BellGrinda Workout Generation Principle

BellGrinda should generate:

**The most appropriate workout for today's training objective and current user state**

not:

**The hardest possible workout**

and not:

**A random set of five exercises**

---

# 107. Next Specification

With workout generation defined, the next planning item should be:

# BellGrinda Workout Session & Logging Specification

That specification should define exactly what happens from:

**Tap “Start Workout”**

through:

**Finish Workout**

It should cover:

- active session lifecycle;
- set/exercise completion;
- round tracking;
- reps completed;
- load changes;
- timers;
- pause/resume;
- phone locking;
- app refresh;
- IndexedDB persistence;
- skipped exercises;
- substitutions;
- pain reporting;
- rest tracking;
- session abandonment;
- workout completion;
- RPE collection;
- notes;
- automatic PR detection;
- sync queue;
- recovery after crashes;
- duplicate-session prevention.

That is the next important layer because the generation engine can now create a workout, but BellGrinda still needs a precise specification for reliably executing and recording that workout.
