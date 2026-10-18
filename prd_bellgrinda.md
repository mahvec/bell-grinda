# BellGrinda V1 Product Requirements Document

**Version:** 0.2  
**Status:** Revised Draft for Review  
**Product Name:** BellGrinda  
**Initial Release Type:** Personal-use Progressive Web Application  
**Initial User:** Single user  
**Initial Training Focus:** Kettlebell + bodyweight training  
**Initial Training Cycle:** October 2026 – December 31, 2026  
**Long-Term Direction:** Expand BellGrinda into a commercial adaptive fitness platform supporting multiple users, equipment types, subscriptions, authentication, advanced AI coaching, and broader training systems.

---

# 1. Executive Summary

BellGrinda is a mobile-first Progressive Web Application designed to manage structured strength, conditioning, athleticism, fitness progression, and training consistency using kettlebells and bodyweight exercises.

BellGrinda V1 will initially be built for one user.

The application will function as both:

1. A structured fitness training system.
2. A long-term progression and performance tracker.

BellGrinda will not simply display static workout plans.

It will maintain a deterministic progression engine capable of adjusting training prescriptions based on structured user and workout data.

Inputs may include:

- Current Training Level.
- Current Training Phase.
- Available equipment.
- Exercise-specific load history.
- Previous workout performance.
- Workout completion rate.
- Reported RPE.
- Training consistency.
- Football activity.
- Jogging activity.
- Pain/discomfort reports.
- Biweekly assessments.
- Performance tests.
- Historical progression.

BellGrinda will additionally include an AI-assisted coaching layer.

AI will assist with:

- Workout interpretation.
- Progress interpretation.
- Biweekly reports.
- Conversational coaching.
- Workout explanations.
- Voice workout guidance.

The deterministic BellGrinda Training Engine remains responsible for final workout prescriptions and progression rules.

AI shall not have unrestricted control over training progression or safety-critical decisions.

---

# 2. Product Vision

BellGrinda aims to become an adaptive training operating system combining:

- Structured training.
- Exercise progression.
- Performance tracking.
- Equipment-aware programming.
- Offline workout execution.
- Analytics.
- AI coaching.
- Voice interaction.
- Long-term training history.

Future versions may expand into:

- Kettlebells.
- Dumbbells.
- Barbells.
- Resistance bands.
- Pull-up bars.
- Bodyweight.
- Running.
- Football conditioning.
- Sandbags.
- Medicine balls.
- Home gym equipment.
- Hybrid training systems.

Future commercial versions may support:

- Authentication.
- Multiple users.
- Subscription plans.
- Personalized training profiles.
- Advanced AI coaching.
- Social functionality.
- Coach/trainer tools.
- Wearable integrations.
- Native mobile applications.

---

# 3. Initial User Goals

The initial BellGrinda training goals are prioritized as follows:

1. Athleticism.
2. Training consistency and discipline.
3. Strength.
4. Muscular endurance and cardiovascular conditioning.
5. Fat loss.
6. Bigger chest.
7. Muscle gain.

BellGrinda programming should reflect this ordering.

The application should not optimize exclusively for bodybuilding metrics or maximal muscle growth at the expense of athleticism, training consistency, strength, or conditioning.

---

# 4. Initial Training Cycle

The first BellGrinda cycle runs until:

**December 31, 2026**

December 31 is not the end of BellGrinda.

It represents:

**BellGrinda Initial Assessment #1**

The system is intended to continue into 2027 and beyond.

Grandmaster should be treated as a long-term pursuit rather than a deadline imposed by December.

---

# 5. Initial User Profile

Initial baseline:

- Age: 30.
- Height: 183 cm.
- Estimated current weight: approximately 95 kg.
- Target bodyweight: approximately 85 kg.
- Current maximum continuous push-ups: approximately 20.
- Current kettlebell: 12 kg.
- Planned future kettlebells:
  - 16 kg.
  - 20 kg.
- Additional equipment:
  - Exercise mat.
  - Chair/bench.
  - Skipping rope.
- Training environments:
  - Home indoors.
  - Outdoor compound.
- Existing physical activity:
  - Jogging approximately twice weekly.
  - Football normally on Fridays.
  - Planned participation in five-a-side football competition.
- Current kettlebell familiarity:
  - Deadlift.
  - Goblet squat.
  - Kettlebell swing.
  - One-arm row.
  - Overhead press.
  - Clean.
  - Clean and press.
  - Snatch.
  - Reverse lunge.
- Current movement concern:
  - Mild lower-back discomfort during kettlebell swings.

---

# 6. V1 Product Objectives

BellGrinda V1 should prove that the product can:

- Guide structured five-day training.
- Maintain workout consistency.
- Track long-term progression.
- Adapt workouts according to structured rules.
- Respond intelligently to new kettlebell weights.
- Track exercise-specific performance.
- Record discomfort safely.
- Support optional performance testing.
- Provide useful progress analytics.
- Continue workouts despite poor network conditions.
- Survive phone locking, browser suspension, refreshes, or accidental app closure.
- Provide useful AI-assisted interpretation.
- Produce a meaningful December Initial Assessment.

