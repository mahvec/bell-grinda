# BellGrinda Progression Engine Specification

**Version:** 0.1  
**Purpose:** Define the deterministic rules BellGrinda uses to progress, maintain, regress, substitute, recover, and adapt training.  
**Applies To:** Novice → Grandmaster  
**Engine Type:** Rule-based, stateful, exercise-specific, safety-first  
**AI Role:** Explanation only; AI does not directly control progression.

---

# 1. Progression Engine Purpose

The BellGrinda Progression Engine determines what should happen after every relevant training event.

The engine must answer questions such as:

- Should reps increase?
- Should load increase?
- Should reps decrease after a load increase?
- Should an exercise variation change?
- Should rest decrease?
- Should rounds change?
- Should the current prescription remain unchanged?
- Should the exercise regress?
- Should an exercise be substituted?
- Should a deload occur?
- Should the day become Yellow or Red?
- Should football reduce training load?
- Has the user plateaued?
- What should the next Advanced block prioritize?
- Is a new kettlebell appropriate for a particular exercise?

The engine must make these decisions using explicit rules.

AI may explain the outcome but shall not create arbitrary progression decisions.

---

# 2. Core Engine Principle

BellGrinda shall follow:

**Observe → Evaluate → Decide → Prescribe → Record → Re-evaluate**

The system shall not progress exercises merely because time has passed.

Time controls Training Level progression.

Performance controls exercise progression.

---

# 3. Progression Inputs

The engine may use:

## User State

- Training Level.
- Training Phase.
- Performance Grade.
- Category scores.
- Current readiness.
- Available equipment.
- Football status.
- Jogging load.

## Exercise State

- Current exercise.
- Current variation.
- Current load.
- Approved working loads.
- Prescribed rep range.
- Completed reps.
- Recent RPE.
- Pain flags.
- Recent substitutions.
- Progression history.
- Regression history.

## Session State

- Completed rounds.
- Workout RPE.
- Session duration.
- Rest usage.
- Completion percentage.
- Readiness classification.
- Pain events.

## Historical State

- Last 2–4 relevant exercise exposures.
- Current block data.
- Recent biweekly assessment.
- Performance-test results.
- Plateau status.
- Recent Personal Records.

---

# 4. Decision Priority Order

When multiple rules apply, BellGrinda shall use this order:

1. Safety.
2. Pain/discomfort.
3. Recovery/readiness.
4. Technique/movement quality.
5. Session completion.
6. RPE.
7. Repetition progression.
8. Load progression.
9. Variation progression.
10. Density progression.
11. Complex progression.

Lower-priority progression rules cannot override higher-priority safety rules.

---

# 5. Progression States

Every exercise shall maintain one current progression state:

- Regress.
- Recover.
- Hold.
- Progress Reps.
- Progress Load.
- Progress Variation.
- Progress Density.
- Progress Complexity.

Only one major progression state should normally be applied to an exercise for its next exposure.

---

# 6. Hold as a Valid Outcome

BellGrinda must not treat every workout as requiring progression.

**Hold** is a successful progression decision.

Use Hold when:

- current prescription remains appropriately challenging;
- RPE is productive;
- technique is stable;
- no plateau exists;
- more data is required.

This prevents unnecessary constant escalation.

---

# 7. Exercise Performance Window

Progression should generally be based on:

**2–3 relevant exposures**

for Novice through Intermediate.

Advanced may use:

**3–4 exposures**

for more stable plateau/progression analysis.

A single unusually good workout should not automatically cause progression.

---

# 8. Successful Exposure

An exercise exposure counts as successful when most or all of the following are true:

- prescribed work completed;
- movement quality acceptable;
- no meaningful pain;
- RPE inside expected range;
- no major technical breakdown;
- no excessive assistance/substitution.

Successful does not require the workout to feel easy.

---

# 9. Rep Progression Rule

BellGrinda may increase reps when:

1. Current load remains approved.
2. All prescribed reps are completed.
3. Relevant RPE is within progression range.
4. No pain flag exists.
5. Performance is stable across at least 2 relevant exposures.

Recommended progression range:

RPE approximately:

**4–6 Novice**

**5–7 Advanced Novice**

**6–7 Intermediate/Advanced**

The engine may add:

**1–2 reps**

within the approved exercise range.

---

# 10. Rep Ceiling Rule

