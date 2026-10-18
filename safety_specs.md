# BellGrinda Readiness, Recovery & Safety Specification

**Version:** 0.1  
**Purpose:** Define how BellGrinda evaluates daily readiness, fatigue, pain, exercise safety, recovery requirements, deloads, return-to-training, football workload, and exercise restrictions.  
**Applies To:** Novice → Grandmaster  
**Engine Type:** Deterministic, conservative, trend-based  
**Priority:** Safety rules override progression rules.

---

# 1. Purpose

The Readiness, Recovery & Safety system determines whether the planned BellGrinda workout should be:

- performed normally;
- slightly modified;
- substantially reduced;
- converted into recovery work;
- partially restricted;
- stopped.

This system exists to protect long-term training consistency.

BellGrinda shall not assume:

**More training = better training**

The system must recognize when recovery is part of progression.

---

# 2. Core Principle

BellGrinda shall process:

**Safety → Readiness → Training**

not:

**Workout → Safety afterward**

Safety and recovery decisions must be evaluated before normal progression decisions are applied.

---

# 3. Daily Readiness Classification

BellGrinda shall classify daily readiness as:

## Green

Normal training is appropriate.

## Yellow

Training is possible, but workload should be modified.

## Red

Normal training should not proceed.

A recovery or heavily modified session may be prescribed instead.

---

# 4. Readiness Inputs

The Daily Readiness Check may use:

- Energy.
- Sleep quality.
- General soreness.
- Exercise-specific soreness.
- Pain/discomfort.
- Previous workout RPE.
- Recent workload.
- Football activity.
- Football competition.
- Jogging activity.
- Consecutive training days.
- Recent Yellow/Red Days.
- Missed recovery.
- User-reported illness where relevant.

Not every input must be required every day.

BellGrinda should minimize logging friction.

---

# 5. Recommended Daily Check-In

The default pre-workout check should take only a few seconds.

Ask:

## Energy

- High.
- Normal.
- Low.
- Very low.

## Sleep

- Good.
- Okay.
- Poor.
- Very poor.

## Soreness

- None.
- Mild.
- Moderate.
- Severe.

## Pain

- None.
- Mild.
- Moderate.
- Severe.

## Football Today?

- No.
- Recreational.
- Normal match.
- High-intensity.
- Competition/tournament.

BellGrinda may automatically include recent workout information without asking the user again.

---

# 6. Readiness Scoring Model

BellGrinda may use an internal readiness score from:

**0–100**

The score exists to support classification.

Recommended interpretation:

## Green

**75–100**

## Yellow

**50–74**

## Red

**0–49**

However, safety overrides may force Yellow or Red regardless of numeric score.

Example:

Readiness Score: 82.

Moderate lower-back pain reported.

Final classification:

**Red or movement-specific restriction**

not Green.

---

# 7. Energy Scoring

Recommended initial values:

## High

100

## Normal

80

## Low

50

## Very Low

25

Energy should not dominate readiness alone.

---

# 8. Sleep Scoring

Recommended initial values:

## Good

100

## Okay

80

## Poor

50

## Very Poor

25

BellGrinda shall not pretend this represents medical sleep-quality measurement.

It is a practical training-readiness input.

---

# 9. General Soreness Scoring

## None

100

## Mild

80

## Moderate

50

## Severe

20

Soreness shall also be evaluated by body region.

---

# 10. Body-Region Soreness

Possible locations:

- Chest.
- Shoulders.
- Arms.
- Upper back.
- Lower back.
- Core.
- Glutes.
- Quadriceps.
- Hamstrings.
- Calves.
- Other.

This allows BellGrinda to modify specific movement patterns rather than unnecessarily cancelling an entire workout.

---

# 11. Mild Soreness

Mild ordinary training soreness generally permits normal training.

Possible actions:

- no change;
- longer warm-up;
- slight movement modification.

Mild soreness alone should not generate Red readiness.

---

# 12. Moderate Soreness

Moderate soreness may generate:

**Yellow**