---

# 7. Core Product Validation Questions

BellGrinda V1 exists to validate four major assumptions.

## Assumption 1

A structured progression engine can provide a useful long-term kettlebell and bodyweight training experience.

## Assumption 2

A local-first PWA can make training easier instead of creating logging friction.

## Assumption 3

AI-generated analysis and explanations provide enough value to justify their inclusion.

## Assumption 4

The application is useful and convenient enough that the user continues using it consistently over time.

Features that do not meaningfully help validate these assumptions should generally be deferred.

---

# 8. V1 Non-Goals

The following are deliberately excluded from V1:

- Public registration.
- Multi-user accounts.
- Authentication.
- Subscription billing.
- Payment processing.
- Social feeds.
- Public user profiles.
- Leaderboards.
- Trainer marketplaces.
- Nutrition tracking.
- Calorie tracking.
- Meal planning.
- Wearable integrations.
- Smartwatch applications.
- Apple Health integration.
- Google Fit integration.
- Native Android app.
- Native iOS app.
- Live camera form correction.
- Full commercial multi-equipment programs.
- Public workout sharing.

The architecture should avoid unnecessary barriers to adding these capabilities later.

---

# 9. Core Training Philosophy

BellGrinda shall not define progression exclusively as increasing repetition count.

Progression may occur through:

- Increased load.
- Increased repetitions.
- Harder exercise variations.
- Tempo changes.
- Reduced rest.
- Increased training density.
- Greater movement complexity.
- Unilateral loading.
- Exercise progression.
- Improved work capacity.
- Improved movement quality.

Example:

A user performing:

**12 kg goblet squat × 20 reps**

may progress to:

**16 kg goblet squat × 12 reps**

rather than automatically performing:

**16 kg × 20 reps**

Load increases may therefore result in temporary repetition reductions.

---

# 10. Training Level System

BellGrinda shall support five Training Levels:

1. Novice.
2. Advanced Novice.
3. Intermediate.
4. Advanced.
5. Grandmaster.

Training Levels represent progression through the BellGrinda curriculum.

They shall primarily be time-based.

Performance tests shall not automatically prevent the user from progressing to the next Training Level.

---

# 11. Training Level vs Performance Grade

BellGrinda shall treat Training Level and Performance Grade as separate concepts.

## Training Level

Represents experience and progress through the training curriculum.

Examples:

- Novice.
- Intermediate.
- Advanced.

## Performance Grade

Represents demonstrated physical capability.

Initial grading categories:

- Developing.
- Competent.
- Strong.
- Excellent.

Performance Grade may consider:

- Push-up performance.
- Circuit performance.
- Kettlebell work capacity.
- Exercise-specific performance.
- Training consistency.
- RPE trends.
- Recovery.
- Optional performance-test scores.

Example:

**Training Level:** Intermediate  
**Performance Grade:** Strong

or

**Training Level:** Advanced  
**Performance Grade:** Developing

Time spent training shall not automatically be treated as proof of physical capability.

---

# 12. Level Phase Structure

Each Training Level shall contain three internal phases.

## Phase 1 — Foundation

Focus:

- Movement consistency.
- Technique.
- Exercise familiarity.
- Habit formation.
- Controlled workload.

## Phase 2 — Development

Focus:

- Increased workload.
- Increased exercise difficulty.
- Greater work capacity.
- Increased training density.

## Phase 3 — Consolidation

Focus:

- Reinforcing the level.
- Preparing for assessment.
- Improving movement execution.
- Preparing for the next Training Level.

If the user is dissatisfied with a performance test:

**Repeat Phase 3 → Retest → Continue or Repeat**

Repeated phases must be stored historically.

---

# 13. Validated Training Scope

BellGrinda V1 shall structurally support all five Training Levels.

Detailed initial programming shall prioritize:

1. Novice.
2. Advanced Novice.
3. Intermediate.

Advanced and Grandmaster may initially exist as progression frameworks rather than fully rigid long-term programs.

Detailed Advanced and Grandmaster programming should evolve based on:

- Actual training history.
- Assessment results.
- Equipment progression.
- Exercise performance.
- Training consistency.
- Pain history.
- User experience with the earlier levels.

BellGrinda should not pretend to know the user's exact advanced training requirements months in advance without meaningful training data.

---

# 14. Weekly Training Structure

BellGrinda V1 shall use a Monday–Friday training schedule.

Standard session duration:

**Approximately 40 minutes total**

including:

- Warm-up.
- Main circuit.
- Rest.
- Cooldown.

Default main circuit format:

**5 exercises × 5 rounds**

The training engine may modify this structure in future Training Levels or specific performance tests.

---

# 15. Weekly Training Focus