Every exercise/load pairing should define:

- minimum reps;
- target reps;
- maximum reps.

Example:

16 kg goblet squat:

**8–15**

Once the user repeatedly performs the upper end with controlled RPE:

BellGrinda should consider load progression rather than indefinite rep increases.

---

# 11. Rep Failure Rule

If prescribed reps are not completed:

BellGrinda should first classify why.

Possible causes:

- normal fatigue;
- load too heavy;
- poor recovery;
- pain;
- technique limitation;
- excessive accumulated volume.

One failed session:

**Usually Hold**

Repeated failed sessions:

**Regress or Modify**

Do not automatically reduce after one bad workout.

---

# 12. Load Progression Eligibility

An exercise becomes eligible for heavier load when:

- current rep ceiling is reached or nearly reached;
- RPE remains controlled;
- movement quality is stable;
- no relevant pain exists;
- heavier equipment exists;
- exercise is approved for that load.

Example:

Goblet squat:

16 kg × 15 repeatedly at RPE 6

may trigger:

**Load Progression Eligible**

---

# 13. Exercise-Specific Load Progression

Load progression must be exercise-specific.

BellGrinda may approve:

- 20 kg deadlift.
- 20 kg goblet squat.
- 16 kg row.
- 12 kg press.

at the same time.

Equipment ownership shall never equal automatic exercise approval.

---

# 14. Approved Working Load

For each exercise BellGrinda should store:

- Minimum available load.
- Current working load.
- Highest successfully used load.
- Approved heavier load.
- Restricted load if applicable.

Example:

```text
Overhead Press
Current: 12 kg
Highest Successful: 12 kg
16 kg Status: Testing
20 kg Status: Not Approved
```

---

# 15. Load Transition Rep Reduction

When load increases:

BellGrinda must usually reduce reps.

Recommended initial reduction:

**15–35%**

depending on:

- size of load jump;
- exercise complexity;
- unilateral vs bilateral movement;
- previous RPE.

Example:

16 kg squat × 15

→

20 kg squat × 9–10.

---

# 16. Large Load Jump Rule

A 12 kg → 16 kg transition is approximately a 33% load increase.

Therefore exercises such as:

- overhead press;
- clean;
- clean and press;
- snatch

must use conservative rep reductions.

Example:

12 kg press × 8

→

16 kg press × 4–5

where appropriate.

---

# 17. Load Trial State

A new load may enter:

**Trial**

rather than becoming permanently approved immediately.

Trial exposure requirements:

- conservative reps;
- normal or extended rest;
- no simultaneous variation increase;
- no simultaneous density progression.

After successful trial exposures:

status may become:

**Approved**

---

# 18. Failed Load Trial

If a heavier load causes:

- repeated rep failure;
- RPE 9–10;
- technical breakdown;
- pain;

BellGrinda returns the exercise to its previous approved load.

The heavier load becomes:

**Deferred**

rather than permanently failed.

---

# 19. Double Progression

BellGrinda shall use double progression where appropriate.

Example:

16 kg goblet squat range:

10–15.

Progress:

10  
→ 11  
→ 12  
→ 13  
→ 14  
→ 15

Then:

20 kg × 8–10.

This becomes a primary deterministic progression method.

---

# 20. Variation Progression Eligibility

BellGrinda may increase movement difficulty when:

- current variation is mastered;
- additional reps would add little value;
- load progression is unavailable or inappropriate;
- no pain exists;
- harder variation is approved.

Examples:

Standard push-up

→ Tempo push-up.

Tempo push-up

→ Pause push-up.

Pause push-up

→ Decline push-up.

---

# 21. Variation Progression Rule

Only change variation when:

- current variation has at least 2 successful exposures;
- RPE remains controlled;
- completion is consistent.

After changing variation:

BellGrinda should usually reduce reps.

---

# 22. Push-Up Progression Engine

Push-up decisions should use:

- current variation;
- completed reps;
- RPE;
- pressing volume;
- wrist status;
- elbow status;
- shoulder status.

Example progression path:

Standard

→ Tempo

→ Pause

→ Decline

→ Decline tempo/pause

→ approved advanced variation.

The engine should not simply increase:

20 → 25 → 30 → 40.

---

# 23. Push-Up Progression Example

Current:

Standard push-up × 20.

History:

20 / 20 / 20 across relevant sessions.

Average RPE:

5.

No pain.

Decision:

**Progress Variation**

Next:

Tempo push-up × 12–15.

---

# 24. Push-Up Hold Example

Current:

Decline push-up × 10.

Recent performance:

10 / 9 / 8.

RPE:

8.

Decision:

**Hold**

Do not progress variation.

---

# 25. Push-Up Regression

If harder variation produces:

- repeated poor form;
- repeated failure;
- shoulder/wrist/elbow pain;

BellGrinda may:

- reduce reps;
- return to easier variation;
- change pressing exercise.

Regression shall not be presented as failure.

---

# 26. Rest Progression

BellGrinda may reduce rest when:

- reps and load are stable;
- RPE remains controlled;
- form remains stable;
- workout finishes comfortably inside session target.

Recommended reduction:

**5–15 seconds**

at a time.

Avoid large rest cuts.

---

# 27. Rest Floor

Each exercise or circuit structure should have a minimum allowed rest.

BellGrinda should never reduce rest below a threshold that repeatedly causes:

- technical breakdown;
- RPE spikes;
- incomplete work.

---

# 28. Density Progression

Density progression means performing similar useful work in less time.

BellGrinda may increase density through:

- slightly shorter rest;
- smoother transitions;
- fewer unnecessary pauses.

Density shall not increase simultaneously with major load increases unless the user is highly stable and the progression rule explicitly permits it.

---

# 29. Round Progression

Default BellGrinda structure remains 5 rounds.

Round count shall not normally increase above 5 simply to create progression.

Round changes are primarily used for:

- recovery;
- football adjustment;
- readiness adjustment;
- special challenges.

---

# 30. Round Reduction

Possible reductions:

5 → 4

or

5 → 3

when:

- Yellow readiness;
- football scheduled;
- fatigue high;
- returning after break;
- deload active.

---

# 31. Complex Progression

Complex progression may use:

- additional reps;
- heavier load;
- additional movement;
- shorter rest.

Only one major complex variable should normally change.

Priority:

1. Technique.
2. Stable reps.
3. Load.
4. Complexity.
5. Density.

---

# 32. Complex Regression

If quality deteriorates:

1. Reduce complex reps.
2. Increase rest.
3. Reduce load.
4. Remove a movement.

BellGrinda should not preserve complexity merely for status.

---

# 33. Readiness Engine

Before training, BellGrinda may collect:

- energy;
- soreness;
- sleep quality;
- pain;
- previous workout RPE;
- football status.

It outputs:

- Green.
- Yellow.
- Red.

---

# 34. Green Day

Typical conditions:

- energy acceptable;
- soreness mild/normal;
- no meaningful pain;
- recent RPE stable;
- no major football conflict.

Action:

**Normal prescription**

Progression rules may operate normally.

---

# 35. Yellow Day

Possible triggers:

- poor sleep;
- moderate soreness;
- unusually low energy;
- recent high RPE;
- upcoming football;
- accumulated workload.

Action:

Modify approximately 1–2 variables.

Options:

- reduce reps 10–20%;
- increase rest;
- reduce rounds by one;
- remove advanced variation;
- reduce load if necessary.

---

# 36. Red Day

Possible triggers:

- moderate pain;
- severe fatigue;
- very poor recovery;
- competition requirement;
- repeated Red/Yellow trend.

Action:

- recovery session;
- substitute exercises;
- remove ballistic work;
- significantly reduce rounds/intensity.

A correctly completed Red Day still counts as completed training.

---

# 37. Readiness Cannot Upgrade Workload

Readiness may:

- maintain;
- reduce;
- recover.

It shall not create an unplanned harder workout simply because the user reports feeling unusually good.

Progression still requires historical evidence.

---

# 38. Pain Override

Pain rules override:

- rep progression;
- load progression;
- variation progression;
- density progression;
- complex progression.

Pain data must be processed before ordinary progression logic.

---

# 39. Mild Pain

Single isolated mild discomfort:

- record;
- monitor;
- usually Hold.

Do not progress the affected movement in that same session.

---

# 40. Repeated Mild Pain

Repeated mild discomfort associated with the same exercise:

- flag movement;
- stop progression;
- consider regression/substitution;
- require reassessment before load increase.

---

# 41. Moderate Pain