especially when the planned workout heavily uses the affected muscles.

Possible modification:

- reduce reps;
- reduce load;
- remove high-fatigue variation;
- increase rest;
- substitute a less demanding movement.

---

# 13. Severe Soreness

Severe soreness should generally generate:

**Red for heavily affected movement patterns**

or

**overall Red**

if widespread.

The app should prioritize recovery rather than forcing completion.

---

# 14. Pain vs Soreness

BellGrinda shall explicitly distinguish:

**Muscular soreness**

from

**pain/discomfort**

The app should explain that soreness is usually diffuse muscular fatigue while pain may be sharper, localized, unusual, or movement-specific.

BellGrinda shall not attempt diagnosis.

When uncertain, the system should treat the input conservatively.

---

# 15. Pain Severity

BellGrinda shall classify pain as:

- Mild.
- Moderate.
- Severe.

Pain can also be associated with:

- body location;
- exercise;
- movement pattern;
- round;
- repetition;
- date;
- note.

---

# 16. Mild Pain

A single mild pain report:

- gets recorded;
- blocks progression for the affected movement during that session;
- may allow cautious continuation if movement remains comfortable.

If pain increases:

Stop the movement.

---

# 17. Repeated Mild Pain

Repeated mild pain associated with the same:

- exercise;
- movement pattern;
- body region

shall trigger:

**Monitored → Restricted consideration**

Possible actions:

- reduce load;
- reduce reps;
- easier variation;
- substitute exercise;
- longer rest;
- technique review.

---

# 18. Moderate Pain

Moderate pain shall trigger:

**Immediate stop of the affected exercise**

BellGrinda may offer:

- approved substitute;
- unaffected movement;
- session modification.

The movement becomes:

**Restricted**

until re-evaluated.

---

# 19. Severe Pain

Severe pain shall trigger:

- stop the affected movement;
- do not continue loading that region;
- mark the movement Restricted;
- recommend appropriate professional evaluation.

BellGrinda shall not diagnose the cause.

---

# 20. Emergency Symptom Boundary

BellGrinda is not an emergency medical system.

If the user reports serious symptoms such as:

- chest pain;
- severe difficulty breathing;
- fainting;
- sudden neurological symptoms;
- severe trauma;

the app should tell the user to stop training and seek urgent medical evaluation.

No workout logic should continue.

---

# 21. Exercise Safety States

Every exercise may have one of these states:

## Active

Normal use permitted.

## Monitored

Movement remains usable but requires observation.

## Restricted

Movement should not appear in normal programming.

## Reintroduction

Movement is being cautiously returned.

---

# 22. Active State

Exercise may:

- progress normally;
- maintain;
- regress according to ordinary rules.

No relevant unresolved safety issue exists.

---

# 23. Monitored State

Triggered by:

- isolated mild pain;
- unusual technique concern;
- repeated high RPE;
- mild recurring discomfort.

Restrictions may include:

- no load increase;
- no volume increase;
- no harder variation.

BellGrinda should observe future exposures.

---

# 24. Restricted State

Triggered by:

- moderate pain;
- repeated mild pain;
- failed reintroduction;
- repeated movement-specific technical breakdown.

Restricted exercises:

- must not appear in automatically generated workouts;
- must not progress;
- should have approved substitutions.

---

# 25. Reintroduction State

A Restricted exercise may enter Reintroduction when:

- symptoms are absent or meaningfully improved;
- user chooses to retry;
- no stronger safety restriction remains.

Reintroduction begins below previous workload.

---

# 26. Reintroduction Protocol

Recommended initial return:

- previous lighter load;
- 30–50% fewer reps;
- longer rest;
- easier variation where available;
- fewer rounds if required.

Example:

Previous swing:

16 kg × 15.

Reintroduction:

12 kg × 8–10.

---

# 27. Reintroduction Success

Successful reintroduction should require:

- no meaningful pain during exercise;
- no meaningful pain afterward;
- acceptable technique;
- controlled RPE.

After approximately:

**2–3 successful exposures**

the movement may return to Active.

---

# 28. Failed Reintroduction

If pain returns:

Movement returns to:

**Restricted**

BellGrinda shall not repeatedly cycle:

Restricted → Full workload → Restricted.

The next reintroduction should remain conservative.

---

# 29. Swing-Specific Safety Rule

Because kettlebell swings have previously produced lower-back discomfort, swings require stronger safety controls.

Possible states:

- Monitored.
- Restricted.
- Reintroduction.
- Active.

BellGrinda must not increase:

- swing load;
- swing reps;
- swing density;
- swing challenge difficulty

while recurring lower-back discomfort remains.

---

# 30. Swing Substitutions

Approved alternatives may include:

- kettlebell deadlift;
- glute bridge;
- controlled hinge regression;
- other approved hip-extension exercises.

The substitution should preserve the training intent where possible.

---

# 31. Readiness Overrides

Some events shall override numeric readiness scoring.

Examples:

## Automatic Red

- Severe pain.
- Moderate exercise-specific pain affecting planned workout.
- Serious illness symptoms.
- Severe widespread soreness.
- Severe fatigue.

## Automatic Yellow

- Poor sleep + high soreness.
- High-intensity football previous day.
- Multiple recent RPE 9 sessions.
- Moderate soreness in a heavily trained body region.

---

# 32. Green Day Rules

Green means:

- planned workout remains valid;
- progression may occur;
- normal rounds;
- normal rest.

Green does not mean:

“Make today's workout harder.”

Progression still requires historical evidence.

---

# 33. Yellow Day Rules

Yellow shall modify approximately:

**1–2 training variables**

Possible changes:

- reps −10–20%;
- rounds −1;
- increase rest;
- maintain load instead of progressing;
- easier variation;
- remove one high-fatigue exercise.

BellGrinda should preserve training continuity where safe.

---

# 34. Yellow Day Example

Planned:

5 rounds.

Goblet squat:

16 kg × 12.

Push-ups:

Decline × 10.

Readiness:

Yellow.

Possible prescription:

4 rounds.

Goblet squat:

16 kg × 10.

Push-ups:

Standard or tempo × 10.

Longer round rest.

---

# 35. Red Day Rules

Red may generate:

- recovery workout;
- mobility/light movement;
- 1–3 low-intensity rounds;
- no ballistic movements;
- no load progression;
- no density progression.

The user may also choose:

**Rest completely**

A Red Day does not need to preserve normal workout volume.

---

# 36. Red Day Completion

If BellGrinda prescribes a Red recovery session and the user completes it:

The session counts as:

**Successfully completed as prescribed**

Consistency should not be penalized.

---

# 37. Recovery Session Template

Possible low-intensity recovery session:

1. Bodyweight squat — 8.
2. Glute bridge — 10.
3. Easy row — 8 per side.
4. Dead bug — 6 per side.
5. Easy mobility movement.

Rounds:

**2–3**

Target RPE:

**2–4**

This should not create additional fatigue.

---

# 38. Recovery Is Not Failure

BellGrinda shall never present:

- recovery day;
- Yellow modification;
- Red session;
- deload

as failure.

The UI should use neutral language.

Example:

**Recovery Adjustment Applied**

not:

**Workout Downgraded**

---

# 39. Recent RPE Influence

BellGrinda shall evaluate recent session RPE.

Possible pattern:

7  
8  
9

combined with falling performance.

This suggests rising fatigue.

Potential outcome:

Yellow.

If combined with poor sleep/soreness:

Red or deload consideration.

---

# 40. Isolated High RPE

One RPE 9 session alone should usually cause:

**Hold**

not automatic Red status.

The system must use trends.

---

# 41. Repeated High RPE

Two or more recent unexpectedly high RPE sessions may trigger:

- Yellow readiness;
- longer rest;
- volume reduction;
- deload evaluation.

---

# 42. Performance Decline Signal

Recovery concern may exist when:

- same workload;
- lower reps;
- higher RPE;
- longer rest;
- slower circuit completion

