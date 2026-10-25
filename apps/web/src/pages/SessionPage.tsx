import { useEffect, useState } from "react";
import { Check } from "@phosphor-icons/react/Check";
import { Pause } from "@phosphor-icons/react/Pause";
import { Play } from "@phosphor-icons/react/Play";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { SkipForward } from "@phosphor-icons/react/SkipForward";
import { Warning } from "@phosphor-icons/react/Warning";
import { X } from "@phosphor-icons/react/X";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getSessionCompletedSets, getSessionCompletionPercentage, getSessionDurationSeconds, getSessionSkippedSets, type BodyLocation, type PainEvent, type PainSeverity, type WorkoutSession } from "@bellgrinda/domain";
import { createPerformanceSnapshot, decidePainAction, detectSessionPersonalRecords, evaluateProgression, type PainDecision } from "@bellgrinda/training-engine";
import { ExerciseDemo } from "../components/ExerciseDemo";
import { getExerciseMedia } from "../media/exerciseMedia";
import { getMovementCues } from "../media/exerciseGuide";
import { painEventRepository, performanceSnapshotRepository, personalRecordRepository, progressionDecisionRepository, sessionRepository } from "../persistence/database";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setActiveSession } from "../state/store";

const timestamp = () => new Date().toISOString();
const targetNumber = (target: string) => Number(target.match(/\d+/)?.[0] ?? 0);
const targetUnit = (target: string) => target.toLowerCase().includes("per side") || target.toLowerCase().includes("per arm") || target.toLowerCase().includes("per leg")
  ? "reps per side"
  : target.toLowerCase().includes("skip") ? "skips"
    : target.toLowerCase().includes("minute") ? "minutes"
      : target.toLowerCase().includes("cycle") ? "cycles per side" : "reps";
const actualTargetText = (target: string, value: number) => `${value} ${targetUnit(target)}`;
const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
const locations: { value: BodyLocation; label: string }[] = [
  { value: "lower_back", label: "Lower back" },
  { value: "shoulder", label: "Shoulder" },
  { value: "elbow", label: "Elbow" },
  { value: "wrist", label: "Wrist" },
  { value: "hip", label: "Hip" },
  { value: "knee", label: "Knee" },
  { value: "ankle", label: "Ankle" },
  { value: "other", label: "Other" }
];