Moderate pain:

- stop affected exercise;
- substitute if approved;
- mark movement Restricted.

No progression decisions are allowed until status improves.

---

# 42. Severe Pain

Severe pain:

- stop movement;
- remove exercise from active prescription;
- advise appropriate professional evaluation.

BellGrinda shall not attempt diagnosis.

---

# 43. Swing-Specific Safety Logic

If lower-back discomfort is associated with swings:

BellGrinda shall:

- freeze swing load progression;
- freeze swing volume progression;
- prohibit high-volume swing challenges;
- offer approved hinge substitutes.

Swing status may be:

- Active.
- Monitored.
- Restricted.
- Reintroduced.

---

# 44. Exercise Restriction State

Every exercise may have:

- Active.
- Monitored.
- Restricted.
- Reintroduction.

Restricted exercises should not appear in automatically generated workouts.

---

# 45. Reintroduction Logic

After restriction:

BellGrinda may reintroduce an exercise using:

- easier variation;
- lighter load;
- fewer reps;
- longer rest.

Reintroduction must not resume immediately at previous peak workload.

---

# 46. RPE Rules

RPE influences progression decisions.

General interpretation:

1–3:
Potentially underloaded.

4–6:
Productive/moderate.

7:
Challenging but appropriate.

8:
Hard; Hold usually preferred.

9:
Near limit.

10:
Excessive for standard programming.

---

# 47. RPE Progression Rule

Progression eligibility usually requires:

**average relevant RPE ≤7**

For more technical/heavy movements:

BellGrinda may use stricter thresholds.

Repeated RPE ≥8:

generally blocks progression.

---

# 48. RPE Spike Rule

One RPE 9 session:

Usually Hold.

Two or more high-RPE relevant exposures:

Consider:

- regression;
- readiness adjustment;
- recovery intervention.

---

# 49. Session RPE vs Exercise RPE

BellGrinda should distinguish:

- Exercise RPE.
- Session RPE.

If exercise-specific RPE is unavailable, session RPE may act as a weaker signal.

---

# 50. Plateau Detection

Possible plateau when:

- load unchanged;
- reps unchanged;
- variation unchanged;
- RPE unchanged or worsening;
- no meaningful improvement;
- across 3–4 relevant exposures.

Plateau detection should require reasonable consistency.

---

# 51. Plateau Exclusion

Do not classify plateau when:

- sessions were frequently missed;
- pain caused modifications;
- football load significantly increased;
- new equipment was recently introduced;
- user deliberately maintained performance.

---

# 52. Plateau Types

BellGrinda may classify:

- Load Plateau.
- Rep Plateau.
- Technique Plateau.
- Recovery Plateau.
- Equipment Plateau.
- Consistency Plateau.

Each should trigger different responses.

---

# 53. Load Plateau Response

Possible responses:

- rep-range change;
- variation progression;
- heavier load trial;
- unilateral variation.

---

# 54. Rep Plateau Response

Possible responses:

- load change;
- rep-range reset;
- variation change;
- recovery review.

---

# 55. Technique Plateau Response

Possible responses:

- lower load;
- simpler variation;
- technique-focused session;
- longer rest.

---

# 56. Recovery Plateau Response

Possible responses:

- deload;
- longer rest;
- lower volume;
- reduce conditioning;
- adjust football-related workload.

---

# 57. Equipment Plateau Response

If available load is limiting progress:

Options:

- tempo;
- pause;
- unilateral movement;
- harder variation;
- density;
- complexes.

BellGrinda may recommend—but must not require—new equipment.

---

# 58. Consistency Plateau Response

If poor exposure frequency is the problem:

BellGrinda should not increase intensity.

Priority:

**restore consistency**

before judging physical stagnation.

---

# 59. Deload Trigger

A deload may trigger when several signals occur together:

- elevated RPE trend;
- performance decline;
- repeated Yellow Days;
- repeated soreness;
- falling consistency;
- high external sport workload.

BellGrinda should avoid triggering deload from one bad day.

---

# 60. Deload Structure

Typical adjustments:

- reps −20–30%;
- rounds −1 or −2;
- longer rest;
- easier variations;
- no advanced complexes;
- lower ballistic volume.

Default deload length:

**approximately 1 week**

unless conditions justify otherwise.

---

# 61. Post-Deload Rule