persist across multiple exposures.

BellGrinda should distinguish this from one bad session.

---

# 43. Deload Detection

Possible deload signals:

- repeated Yellow Days;
- declining performance;
- elevated RPE;
- widespread soreness;
- low energy;
- increasing missed sessions;
- heavy football schedule;
- high training density.

One signal alone should not automatically trigger deload.

---

# 44. Deload Trigger Model

Recommended initial rule:

Consider deload when:

**3 or more meaningful fatigue signals**

occur across approximately:

**7–14 days**

The exact algorithm should remain configurable.

---

# 45. Automatic Deload Recommendation

BellGrinda may automatically recommend deload when:

- ≥3 Yellow/Red Days within 7 days;
- average recent RPE significantly above target;
- performance decline persists;
- no major external explanation exists.

The user may accept or postpone once unless safety requires immediate reduction.

---

# 46. Deload Duration

Default:

**5–7 days**

Possible longer periods:

- extended competition schedule;
- reconditioning;
- unusual fatigue.

---

# 47. Deload Volume

Typical changes:

- reps −20–30%;
- rounds −1 or −2;
- longer rest;
- easier variations;
- complexes removed or simplified;
- ballistic volume reduced.

Load does not always need to decrease if volume reduction is sufficient.

---

# 48. Post-Deload Return

BellGrinda shall not resume immediately at the hardest recent workload.

Return should use:

**last productive workload**

then reassess.

---

# 49. Extended Break

BellGrinda shall detect extended training gaps.

Example classifications:

## Short Break

3–6 days.

Usually resume with caution.

## Reconditioning Trigger

Approximately 7–21+ days depending on context.

## Extended Reconditioning

Several weeks or longer.

---

# 50. Reconditioning Mode

Reconditioning Mode preserves Training Level but temporarily reduces prescription difficulty.

Possible changes:

- reps −20–40%;
- load reduction;
- easier variations;
- longer rest;
- fewer rounds;
- no difficult complexes.

---

# 51. Reconditioning Duration

Reconditioning may last:

**1–3 weeks**

depending on:

- break length;
- previous Training Level;
- current readiness;
- performance.

The user does not return to Novice merely because of a break.

---

# 52. Grandmaster Reconditioning

A Grandmaster returning after a long absence may display:

**Training Level: Grandmaster**

**Performance Grade: Competent**

**Mode: Reconditioning**

This preserves training history while acknowledging current capability.

---

# 53. Illness Handling

BellGrinda should allow:

**Not Training — Illness**

as a session state.

The system should not punish consistency when an explicit recovery/illness state is logged appropriately.

BellGrinda shall not attempt medical diagnosis.

---

# 54. Illness Return

After illness:

BellGrinda may recommend:

- reduced workload;
- lower RPE;
- longer rest;
- fewer rounds.

If symptoms are significant or ongoing, professional medical guidance should be encouraged.

---

# 55. Football Recovery Inputs

Football shall include intensity:

- Low.
- Moderate.
- High.
- Competition.

Optional fields:

- duration;
- perceived intensity;
- soreness after;
- injury/discomfort.

---

# 56. Low Football Load

Light recreational football should usually have minimal effect.

BellGrinda may simply record it.

---

# 57. Moderate Football Load

Normal five-a-side may:

- reduce Friday resistance training;
- increase next-day recovery consideration.

---

# 58. High Football Load

Possible effects:

- Yellow following day;
- reduced lower-body volume;
- no additional hard conditioning;
- increased rest.

---

# 59. Football Competition

Competition should influence:

**Thursday + Friday**

Potential Thursday modifications:

- fewer lower-body reps;
- lower ballistic volume;
- easier complex.

Friday:

Activation only or football itself.

---

# 60. Tournament Logic

If several matches occur in one day or weekend:

BellGrinda should treat workload as:

**High external athletic stress**

Possible subsequent action:

- Red recovery day;
- Yellow return day;
- no conditioning progression immediately afterward.