Initial weekly training focus:

## Monday

Full-body strength.

## Tuesday

Athletic conditioning and endurance.

## Wednesday

Strength with additional upper-body/chest emphasis.

## Thursday

Power and conditioning.

## Friday

Reduced-fatigue athletic session designed around football activity.

## Saturday

Recovery/rest.

## Sunday

Recovery/rest.

Training focus may evolve according to Training Level.

---

# 16. Push-Up Programming

BellGrinda shall initially support approximately:

**20 push-ups per programmed round**

where appropriate.

Twenty repetitions shall not be treated as a permanent immutable system rule.

BellGrinda may modify:

- Push-up repetitions.
- Push-up variation.
- Number of push-up rounds.
- Tempo.
- Rest.
- Frequency.

based on:

- RPE.
- Fatigue.
- Performance.
- Pain/discomfort.
- Training Level.
- Other pressing volume.
- External sports activity.

Push-up progression should favor increased quality and difficulty rather than uncontrolled repetition accumulation.

Potential progressions may include:

- Standard push-up.
- Pause push-up.
- Tempo push-up.
- Close-grip push-up.
- Decline push-up.
- Other approved advanced variations.

Increasing repetition count indefinitely shall not be the primary progression strategy.

---

# 17. Football Integration

Friday football participation shall be treated as meaningful training load.

BellGrinda shall support football activity states including:

- Football scheduled.
- Football completed.
- Football skipped.
- Football competition.
- High-intensity football session.

When football is scheduled, BellGrinda may reduce conflicting lower-body workload.

BellGrinda should avoid unnecessarily exhausting the user before football competition.

Football sessions shall contribute to conditioning and activity history.

---

# 18. Jogging Integration

BellGrinda shall allow jogging sessions to be logged.

Jogging records may include:

- Date.
- Approximate duration.
- Optional distance.
- Perceived difficulty.

Jogging activity shall contribute to training-history context.

Jogging shall not automatically alter resistance programming unless progression rules determine that modification is appropriate.

---

# 19. Equipment Management

BellGrinda shall maintain a structured equipment inventory.

Initial equipment:

- 12 kg kettlebell.
- Exercise mat.
- Bench/chair.
- Skipping rope.

Future kettlebells may include:

- 16 kg.
- 20 kg.
- Additional weights.

Each kettlebell record should contain:

- Weight.
- Availability.
- Date added.
- Exercise-specific usage history.

Adding a heavier kettlebell must not globally upgrade all exercises.

Load assignment must remain exercise-specific.

Example after adding a 16 kg kettlebell:

- Goblet squat → 16 kg.
- Deadlift → 16 kg.
- Row → 16 kg.
- Overhead press → remain 12 kg.
- Snatch → remain 12 kg.

---

# 20. Exercise Library

BellGrinda shall maintain a structured exercise library.

Each exercise should include:

- Exercise ID.
- Name.
- Equipment.
- Exercise category.
- Movement pattern.
- Primary muscles.
- Secondary muscles.
- Difficulty.
- Required equipment.
- Written instructions.
- Demonstration video.
- Coaching cues.
- Common mistakes.
- Regressions.
- Progressions.
- Approved substitutions.
- Unilateral/bilateral classification.
- Safety flags.
- Level suitability.

The exercise library must support future expansion beyond kettlebells.

---

# 21. Exercise Demonstration Videos

Every exercise used within active training programs should provide access to a demonstration video.

Videos should:

- Be concise.
- Clearly demonstrate proper execution.
- Be optimized for mobile viewing.
- Load quickly.
- Be cacheable for offline use where appropriate.

Users should not need to leave BellGrinda for basic exercise demonstrations.

---

# 22. Dashboard

The BellGrinda Dashboard shall function as the primary control center.

It should display:

- Current Training Level.
- Current Training Phase.
- Current training week.
- Today's workout.
- Workout streak.
- Workout completion rate.
- Available kettlebells.
- Next biweekly assessment.
- Next optional performance test.
- Recent Personal Records.
- Relevant pain/discomfort flags.
- Recent AI insight.
- Progress toward December assessment.

The Dashboard should prioritize useful actions and important state rather than excessive statistics.

---

# 23. Today's Workout

The Today's Workout screen shall display:

- Workout focus.
- Five exercises.
- Target repetitions.
- Prescribed kettlebell load.
- Exercise variation.
- Number of rounds.
- Rest guidance.
- Approximate session duration.
- Relevant notes.
- Football-related adjustments where applicable.

The user shall be able to review the session before beginning.

---

# 24. Guided Workout Player

The Workout Player is the primary active-training interface.

It shall display:

- Current round.
- Total rounds.
- Current exercise.
- Current exercise number.
- Exercise demonstration.
- Target repetitions.
- Prescribed load.
- Tempo where relevant.
- Rest timer.
- Next exercise.

Primary controls:

- Complete.
- Skip.
- Substitute.
- View Demonstration.
- Report Discomfort.
- Pause.
- End Workout.

Example:

**Round 3 / 5**

**Exercise 2 / 5**

Goblet Squat  
12 kg  
15 repetitions

Actions:

- Complete.
- Demo.
- Substitute.
- Discomfort.

The interface should minimize required taps.

---

# 25. Active Workout Session State

BellGrinda shall maintain a structured Active Workout Session.

The state should include, at minimum:

- Workout Session ID.
- Workout Template ID.
- Current round.
- Current exercise index.
- Completed exercises.
- Completed repetitions where tracked.
- Skipped exercises.
- Exercise substitutions.
- Session start timestamp.
- Last update timestamp.
- Rest start timestamp.
- Rest duration.
- Pain/discomfort entries.
- Session notes.
- Workout status.
- Pause status.

Possible workout statuses:

- Active.
- Paused.
- Completed.
- Abandoned.

---

# 26. Active Session Persistence

Active workout state shall be treated as critical application data.

BellGrinda shall not depend solely on volatile browser memory to preserve an active workout.

The application shall persist active workout state locally after meaningful workout interactions.

Examples include:

- Completing an exercise.
- Completing a round.
- Skipping an exercise.
- Replacing an exercise.
- Reporting discomfort.
- Pausing the session.
- Resuming the session.
- Starting a meaningful rest period.

The primary persistent local storage mechanism should support structured offline data such as IndexedDB or an equivalent browser database.

---

# 27. Phone Lock and Application Resume

BellGrinda must handle mobile operating-system suspension safely.

If the user:

- Locks the phone.
- Unlocks the phone.
- Changes application.
- Changes browser tab.
- Puts the browser into the background.
- Returns after OS suspension.

BellGrinda should restore the active training state without forcing the user to restart the workout.

For short interruptions, BellGrinda may immediately restore the Workout Player.

For longer interruptions, BellGrinda may display:

**Workout in Progress**

Example:

Wednesday — Strength + Chest

Round 3 of 5  
Exercise 4 of 5

Last activity: 8 minutes ago

Actions:

- Resume Workout.
- End Session.

---

# 28. Browser Refresh and Unexpected Closure

If the user:

- Refreshes the browser.
- Accidentally closes BellGrinda.
- Browser process crashes.
- Browser is killed by the operating system.
- Device restarts.

BellGrinda shall attempt to restore any unfinished workout from persistent local state.

The user should not be returned to Round 1 simply because browser memory was lost.

---

# 29. Workout Timer Persistence

Workout and rest timers shall not rely exclusively on in-memory countdown values.

Important timing events shall use timestamps.

Example:

Instead of storing only:

**42 seconds remaining**

BellGrinda should persist:

- Rest start timestamp.
- Intended rest duration.

When the application resumes, BellGrinda shall calculate:

**Current time − rest start time**

and reconstruct the correct timer state.

If the rest period expired while the phone was locked, BellGrinda should display that the rest period has completed.

---

# 30. Workout Persistence Lifecycle

Conceptual flow:

User completes exercise

↓

BellGrinda updates current application state

↓

Active session is persisted locally

↓

Phone/browser may suspend or terminate

↓

User returns to BellGrinda

↓

Application reads persisted active session

↓

Active state is restored

↓

Timers are reconstructed from timestamps

↓

User continues from the correct round and exercise

---

# 31. Application State vs Training State

BellGrinda shall distinguish between ordinary UI state and critical training state.

## Non-Critical UI State

Examples:

- Open navigation tab.
- Open modal.
- Scroll position.
- Temporary animation state.

This data does not require aggressive persistence.

## Critical Training State

Examples:

- Current round.
- Current exercise.
- Completed exercises.
- Repetitions.
- Current kettlebell.
- Substitutions.
- Rest timing.
- Pain reports.
- Session start time.

Critical Training State must be persisted reliably.

---

# 32. Workout State Recovery Rules

BellGrinda shall detect unfinished sessions on application startup.

If an unfinished workout exists:

BellGrinda shall offer:

- Resume.
- End Session.

Persisted workout state shall not be deleted until:

- Workout completion is successfully recorded.

or

- User explicitly abandons the workout.

BellGrinda should protect against duplicate active sessions.

---

# 33. Workout Logging

BellGrinda shall automatically create a historical workout record.

Workout records should include:

- Session ID.
- Date.
- Training Level.
- Training Phase.
- Training focus.
- Workout Template.
- Exercises.
- Prescribed repetitions.
- Completed repetitions where applicable.
- Kettlebell weight.
- Rounds completed.
- Skipped exercises.
- Exercise substitutions.
- Duration.
- RPE.
- Discomfort reports.
- User notes.
- Football/jogging context.
- AI workout report.

Manual data entry should be minimized.

---

# 34. Workout RPE

After workout completion, BellGrinda shall request perceived workout difficulty.

Scale:

**1–10**

Interpretation guideline:

- 1–3: Very easy.
- 4–6: Appropriate/moderate.
- 7–8: Challenging.
- 9: Near maximum sustainable effort.
- 10: Excessive/maximal.

The progression engine should analyze RPE trends over multiple sessions rather than reacting aggressively to one isolated score.

---

# 35. Pain and Discomfort Tracking

The user shall be able to report discomfort during or after exercises.

A discomfort record shall contain:

- Body location.
- Severity.
- Associated exercise.
- Round.
- Timestamp.
- Optional notes.

Severity levels:

- Mild.
- Moderate.
- Severe.

Possible locations:

- Lower back.
- Upper back.
- Shoulder.
- Elbow.
- Wrist.
- Hip.
- Knee.
- Ankle.
- Chest.
- Other.

Repeated discomfort associated with the same movement shall generate a movement warning.

Possible system actions include:

- Reduce workload.
- Change variation.
- Substitute the exercise.
- Recommend technique reassessment.
- Recommend stopping the movement.

AI shall not diagnose injuries.

---

# 36. Progression Engine

BellGrinda shall use a deterministic progression engine.

Inputs may include:

- Current Training Level.
- Current phase.
- Exercise.
- Available kettlebells.
- Exercise load history.
- Recent workout completion.
- Recent RPE.
- Recent pain reports.
- Previous performance.
- Assessment data.
- Football activity.
- Jogging activity.

Possible progression actions:

- Increase kettlebell load.
- Increase repetitions.
- Reduce repetitions following load increase.
- Modify tempo.
- Progress exercise variation.
- Regress exercise variation.
- Introduce unilateral training.
- Reduce rest.
- Increase density.
- Modify exercise selection.

All progression dimensions shall operate inside defined upper and lower limits.

AI shall not directly write unrestricted prescriptions into active training programs.

---

# 37. Performance Tests

BellGrinda shall support optional performance tests at predetermined checkpoints.

Potential categories:

- Maximum push-ups.
- Kettlebell work capacity.
- Full-body circuit.
- Strength endurance.
- Recovery.
- Exercise-specific performance.
- Movement quality.

Results shall be stored historically.

---

# 38. Performance Test Outcome

Following a performance test, BellGrinda shall display:

- Result vs baseline.
- Result vs previous assessment.
- Strongest area.
- Weakest area.
- Performance Grade.
- Recommended next action.

User choices:

**Continue to next Training Level**

or

**Repeat final third of current Training Level**

The user retains final control.

---

# 39. Reinforcement / Repeat Blocks

Repeating the final third of a level should not always require identical workout repetition.

BellGrinda may create a reinforcement block focused on weak areas.

Example:

Assessment indicates:

- Strong lower-body endurance.
- Strong conditioning.
- Weak pressing endurance.
- Poor swing confidence.

BellGrinda may prioritize:

- Upper-body pressing.
- Shoulder endurance.
- Swing regression/technique work.

The user remains within the same Training Level and Phase until the reinforcement block is completed.

---

# 40. Biweekly Assessments

BellGrinda shall request a structured progress assessment every two weeks.

Possible metrics:

- Bodyweight.
- Chest measurement.
- Waist measurement.
- Maximum push-ups.
- Workout completion rate.
- Average RPE.
- Current kettlebell usage.
- Football activity.
- Jogging activity.
- Pain/discomfort.
- Optional progress photograph.

BellGrinda shall compare:

- Baseline.
- Previous assessment.
- Current assessment.

---

# 41. Progress Dashboard

BellGrinda shall maintain trends for:

- Workout completion.
- Push-up maximum.
- Exercise performance.
- Kettlebell progression.
- Workout duration.
- RPE.
- Personal Records.
- Assessment results.
- Bodyweight.
- Chest measurement.
- Waist measurement.
- Pain/discomfort frequency.

Example:

Workouts completed: **42 / 46**

Consistency: **91%**

Push-up maximum: **20 → 31**

Goblet squat: **12 kg × 15 → 16 kg × 12**

Average RPE: **7.4 → 6.3**

Current Level: **Advanced Novice**

Performance Grade: **Strong**

---

# 42. Personal Records

BellGrinda shall automatically detect supported Personal Records.

Potential records:

- Maximum continuous push-ups.
- Highest kettlebell load by exercise.
- Most repetitions at a specific weight.
- Fastest circuit completion.
- Longest workout streak.
- Highest completion percentage.
- Highest work-capacity result.
- Best assessment result.

Personal Records should reinforce progress without dominating the training experience.

---

# 43. AI Product Philosophy

BellGrinda AI shall primarily function as:

- Analyst.
- Explainer.
- Progress interpreter.
- Coach.
- Voice interface.
- Report generator.

The deterministic Training Engine remains authoritative for training prescription.

---

# 44. AI Responsibility Boundaries

AI may:

- Explain workout modifications.
- Analyze completed workouts.
- Summarize performance.
- Analyze progress trends.
- Generate biweekly reports.
- Answer questions about BellGrinda training history.
- Provide short workout coaching cues.
- Explain deterministic progression decisions.

AI shall not independently:

- Create unrestricted workout prescriptions.
- Override pain safeguards.
- Diagnose injuries.
- Automatically promote Training Levels.
- Invent unsupported exercises.
- Increase load without Training Engine approval.

---

# 45. V1 AI Scope

BellGrinda V1 shall include:

1. AI Workout Recap.
2. AI Biweekly Progress Analysis.
3. Conversational BellGrinda Coach.
4. AI/TTS Voice Workout Guidance.

---

# 46. Deferred V1.1 AI Features

The following should be deferred until the core training experience has been validated:

- Voice workout logging.
- Uploaded-video form analysis.
- AI technique scoring.
- Technique-history comparisons.
- Advanced multimodal coaching.

The architecture should permit these to be added without replacing the core Training Engine.

---

# 47. AI Provider Architecture

BellGrinda shall not depend on one AI provider.

Potential initial providers include:

- Mistral.
- Google Gemini.
- NVIDIA Nemotron models.
- DeepSeek V4.1 Flash through NVIDIA.
- NVIDIA Magpie TTS Zeroshot.

AI provider implementations should be abstracted behind common application interfaces.

Example concept:

AI Provider Layer

→ Gemini Provider  
→ Mistral Provider  
→ NVIDIA Provider  
→ Future Provider

A provider changing pricing or availability must not require a major application rewrite.

---

# 48. AI Routing Strategy

BellGrinda may route tasks according to model capabilities.

## Fast Text Tasks

Examples:

- Short explanations.
- Workout recaps.
- Basic coaching.

Potential models:

- Mistral.
- Gemini.

## Reasoning Tasks

Examples:

- Biweekly analysis.
- Progress reports.
- Assessment interpretation.

Potential model:

- DeepSeek V4.1 Flash or equivalent reasoning model.

## Multimodal Tasks

Deferred to V1.1.

Potential future use:

- Form analysis.
- Image/video analysis.

Potential model:

- Nemotron multimodal models or equivalent.

## Voice

Potential TTS model:

- Magpie TTS Zeroshot or equivalent.

---

# 49. AI Workout Recap

Following workout completion, BellGrinda may generate an AI recap using structured session data.

Inputs may include:

- Planned workout.
- Completed rounds.
- Completed reps.
- Weights.
- RPE.
- Skipped exercises.
- Substitutions.
- Pain reports.
- Recent workout history.

Output should identify:

- Good performance.
- Performance decline.
- Fatigue patterns.
- Meaningful improvements.
- Areas requiring attention.
- Relevant progression context.

AI should avoid generic praise unsupported by data.

---

# 50. AI Biweekly Assessment

BellGrinda shall generate an AI report following each biweekly assessment.

Potential analysis:

- Training consistency.
- Strength trend.
- Endurance trend.
- Conditioning trend.
- Push-up progression.
- Exercise progression.
- Plateaus.
- Pain flags.
- Personal Records.
- Recommended focus.

Reports should be stored historically.

---

# 51. Conversational BellGrinda Coach

BellGrinda shall provide a conversational AI interface.

The AI should have controlled access to relevant training data.

Examples:

- Why did my reps decrease?
- Why am I still using 12 kg for presses?
- When did I last improve my push-ups?
- Why was Friday's workout reduced?
- How many sessions have I missed?
- Which exercise improved most?
- Why was my kettlebell swing flagged?
- What Training Level am I on?
- What is my current Performance Grade?

The AI shall use actual BellGrinda data when answering user-specific questions.

---

# 52. Voice Workout Guidance

BellGrinda V1 shall support optional workout voice guidance.

Possible announcements:

- Current round.
- Exercise name.
- Repetition target.
- Prescribed load.
- Rest duration.
- Upcoming exercise.
- Short technique cues.
- Workout completion.
- Personal Record notification.

Voice messaging shall remain concise.

User preferences may include:

- Voice enabled/disabled.
- Coaching frequency.
- Coaching style.

Potential future styles:

- Calm.
- Motivational.
- Strict.
- Minimal.
- Competitive.

---

# 53. Offline-First PWA Requirements

The core BellGrinda training experience must function without active internet access.

Offline functionality should include:

- Current Dashboard snapshot.
- Today's Workout.
- Workout Player.
- Exercise instructions.
- Cached demonstration media where practical.
- Timers.
- Workout logging.
- Active-session persistence.
- Workout history.
- Assessment history.
- Current program.
- Progression-related local data.

AI functionality may require internet connectivity.

Core training must not.

---

# 54. Local Data Architecture

BellGrinda V1 should use a local-first architecture.

Critical structured data should be stored in a browser database suitable for PWA offline use.

Conceptual storage strategy:

## Application State

React application state / state-management layer.

## Persistent Local Data