After deload:

BellGrinda should resume from:

**previous productive workload**

not automatically from peak workload.

Progression resumes only after successful exposure.

---

# 62. Missed Workout Rule

One missed workout:

Continue schedule.

Do not combine workouts.

Two missed workouts in a week:

Hold progression.

Three or more:

Consider reduced return workload.

---

# 63. Extended Break Rule

After approximately 7+ days:

- reduce reps;
- extend rest;
- consider one-phase temporary regression.

After much longer breaks:

BellGrinda may use Reconditioning Mode.

Training Level remains unchanged.

---

# 64. Football Input

Football must be processed before daily workout generation.

States:

- None.
- Scheduled.
- Completed.
- High intensity.
- Competition.
- Tournament.

---

# 65. Football Scheduled Rule

If normal football is scheduled Friday:

BellGrinda may:

- reduce Friday rounds;
- reduce lower-body volume;
- remove hard conditioning;
- keep upper-body/light activation.

---

# 66. Competition Rule

If competitive football is scheduled:

BellGrinda may:

- reduce Thursday lower-body volume;
- reduce Thursday ballistic work;
- replace Friday training with activation.

Do not attempt to preserve full weekly training volume.

---

# 67. High Football Load Rule

High football workload may influence the following session.

Possible changes:

- Yellow readiness.
- lower-body volume reduction.
- longer rest.
- no additional hard conditioning.

---

# 68. Jogging Input

Jogging contributes to workload context.

Normal jogging should not automatically change resistance programming.

Repeated/high-intensity running may influence readiness.

---

# 69. Daily Prescription Order

Before generating a workout, BellGrinda should process:

1. Training Level.
2. Training Phase/block.
3. Current training priority.
4. Football status.
5. Readiness.
6. Pain restrictions.
7. Exercise progression state.
8. Equipment availability.
9. Workout-duration constraint.
10. Final exercise selection.

---

# 70. Workout Duration Constraint

BellGrinda targets approximately:

**40 minutes**

If generated workload exceeds expected time:

reduce in this order where appropriate:

1. unnecessary transitions;
2. complex reps;
3. accessory volume;
4. rounds.

Do not compromise technique to fit the timer.

---

# 71. Exercise Selection Constraints

A generated workout should respect:

- required movement patterns;
- current priority;
- restricted exercises;
- equipment;
- football load;
- fatigue budget.

Random exercise selection is prohibited.

---

# 72. Weekly Movement Balance

BellGrinda should generally include weekly exposure to:

- squat;
- hinge;
- push;
- pull;
- unilateral lower body;
- core/stability;
- conditioning.

Advanced priority blocks may alter frequency but should not neglect major patterns without reason.

---

# 73. Exercise Fatigue Cost

Each exercise may store a fatigue cost:

- Low.
- Moderate.
- High.

Example:

Dead bug:
Low.

Goblet squat:
Moderate.

High-volume swings:
High.

Heavy complex:
High.

---

# 74. Weekly Fatigue Budget

BellGrinda should avoid stacking excessive High-fatigue sessions.

Example prohibited pattern:

High Monday  
High Tuesday  
High Wednesday  
High Thursday  
Football Friday.

The Advanced framework already establishes the need for alternating training stress rather than stacking high-fatigue work continuously.

---

# 75. Personal Record Detection

After every session, BellGrinda should evaluate supported PRs.

Examples:

- highest load;
- highest reps at load;
- push-up max;
- best circuit time;
- best density;
- longest consistency streak.

A PR does not automatically cause immediate progression.

---

# 76. Performance Grade Integration

The engine shall use category scores to inform:

- Advanced priority selection;
- Grandmaster readiness;
- weak-area reinforcement.

Performance Grade does not directly prescribe a heavier load.

Exercise-level data remains authoritative.

---

# 77. Advanced Priority Selection

At Advanced, the engine should evaluate:

- category scores;
- category trends;
- pain restrictions;
- user goals;
- recent block priorities.

Select:

- one Primary Priority;
- one Secondary Priority;
- maintenance categories.

---

# 78. Priority Selection Rule

Recommended approach:

Choose the lowest meaningful category that:

- matters to user goals;
- is trainable;
- is not currently pain-restricted;
- has adequate data confidence.

The absolute lowest score should not automatically win.

---

# 79. Priority Rotation