---

# 61. Football Injury Reporting

Football-related discomfort must enter the same Pain Log as workout-related discomfort.

Example:

Body location:
Ankle.

Source:
Football.

Severity:
Moderate.

BellGrinda should then restrict affected exercise patterns if necessary.

---

# 62. Jogging Recovery

Normal light/moderate jogging does not automatically modify training.

Long or difficult runs may affect:

- lower-body soreness;
- readiness;
- conditioning fatigue.

BellGrinda should use actual workload rather than treating every jog equally.

---

# 63. Consecutive Fatigue

BellGrinda shall monitor:

- consecutive hard sessions;
- consecutive Yellow Days;
- high-fatigue exercise exposure.

The system should avoid allowing training stress to compound without recovery.

---

# 64. Weekly Fatigue Distribution

Suggested pattern:

High  
Moderate  
Moderate  
High  
Low/Football

rather than:

High  
High  
High  
High  
High

Exact distribution depends on level and schedule.

---

# 65. Exercise Fatigue Classification

Exercises may have:

## Low Fatigue

Examples:

- dead bug;
- glute bridge;
- easy mobility;
- light row.

## Moderate Fatigue

Examples:

- goblet squat;
- press;
- loaded lunge.

## High Fatigue

Examples:

- heavy complexes;
- high-volume swings;
- snatches;
- intense conditioning.

---

# 66. Session Fatigue Classification

BellGrinda may calculate:

- Low.
- Moderate.
- High.

based on:

- exercise fatigue;
- volume;
- load;
- density;
- RPE.

This assists weekly scheduling.

---

# 67. Fatigue Budget

BellGrinda shall prevent excessive high-fatigue stacking.

If Monday and Tuesday are both classified High:

Wednesday may require:

- Moderate or Low prescription;
- reduced complexity;
- additional rest.

---

# 68. Pain History Influence

Pain history should affect future prescriptions.

Example:

Three lower-back discomfort events associated with swings.

Even if today reports no pain:

Swing may remain:

**Monitored**

until sufficient successful pain-free exposures occur.

---

# 69. Pain Decay

Old pain history should not permanently restrict movements.

A restriction may reduce over time after:

- multiple pain-free sessions;
- successful reintroduction;
- stable technique.

The system should remember history without treating the user as permanently injured.

---

# 70. Pain Recurrence

If the same pain returns after successful reintroduction:

BellGrinda should treat recurrence more seriously than a first isolated event.

Possible action:

Restricted state.

---

# 71. Pain Logging UX

During a workout:

Tap:

**Report Discomfort**

Then choose:

1. Location.
2. Severity.
3. Optional note.

The process should take only a few seconds.

---

# 72. Safety Modal

Moderate/severe reports should immediately display:

**Stop this exercise.**

Then provide:

- approved substitute;
- skip exercise;
- end workout.

Severe reports may recommend professional evaluation.

---

# 73. User Override

Users may always:

- stop;
- reduce weight;
- reduce reps;
- take longer rest;
- use approved substitute.

BellGrinda shall never force the user to finish prescribed work.

---

# 74. Safer Override

A downward override requires no warning.

Example:

Prescription:
16 kg.

User chooses:
12 kg.

BellGrinda simply records it.

Repeated downward overrides may inform future progression.

---

# 75. Harder Override

If user selects a harder option than prescribed:

Example:

Prescribed:
16 kg.

User selects:
20 kg.

BellGrinda checks:

- load approval;
- pain state;
- RPE history;
- readiness.

If inappropriate:

display warning.

---

# 76. Safety Warning Example

**20 kg has not yet been approved for this exercise. Your recent press sessions have averaged RPE 8. BellGrinda recommends staying with 16 kg today.**

Options:

- Use Recommended Weight.
- Continue Manually.

Manual selection is logged as an override.

---

# 77. Stop Workout Rule

BellGrinda should recommend stopping the workout when:

- severe pain occurs;
- repeated moderate pain occurs across multiple movements;
- serious symptoms occur;
- user reports feeling faint/unwell;
- safe substitutions are unavailable.