IndexedDB or equivalent.

Potential local data includes:

- Active workout.
- Workout history.
- Assessments.
- Equipment.
- Training plan.
- Exercise metadata.
- Sync queue.
- Progression state.

## Lightweight Preferences

Small user preferences may use simpler persistent storage.

Examples:

- Theme.
- Voice enabled.
- Coaching style.

---

# 55. Synchronization

When connectivity becomes available:

Local changes

↓

Synchronization queue

↓

Backend

↓

Confirmation

BellGrinda should avoid:

- Duplicate workout records.
- Missing sessions.
- Duplicate assessments.
- Lost progress.

The local version of an active workout shall remain usable even while synchronization is unavailable.

---

# 56. Future Multi-User Readiness

Although V1 is designed for one user, core records should support a user identifier.

The system should avoid singleton-only database structures.

Potential entities:

- User.
- UserProfile.
- Equipment.
- Exercise.
- WorkoutTemplate.
- WorkoutPlan.
- WorkoutSession.
- ExerciseSession.
- Assessment.
- PerformanceTest.
- PainLog.
- PersonalRecord.
- AIInsight.
- TrainingLevel.
- TrainingPhase.

This reduces migration effort when commercial multi-user functionality is introduced.

---

# 57. December 31 Initial Assessment

December 31 shall trigger the first major BellGrinda Initial Assessment.

The assessment shall review two areas.

## Fitness Progress

Including:

- Training consistency.
- Planned workouts.
- Completed workouts.
- Completion rate.
- Strength progression.
- Push-up progression.
- Conditioning.
- Work capacity.
- Kettlebell progression.
- Personal Records.
- Pain/discomfort history.
- Current Training Level.
- Current Performance Grade.
- Bodyweight trend.
- Chest measurement trend.
- Waist measurement trend.

## BellGrinda Product Performance

Including:

- How consistently BellGrinda was used.
- Number of abandoned workouts.
- Number of resumed workouts.
- Frequency of phone-lock/session restoration.
- Most-used features.
- Rarely used features.
- AI reports viewed.
- AI recommendations ignored.
- Exercises frequently substituted.
- Workout Player usability.
- Voice coaching usefulness.
- Offline reliability.
- Logging friction.
- Progression-engine usefulness.
- Features that should be removed.
- Features that should be added.

The Initial Assessment therefore acts as both:

**Fitness Evaluation**

and

**BellGrinda Product Validation**

---

# 58. Primary User Journey

## First Launch

Launch BellGrinda.

↓

Complete baseline setup.

↓

Confirm equipment.

↓

Create initial Novice training profile.

↓

Dashboard.

---

## Daily Workout Flow

Dashboard.

↓

Today's Workout.

↓

Review.

↓

Start Workout.

↓

Workout Player.

↓

BellGrinda persists session continuously.

↓

Phone may lock or application may suspend.

↓

BellGrinda restores active session.

↓

Continue Workout.

↓

Complete Workout.

↓

Enter RPE.

↓

Record discomfort/notes if applicable.

↓

AI Workout Recap.

↓

Dashboard and progress updated.

---

## Biweekly Flow

Assessment becomes due.

↓

Complete assessment.

↓

Update performance history.

↓

AI Biweekly Report.

↓

Dashboard updated.

---

## Level Completion Flow

Training Level duration completed.

↓

Optional Performance Test.

↓

Review performance.

↓

Choose:

Advance

or

Repeat Phase 3.

---

## December Flow

December 31.

↓

Generate Initial Assessment.

↓

Review fitness progress.

↓

Review product effectiveness.

↓

Determine next BellGrinda training cycle.

---

# 59. V1 Success Metrics

BellGrinda V1 shall be considered successful if it can reliably:

- Guide five weekly workouts.
- Preserve active workouts across phone locks.
- Restore sessions after browser reloads.
- Continue operating offline.
- Record training history without data loss.
- Apply deterministic progression.
- Track kettlebell progression.
- Track push-up progression.
- Account for football load.
- Record jogging activity.
- Identify recurring discomfort.
- Provide useful biweekly assessments.
- Generate useful AI reports.
- Produce a December Initial Assessment.
- Remain convenient enough to use consistently.

An impressive technical implementation that creates unnecessary friction during workouts shall be considered a product failure.

---

# 60. Product Risks

## Scope Creep

Risk:

Too many future commercial features enter V1.

Mitigation:

Keep V1 focused on personal training-system validation.

## AI Overreach

Risk:

AI generates inconsistent or unsafe training decisions.

Mitigation:

Training progression remains deterministic.

## Poor Workout UX

Risk:

Too many interactions interrupt training.

Mitigation:

Minimize taps and automate logging where possible.

## Lost Workout State

Risk:

Phone locking, browser suspension, refresh, crashes, or OS termination destroy the active session.

Mitigation:

Continuously persist critical workout state locally and restore sessions from durable storage.

## Timer Drift