BellGrinda should avoid endlessly training one weakness.

After a successful block:

Possible actions:

- maintain current category;
- switch to another category;
- address recovery;
- test Grandmaster readiness.

---

# 80. Reinforcement Block Logic

For Novice through Intermediate:

User may repeat Phase 3.

BellGrinda identifies:

- weakest one or two areas.

It then modifies the phase to emphasize those weaknesses.

Total workload should not automatically increase.

---

# 81. Grandmaster Preparation Logic

If Grandmaster status is:

**Almost Ready**

BellGrinda identifies one or two readiness gaps.

Generate:

**3–6 week Preparation Block**

Then retest readiness.

---

# 82. Grandmaster Cycle Logic

Once Grandmaster is reached:

Progression becomes:

Assess  
→ Priority  
→ Train  
→ Challenge  
→ Review  
→ Repeat.

Grandmaster has no terminal end date.

---

# 83. State Transition Example

Goblet squat:

Current:

16 kg × 12.

Exposure 1:
12 reps, RPE 6.

Exposure 2:
12 reps, RPE 6.

Exposure 3:
12 reps, RPE 5.

Decision:

**Progress Reps**

Next:

16 kg × 14.

---

# 84. Load Transition Example

Goblet squat:

16 kg × 15.

Three stable exposures.

RPE:

5–6.

20 kg available.

Decision:

**Progress Load**

Next prescription:

20 kg × 9.

Load state:

**Trial**

---

# 85. Hold Example

Overhead press:

16 kg × 5.

Recent:

5 / 5 / 4.

RPE:

7–8.

Decision:

**Hold**

No load or rep increase.

---

# 86. Regression Example

Clean and press:

16 kg × 6.

Recent:

6 / 4 / 3.

RPE:

9.

Technique degraded.

Decision:

**Regress**

Possible next:

16 kg × 4

or

12 kg × 6–8.

---

# 87. Pain Override Example

Swing:

16 kg × 15.

User reports repeated mild lower-back discomfort.

Normal progression logic would otherwise allow 18 reps.

Pain rule executes first.

Decision:

**Restricted / Substitute**

No progression.

---

# 88. Football Example

Thursday:

Heavy complex planned.

Friday:

Tournament scheduled.

Decision:

Reduce Thursday:

- lower-body reps;
- ballistic volume;
- complex density.

Friday:

Activation only.

---

# 89. Readiness Example

Planned:

5 rounds.

Morning readiness:

Poor sleep.
High soreness.
Low energy.
No pain.

Classification:

**Yellow**

Decision:

- 4 rounds;
- normal loads;
- longer rest.

---

# 90. Plateau Example

Press:

16 kg × 5.

Four relevant exposures:

5 / 5 / 5 / 5.

RPE:

8 / 8 / 8 / 8.

Decision:

Plateau classification:

**Rep Plateau**

Potential next action:

- temporary 12 kg higher-rep block;
- longer rest;
- press-focused Advanced block.

Not automatically:

20 kg.

---

# 91. Progression Event Record

Every engine decision should create a record.

Fields:

- decisionId;
- userId;
- exerciseId;
- timestamp;
- previous prescription;
- new prescription;
- decision type;
- triggering metrics;
- rule version;
- reason codes;
- pain override;
- readiness modifier;
- football modifier.

---

# 92. Reason Codes

Examples:

- REP_TARGET_MASTERED.
- LOAD_TRIAL_ELIGIBLE.
- RPE_TOO_HIGH.
- PAIN_REPEATED.
- YELLOW_READINESS.
- FOOTBALL_COMPETITION.
- PLATEAU_DETECTED.
- EQUIPMENT_LIMIT.
- DELOAD_TRIGGERED.
- VARIATION_MASTERED.

These make decisions auditable.

---

# 93. Progression Explanation

The UI should translate engine logic into human language.

Example:

**Why did BellGrinda increase your squat weight?**

“You completed 15 reps with 16 kg across three recent sessions at an average RPE of 6 and without pain. BellGrinda is therefore testing 20 kg at a reduced target of 9 reps.”

AI may polish the explanation, but the reason must come from deterministic engine data.

---

# 94. Rule Versioning

Progression logic must be versioned.

Example:

**progressionEngineVersion: 1.0**

Historical sessions should preserve which rules generated their prescriptions.