---

# 78. Professional Evaluation Prompt

BellGrinda may recommend professional evaluation when:

- severe pain occurs;
- moderate pain persists;
- pain worsens;
- same movement repeatedly causes discomfort;
- symptoms interfere with normal activity.

The app should avoid diagnosing a specific injury.

---

# 79. Safety Messaging Tone

Use direct neutral language.

Good:

**Stop swings for today. Lower-back discomfort has occurred repeatedly during this movement.**

Avoid:

**You failed the workout.**

Avoid alarmist medical claims without evidence.

---

# 80. Readiness Trend

BellGrinda should display recent readiness.

Example:

Mon: Green  
Tue: Green  
Wed: Yellow  
Thu: Yellow  
Fri: Red

The system may identify:

**Recovery trend declining**

---

# 81. Readiness Trend Response

Repeated Yellow/Red status may trigger:

- reduced next-week progression;
- deload recommendation;
- recovery-focused block;
- AI explanation.

---

# 82. Recovery Score Integration

Readiness history contributes to Performance Grade Recovery Score.

However:

Taking appropriate recovery days should not reduce Recovery Score.

Ignoring recovery signals may.

---

# 83. Consistency Integration

Approved:

- Yellow workout;
- Red recovery session;
- football-adjusted session;
- deload session

all count as completed sessions.

This ensures the system rewards adherence to the training plan rather than maximal workload.

---

# 84. AI Role

AI may:

- explain readiness classification;
- summarize fatigue trends;
- explain why a deload occurred;
- explain why an exercise is restricted;
- explain recovery recommendations.

AI may not:

- downgrade pain severity;
- override Red status;
- remove restrictions;
- diagnose injuries.

---

# 85. Example AI Explanation

“BellGrinda marked today Yellow because you reported poor sleep and moderate leg soreness, while yesterday's session was RPE 8. Your workout keeps the same kettlebell loads but reduces one round and extends rest.”

The reasoning must originate from deterministic rules.

---

# 86. Offline Safety

Readiness and safety logic must work offline.

Internet access shall not be required for:

- readiness scoring;
- pain logging;
- exercise restrictions;
- substitutions;
- deload rules;
- recovery prescriptions.

AI explanation may be unavailable offline.

---

# 87. Persistent Safety State

Safety-critical data must be stored locally immediately.

Examples:

- pain report;
- restriction state;
- active substitution;
- Red status.

A browser crash or phone lock must not erase a restriction.

---

# 88. Safety State Synchronization

When internet returns:

Local safety records sync to backend.

Conflict resolution should prefer preserving safety information rather than silently discarding it.

---

# 89. Readiness Record

Conceptual record:

```text id="r8vb2x"
ReadinessCheck

id
userId
date
energy
sleepQuality
sorenessLevel
sorenessLocations
painLevel
painLocations
footballStatus
recentRpeContext
readinessScore
classification
overrideReason
createdAt
```

---

# 90. Pain Record

Conceptual record:

```text id="5sv3xr"
PainEvent

id
userId
sessionId
exerciseId
bodyLocation
severity
round
timestamp
notes
source
actionTaken
restrictionCreated
```

---

# 91. Exercise Safety Record

Conceptual record:

```text id="1ja0cs"
ExerciseSafetyState

exerciseId
userId
status
reason
restrictionDate
lastPainDate
successfulReintroductionCount
approvedSubstitutions
updatedAt
```

---

# 92. Deload Record

Conceptual record:

```text id="jnwp33"
RecoveryBlock

id
userId
startDate
endDate
triggerReasons
volumeReduction
roundReduction
restAdjustment
exerciseRestrictions
completionStatus
```

---

# 93. Safety Reason Codes

Examples:

- PAIN_MILD.
- PAIN_REPEATED.
- PAIN_MODERATE.
- PAIN_SEVERE.
- SLEEP_POOR.
- ENERGY_LOW.
- SORENESS_HIGH.
- RPE_TREND_HIGH.
- PERFORMANCE_DECLINE.
- FOOTBALL_HIGH_LOAD.
- COMPETITION_DAY.
- DELOAD_REQUIRED.
- RECONDITIONING_REQUIRED.
- EXERCISE_RESTRICTED.
- REINTRODUCTION_FAILED.

---

# 94. Auditability

Every significant safety adjustment shall store:

- trigger;
- original prescription;
- modified prescription;
- reason code;
- rule version.

This lets BellGrinda explain exactly why a workout changed.

---

# 95. Safety Rule Versioning

Safety logic shall be versioned.

Example:

**safetyEngineVersion: 1.0**

Future rule changes should remain traceable.

---

# 96. Readiness Engine Flow

```text id="2f6bvx"
Start Workout
      ↓
Collect Readiness
      ↓
Check Serious Symptoms
      ↓
Check Pain
      ↓
Check Exercise Restrictions
      ↓
Review Recent RPE / Fatigue
      ↓
Review Football / External Load
      ↓
Calculate Readiness
      ↓
Apply Overrides
      ↓
Green / Yellow / Red
      ↓
Modify Workout
      ↓
Persist Decision
```

---

# 97. Exercise Safety Flow

```text id="u8w7a0"
Pain Report
      ↓
Classify Severity
      ↓
Mild?
   Monitor
      ↓
Repeated Mild?
   Restrict / Modify
      ↓
Moderate?
   Stop Exercise
      ↓
Severe?
   Stop + Evaluation Recommendation
      ↓
Store Safety State
      ↓
Approved Substitute
```

---

# 98. Deload Flow

```text id="cecr1p"
Monitor Recent Training
      ↓
High RPE?
Repeated Yellow?
Performance Decline?
High Soreness?
High Football Load?
      ↓
Multiple Fatigue Signals?
      ↓
Yes
      ↓
Recommend Deload
      ↓
Reduce Volume / Density
      ↓
5–7 Days
      ↓
Reassess
      ↓
Return to Productive Workload
```

---

# 99. Safety Success Criteria

This system succeeds when:

- pain is never ignored by progression logic;
- users can easily report discomfort;
- recovery sessions count as successful adherence;
- BellGrinda responds to accumulated fatigue;
- football workload affects programming;
- extended breaks produce sensible reconditioning;
- exercise restrictions persist reliably;
- return-to-exercise occurs gradually;
- AI cannot override safety;
- safety decisions are explainable.

---

# 100. Safety Failure Conditions

The system is poorly designed if it:

- encourages training through pain;
- penalizes pain reporting;
- forces workouts despite Red readiness;
- ignores football fatigue;
- repeatedly increases painful movements;
- immediately restores peak workload after breaks;
- confuses soreness with injury diagnosis;
- relies on internet access for essential safety logic.

---

# 101. BellGrinda Safety Principle

BellGrinda shall follow:

**Consistency through intelligent recovery**

rather than:

**Consistency at any cost**

The goal is not to complete every planned workload.

The goal is to maintain a sustainable training practice over months and years.

---

# 102. Next Specification

With readiness, recovery, pain, and safety centralized, the next specification should be:

# BellGrinda Workout Generation & Exercise Selection Specification

That document should define how the engine turns:

- Training Level;
- current Phase;
- Advanced/Grandmaster priority;
- exercise library;
- progression states;
- readiness;
- pain restrictions;
- available kettlebells;
- football status;
- fatigue budget;
- 40-minute session limit

into an actual five-exercise workout.

It should formalize:

- required movement slots;
- core vs rotating exercises;
- exercise-tag matching;
- substitution hierarchy;
- duplicate-movement prevention;
- weekly movement balance;
- workout difficulty balancing;
- football-aware selection;
- exercise ordering;
- complex placement;
- warm-up generation;
- cooldown generation;
- estimated-session-duration validation.

This is the missing link between the **Progression Engine** deciding what needs to happen and the **Workout Player** receiving an actual workout to execute.