Risk:

Timers become incorrect when the phone sleeps.

Mitigation:

Use timestamps instead of relying solely on active countdown loops.

## Excessive Training Volume

Risk:

Push-up and circuit volume accumulate excessively.

Mitigation:

Monitor RPE, volume, difficulty, and discomfort.

## Lower-Back Discomfort

Risk:

Swing-related discomfort becomes worse.

Mitigation:

Pain tracking, conservative progression, substitutions, and technique reassessment.

## Free AI Dependency

Risk:

Free model endpoints change limits, pricing, or availability.

Mitigation:

Provider abstraction and fallback routing.

## Offline Media Storage

Risk:

Exercise videos consume excessive device storage.

Mitigation:

Selective video caching and configurable offline-media storage.

---

# 61. Product Principles

BellGrinda development shall follow these principles:

1. Training reliability is more important than AI novelty.
2. Core workout functionality must work offline.
3. An active workout must survive normal mobile interruptions.
4. Workout UX must remain simple.
5. AI should explain and assist rather than unpredictably control.
6. Progression must remain measurable.
7. User logging effort should remain low.
8. Pain signals must never be gamified.
9. Equipment progression must be exercise-specific.
10. Training Level and Performance Grade are separate concepts.
11. Time-based training progression does not automatically equal physical mastery.
12. BellGrinda should prepare for future expansion without building the entire commercial product in V1.

---

# 62. V1 Core Modules

BellGrinda V1 shall contain:

1. Baseline & Profile.
2. Equipment Management.
3. Exercise Library.
4. Training Level System.
5. Performance Grade System.
6. Workout Planning.
7. Guided Workout Player.
8. Active Session Persistence.
9. Phone-Lock / App-Resume Recovery.
10. Workout Logging.
11. Progression Engine.
12. Pain & Safety Tracking.
13. Performance Testing.
14. Reinforcement Blocks.
15. Biweekly Assessments.
16. Progress Analytics.
17. Personal Records.
18. AI Workout Recap.
19. AI Biweekly Analysis.
20. Conversational AI Coach.
21. Voice Workout Guidance.
22. Offline PWA Layer.
23. Synchronization Layer.
24. December Initial Assessment.

---

# 63. V1.1 Candidate Features

Potential V1.1 additions:

- Voice workout logging.
- Speech-to-structured-data extraction.
- Uploaded exercise video analysis.
- Technique tracking.
- Technique-history comparison.
- More advanced multimodal AI coaching.

---

# 64. Future Commercial Features

Future versions may add:

- Authentication.
- Multiple users.
- Subscription billing.
- Additional equipment systems.
- Additional training programs.
- Wearables.
- Social/community functionality.
- Trainer tools.
- Advanced adaptive programming.
- Live computer-vision coaching.
- Native mobile applications.
- Commercial analytics.

---

# 65. Remaining Training Decisions

Before BellGrinda's Training Engine can be implemented, the following must be defined:

- Exact Novice duration.
- Exact Advanced Novice duration.
- Exact Intermediate duration.
- Advanced framework.
- Grandmaster framework.
- Duration of each phase.
- Core exercises.
- Rotating exercises.
- Workout variations.
- Exact repetition ranges.
- Rest periods.
- Warm-up structure.
- Cooldown structure.
- Progression thresholds.
- Regression thresholds.
- Load-transition rules.
- 12 kg → 16 kg → 20 kg behavior.
- Push-up progression.
- Football competition adjustments.
- RPE rules.
- Pain-response rules.
- Performance-test design.
- Performance Grade scoring.
- Reinforcement-block generation.

---

# 66. Remaining Technical Decisions

Before implementation begins, BellGrinda must define:

- Frontend architecture.
- State-management solution.
- IndexedDB abstraction.
- Backend architecture.
- Database.
- PWA service-worker strategy.
- Local synchronization design.
- Exercise video hosting.
- Offline video-caching strategy.
- AI provider abstraction.
- AI fallback routing.
- TTS implementation.
- Deployment architecture.
- Data backup strategy.

---

# 67. Recommended Next Planning Stage

The next planning stage shall be:

# BellGrinda Training System Specification

This specification will define the actual training engine BellGrinda automates.

It must cover:

- Novice programming.
- Advanced Novice programming.
- Intermediate programming.
- Advanced progression framework.
- Grandmaster progression framework.
- Three phases per level.
- Monday–Friday workout structure.
- Core movements.
- Rotating exercises.
- Exact repetition ranges.
- Rest periods.
- Warm-up.
- Cooldown.
- Push-up progression.
- Kettlebell progression.
- 12 kg → 16 kg → 20 kg transitions.
- Football-day adjustments.
- RPE logic.
- Pain/discomfort logic.
- Performance tests.
- Performance Grade calculation.
- Repeat-final-third rules.
- December Initial Assessment training criteria.

The Training System Specification must be completed before BellGrinda's core Training Engine is implemented.