This will matter as BellGrinda is calibrated.

---

# 95. Deterministic Reproducibility

Given identical:

- user state;
- workout history;
- exercise state;
- equipment;
- readiness;
- football status;

the engine should produce the same prescription.

This is important for testing and trust.

---

# 96. AI Boundary

AI may:

- explain engine decisions;
- summarize trends;
- answer why a prescription changed.

AI may not:

- directly increase load;
- override pain restriction;
- remove a deload;
- promote a Training Level;
- alter deterministic thresholds.

---

# 97. Manual User Override

The user should retain the ability to:

- use a lighter load;
- reduce reps;
- extend rest;
- substitute an approved exercise;
- stop an exercise.

The user should not require permission from the engine to choose a safer option.

---

# 98. Unsafe Upward Override

The user may request a harder load or variation.

BellGrinda may allow manual logging but should warn when:

- load is not approved;
- pain flag exists;
- RPE trend is too high;
- movement remains restricted.

BellGrinda should not silently treat unsafe upward overrides as approved progression.

---

# 99. Manual Override Learning

Manual overrides shall be logged.

Repeated safer downward overrides may signal:

- prescription too aggressive;
- poor recovery;
- exercise mismatch.

Repeated upward overrides may signal:

- prescription too conservative.

The engine may use this as supporting data, not sole evidence.

---

# 100. Engine Success Criteria

The Progression Engine succeeds if it:

- produces understandable changes;
- avoids unnecessary constant progression;
- uses exercise-specific loads;
- responds to RPE;
- responds to readiness;
- protects against pain escalation;
- manages football conflicts;
- detects plateaus;
- supports deloads;
- preserves 40-minute sessions;
- supports all five Training Levels;
- remains deterministic and auditable.

---

# 101. Engine Failure Conditions

The engine is poorly configured if it frequently:

- increases load despite high RPE;
- increases pain-producing movements;
- pushes every exercise simultaneously;
- creates workouts longer than intended;
- ignores football workload;
- forces unnecessary rep inflation;
- overreacts to one bad workout;
- changes prescriptions without explainable reasons.

---

# 102. Progression Engine Flow

Overall logic:

**Load User State**

↓

**Load Current Program**

↓

**Apply Pain Restrictions**

↓

**Apply Football Context**

↓

**Calculate Readiness**

↓

**Review Exercise Histories**

↓

**Detect Progression / Hold / Plateau / Regression**

↓

**Apply Exercise-Specific Rules**

↓

**Apply Weekly Fatigue Budget**

↓

**Validate 40-Minute Constraint**

↓

**Generate Workout Prescription**

↓

**Persist Prescription + Reasons**

↓

**Execute Workout**

↓

**Record Results**

↓

**Recalculate State**

---

# 103. Rule Evaluation Pseudocode

Conceptually:

```text
for each exercise:

    if severePain:
        restrictExercise()

    else if moderatePain:
        stopAndSubstitute()

    else if repeatedMildPain:
        holdOrRegress()

    else if readiness == RED:
        recoveryPrescription()

    else if loadTrialFailed:
        regressLoad()

    else if repeatedHighRPE:
        holdOrRegress()

    else if plateauDetected:
        applyPlateauStrategy()

    else if loadProgressionEligible:
        testHeavierLoad()

    else if repProgressionEligible:
        increaseReps()

    else if variationProgressionEligible:
        progressVariation()

    else if densityProgressionEligible:
        reduceRestSlightly()

    else:
        hold()
```

---

# 104. V1 Implementation Principle

BellGrinda V1 does not need a perfect sports-science engine.

It needs a:

- conservative;
- testable;
- understandable;
- configurable

engine.

Raw data should be preserved so rules can be recalibrated later.

---

# 105. Next Specification

With the Progression Engine defined, the next item should be:

# BellGrinda Readiness, Recovery & Safety Specification

That document should formalize:

- Green / Yellow / Red scoring;
- soreness scoring;
- sleep scoring;
- energy scoring;
- pain severity;
- exercise restriction states;
- return-to-exercise logic;
- deload triggers;
- reconditioning rules;
- football recovery;
- competition-week protection;
- when the app should recommend stopping training;
- when professional evaluation should be suggested.

This deserves its own specification because safety and recovery are high-priority engine inputs and should not remain scattered across several training documents.