function SessionReview({ session }: { session: WorkoutSession }) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.app.profile);
  const navigate = useNavigate();
  const [rpe, setRpe] = useState<number | null>(session.rpe);
  const [notes, setNotes] = useState(session.notes);
  const [saving, setSaving] = useState(false);
  const completed = getSessionCompletedSets(session);
  const skipped = getSessionSkippedSets(session);
  const planned = session.workout.rounds * session.workout.exercises.length;
  const duration = getSessionDurationSeconds(session);

  const finalize = async () => {
    if (saving) return;
    setSaving(true);
    const completedAt = timestamp();
    const finalStatus = session.completionType === "partial" ? "partial" as const : "completed" as const;
    const next: WorkoutSession = {
      ...session,
      status: finalStatus,
      completionType: finalStatus,
      completedAt,
      updatedAt: completedAt,
      durationSeconds: getSessionDurationSeconds(session, new Date(completedAt)),
      rpe,
      notes: notes.trim()
    };
    await sessionRepository.save(next);
    const [recentSessions, painEvents, records, snapshots] = await Promise.all([sessionRepository.listHistory(), painEventRepository.listAll(), personalRecordRepository.list(), performanceSnapshotRepository.list()]);
    const availableLoadsKg = profile?.equipment.flatMap((item) => item === "kettlebell_12" ? [12] : []) ?? [];
    const decisions = evaluateProgression({ currentSession: next, recentSessions, painEvents, availableLoadsKg });
    const newRecords = detectSessionPersonalRecords(next, records);
    const snapshot = createPerformanceSnapshot({ sessions: recentSessions, previousSnapshots: snapshots, sourceSessionId: next.id });
    await Promise.all([progressionDecisionRepository.saveMany(decisions), personalRecordRepository.saveMany(newRecords), performanceSnapshotRepository.save(snapshot)]);
    dispatch(setActiveSession(null));
    navigate("/history", { state: { completed: finalStatus === "completed", detailId: next.id } });
  };

  return <main className="review-screen">
    <section className="session-review">
      <p className="kicker">{session.completionType === "partial" ? "Partial session saved" : "Workout complete"}</p>
      <h1>Review your work.</h1>
      <p>Your actual sets are already safe on this device. Add effort and context before finalizing.</p>
      <div className="review-stats">
        <span><strong>{completed}/{planned}</strong> sets completed</span>
        <span><strong>{getSessionCompletionPercentage(session)}%</strong> completion</span>
        <span><strong>{formatDuration(duration)}</strong> duration</span>
        <span><strong>{skipped}</strong> skipped</span>
      </div>
      <section className="review-work"><h2>Recorded work</h2>{session.setLogs.length ? <div className="review-set-list">{session.setLogs.map((log, index) => <div key={`${log.exerciseId}-${log.round}-${index}`}><span>Round {log.round}</span><strong>{log.exerciseName}</strong><small>{log.status === "skipped" ? "Skipped" : `${log.actualTarget ?? log.plannedTarget}${log.actualLoadKg !== null ? ` · ${log.actualLoadKg} kg` : ""}`}</small></div>)}</div> : <p>No completed sets were recorded.</p>}</section>
      <fieldset className="rpe-field"><legend>How hard was this workout?</legend><p>1 is very easy. 10 is maximum effort.</p><div>{Array.from({ length: 10 }, (_, index) => index + 1).map((value) => <button key={value} type="button" aria-pressed={rpe === value} onClick={() => setRpe(value)}>{value}</button>)}</div><button className="rpe-clear" type="button" onClick={() => setRpe(null)}>Skip RPE for now</button></fieldset>
      <label className="field">Workout notes <span className="optional">Optional</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} placeholder="What felt strong? What should change next time?" /></label>
      <button className="button primary" disabled={saving} onClick={finalize}>{saving ? "Finalizing…" : "Finalize workout"}</button>
    </section>
  </main>;
}

export function SessionPage() {
  const session = useAppSelector((state) => state.app.activeSession);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPainReport, setShowPainReport] = useState(false);
  const [severity, setSeverity] = useState<PainSeverity>("mild");
  const [bodyLocation, setBodyLocation] = useState<BodyLocation>("lower_back");
  const [notes, setNotes] = useState("");
  const [decision, setDecision] = useState<PainDecision | null>(null);
  const [reportedSession, setReportedSession] = useState<WorkoutSession | null>(null);
  const [showEndWorkout, setShowEndWorkout] = useState(false);
  const [endReason, setEndReason] = useState("");
  const [actualReps, setActualReps] = useState(0);
  const [actualLoadKg, setActualLoadKg] = useState<number | null>(null);
  const [savingSet, setSavingSet] = useState(false);

  useEffect(() => {
    const exercise = session?.workout.exercises[session.currentExerciseIndex];
    if (!exercise) return;
    setActualReps(targetNumber(exercise.target));
    setActualLoadKg(exercise.loadKg);
  }, [session?.currentExerciseIndex, session?.currentRound, session?.workout.exercises]);

  if (!session) return <Navigate to="/" replace />;
  if (session.status === "review_pending") return <SessionReview session={session} />;
  const current = session.workout.exercises[session.currentExerciseIndex]!;
  const currentMedia = getExerciseMedia(current.id);
  const nextExercise = session.workout.exercises[session.currentExerciseIndex + 1] ?? (session.currentRound < session.workout.rounds ? session.workout.exercises[0] : undefined);
  const total = session.workout.rounds * session.workout.exercises.length;
  const completed = getSessionCompletedSets(session);
  const progress = Math.round((completed / total) * 100);

  const persist = async (next: WorkoutSession) => {
    dispatch(setActiveSession(next));
    await sessionRepository.save(next);
  };

  const advance = async (base = session, skipped = false) => {
    if (savingSet) return;
    setSavingSet(true);
    const recordedAt = timestamp();
    const exercise = base.workout.exercises[base.currentExerciseIndex]!;
    const actualTarget = skipped ? null : actualTargetText(exercise.target, actualReps);
    const logs = base.exerciseLogs.map((log, index) => index === base.currentExerciseIndex
      ? { ...log, completedRounds: skipped ? log.completedRounds : log.completedRounds + 1, skipped: log.skipped || skipped, actualTarget: actualTarget ?? log.actualTarget }
      : log);
    const setLogs = [...(base.setLogs ?? []).filter((log) => !(log.round === base.currentRound && log.exerciseId === exercise.id)), {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      round: base.currentRound,
      status: skipped ? "skipped" as const : "completed" as const,
      plannedTarget: exercise.target,
      actualTarget,
      actualReps: skipped ? null : actualReps,
      plannedLoadKg: exercise.loadKg,
      actualLoadKg: skipped ? null : actualLoadKg,
      recordedAt
    }];
    const isLastExercise = base.currentExerciseIndex === base.workout.exercises.length - 1;
    const isLastRound = base.currentRound === base.workout.rounds;
    if (isLastExercise && isLastRound) {
      const next = { ...base, exerciseLogs: logs, setLogs, status: "review_pending" as const, completionType: "completed" as const, updatedAt: recordedAt };
      await persist(next);
      setSavingSet(false);
      return;
    }
    await persist({
      ...base,
      exerciseLogs: logs,
      setLogs,
      status: "active",
      currentExerciseIndex: isLastExercise ? 0 : base.currentExerciseIndex + 1,
      currentRound: isLastExercise ? base.currentRound + 1 : base.currentRound,
      updatedAt: recordedAt
    });
    closePainReport();
    setSavingSet(false);
  };

  const closePainReport = () => {
    setShowPainReport(false);
    setDecision(null);
    setReportedSession(null);
    setNotes("");
  };

  const submitPainReport = async () => {
    const occurredAt = timestamp();
    const event: PainEvent = {
      id: crypto.randomUUID(),
      sessionId: session.id,
      exerciseId: current.id,
      bodyLocation,
      severity,
      source: "workout",
      round: session.currentRound,
      notes: notes.trim(),
      occurredAt
    };
    const nextDecision = decidePainAction(severity, Boolean(current.substitution));
    let next: WorkoutSession = {
      ...session,
      status: "paused",
      painEventIds: [...session.painEventIds, event.id],
      updatedAt: occurredAt
    };

    if (nextDecision.action === "substitute" && current.substitution) {
      const substituteName = current.substitution;
      next = {
        ...next,
        workout: {
          ...next.workout,
          exercises: next.workout.exercises.map((exercise, index) => index === next.currentExerciseIndex ? {
            ...exercise,
            id: `${exercise.id}-substitute`,
            name: substituteName,
            category: "recovery",
            target: "8 controlled reps",
            loadKg: substituteName === "Glute bridge" ? null : exercise.loadKg,
            note: "Move slowly. Stop if discomfort remains.",
            substitution: undefined
          } : exercise)
        },
        substitutions: [...next.substitutions, {
          exerciseId: current.id,
          substituteName,
          reason: "pain",
          round: session.currentRound,
          occurredAt
        }]
      };
    }

    await painEventRepository.recordForSession(event, next);
    dispatch(setActiveSession(next));
    setReportedSession(next);
    setDecision(nextDecision);
  };

  const continueSafely = async () => {
    if (!reportedSession) return;
    await persist({ ...reportedSession, status: "active", updatedAt: timestamp() });
    closePainReport();
  };

  const endForPain = async () => {
    const base = reportedSession ?? session;
    const updatedAt = timestamp();
    await persist({ ...base, status: "review_pending", completionType: "partial", endReason: "Stopped because of reported discomfort.", updatedAt });
  };

  const completeAsPartial = async () => {
    const updatedAt = timestamp();
    await persist({ ...session, status: "review_pending", completionType: "partial", endReason: endReason.trim(), updatedAt });
    setShowEndWorkout(false);
  };

  const abandonWorkout = async () => {
    const completedAt = timestamp();
    const next: WorkoutSession = {
      ...session,
      status: "abandoned",
      completionType: "abandoned",
      endReason: endReason.trim(),
      completedAt,
      updatedAt: completedAt,
      durationSeconds: getSessionDurationSeconds(session, new Date(completedAt))
    };
    await sessionRepository.save(next);
    dispatch(setActiveSession(null));
    navigate("/history", { state: { detailId: next.id } });
  };

  const togglePause = () => persist({ ...session, status: session.status === "paused" ? "active" : "paused", updatedAt: timestamp() });

  return (
    <main className="session-screen">
      <header className="session-header">
        <Link to="/" className="icon-button" aria-label="Back to training, keeping this session saved"><ArrowLeft size={20} /></Link>
        <div><span>Round {session.currentRound} of {session.workout.rounds}</span><strong>{completed} sets completed</strong></div>
        <button className="icon-button" onClick={togglePause} aria-label={session.status === "paused" ? "Resume workout" : "Pause workout"}>{session.status === "paused" ? <Play size={20} weight="fill" /> : <Pause size={20} weight="fill" />}</button>
      </header>
      <div className="progress-line" aria-label={`${progress}% complete`}><span style={{ width: `${progress}%` }} /></div>
      <section className="exercise-stage">
        <div className="session-stage-heading"><p className="kicker">Exercise {session.currentExerciseIndex + 1} of {session.workout.exercises.length}</p><button type="button" onClick={() => setShowEndWorkout(true)}>End workout</button></div>
        <h1>{current.name}</h1>
        <div className="prescription"><strong>{current.target}</strong>{current.loadKg ? <span>{current.loadKg} kg</span> : <span>Bodyweight</span>}</div>
        <div className="actual-entry" aria-label="Actual set details">
          <label>Actual {targetUnit(current.target)}<input type="number" inputMode="numeric" min="0" max="999" value={actualReps} onChange={(event) => setActualReps(Math.max(0, Number(event.target.value)))} /></label>
          {current.loadKg !== null ? <label>Actual load<input type="number" inputMode="decimal" min="0" max="200" step="0.5" value={actualLoadKg ?? ""} onChange={(event) => setActualLoadKg(event.target.value === "" ? null : Math.max(0, Number(event.target.value)))} /><span>kg</span></label> : null}
          <small>Defaults to today&apos;s prescription. Change only what you actually completed.</small>
        </div>
        {current.note ? <div className="technique-note"><Warning size={20} /><p>{current.note}</p></div> : null}
        {currentMedia && session.status === "active" && !showPainReport ? <ExerciseDemo key={`${current.id}-${session.currentRound}`} media={currentMedia} exerciseName={current.name} compact /> : null}
        <details className="cue-details" key={current.id} open={!currentMedia}><summary>Focus on your form</summary><ol className="cue-list">{getMovementCues(current).map((cue) => <li key={cue}>{cue}</li>)}</ol></details>
        <div className="next-exercise"><div><small>Up next</small><strong>{nextExercise?.name ?? "Workout complete"}</strong></div><span>{nextExercise?.target ?? "Finish this set"}</span></div>
        {session.status === "paused" && !showPainReport ? <div className="paused-overlay"><p>Workout paused</p><button className="button light" onClick={togglePause}>Resume</button><button className="button danger" onClick={() => setShowEndWorkout(true)}>End workout</button></div> : null}
      </section>
      <footer className="session-actions">
        <button className="button subtle" disabled={session.status !== "active" || savingSet} onClick={() => advance(session, true)}><SkipForward size={19} /> Skip</button>
        <button className="complete-button" disabled={session.status !== "active" || savingSet} onClick={() => advance(session, false)}><Check size={24} weight="bold" /><span>{savingSet ? "Saving…" : "Complete set"}</span></button>
        <button className="button subtle danger" onClick={() => setShowPainReport(true)}><Warning size={19} /> Discomfort</button>
      </footer>

      {showPainReport ? <div className="modal-backdrop" role="presentation">
        <section className="safety-dialog" role="dialog" aria-modal="true" aria-labelledby="pain-dialog-title">
          {!decision ? <>
            <button className="icon-button dialog-close" onClick={closePainReport} aria-label="Close discomfort report"><X size={20} /></button>
            <p className="kicker">Safety check</p>
            <h2 id="pain-dialog-title">Stop and assess the discomfort.</h2>
            <p>Record what you feel. Pain rules override today&apos;s workout plan.</p>
            <div className="dialog-fields">
              <label className="field">Severity
                <select value={severity} onChange={(event) => setSeverity(event.target.value as PainSeverity)}>
                  <option value="mild">Mild</option><option value="moderate">Moderate</option><option value="severe">Severe</option>
                </select>
              </label>
              <label className="field">Location
                <select value={bodyLocation} onChange={(event) => setBodyLocation(event.target.value as BodyLocation)}>
                  {locations.map((location) => <option key={location.value} value={location.value}>{location.label}</option>)}
                </select>
              </label>
              <label className="field">Notes <span className="optional">Optional</span>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={240} placeholder="What movement caused it?" />
              </label>
            </div>
            <button className="button primary" onClick={submitPainReport}>Record and get guidance</button>
          </> : <>
            <p className="kicker">Recorded locally</p>
            <h2 id="pain-dialog-title">{decision.mustStopMovement ? "Do not continue this movement." : "Reassess before continuing."}</h2>
            <p>{decision.guidance}</p>
            <div className="safety-actions">
              {decision.action === "end_session" ? <button className="button danger-solid" onClick={endForPain}>End workout safely</button> : <>
                {decision.action === "monitor" || decision.action === "substitute" ? <button className="button primary" onClick={continueSafely}>{decision.action === "substitute" ? `Use ${reportedSession?.workout.exercises[reportedSession.currentExerciseIndex]?.name}` : "Continue carefully"}</button> : null}
                <button className="button secondary" onClick={() => reportedSession && advance(reportedSession, true)}>Skip this exercise</button>
              </>}
            </div>
          </>}
        </section>
      </div> : null}
      {showEndWorkout ? <div className="modal-backdrop" role="presentation">
        <section className="safety-dialog" role="dialog" aria-modal="true" aria-labelledby="end-workout-title">
          <button className="icon-button dialog-close" onClick={() => setShowEndWorkout(false)} aria-label="Continue workout"><X size={20} /></button>
          <p className="kicker">End workout</p>
          <h2 id="end-workout-title">Keep the work you already did?</h2>
          <p>You completed {completed} of {total} planned sets. A partial workout remains useful training data; an abandoned workout keeps only a minimal record.</p>
          <label className="field">Reason <span className="optional">Optional</span><textarea value={endReason} onChange={(event) => setEndReason(event.target.value)} maxLength={500} placeholder="Short on time, low energy, interrupted…" /></label>
          <div className="safety-actions">
            <button className="button primary" onClick={completeAsPartial}>Complete as partial</button>
            <button className="button danger" onClick={abandonWorkout}>Abandon workout</button>
            <button className="button secondary" onClick={() => setShowEndWorkout(false)}>Continue training</button>
          </div>
        </section>
      </div> : null}
    </main>
  );
}
