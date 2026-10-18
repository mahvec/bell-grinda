import { useState } from "react";
import { Check } from "@phosphor-icons/react/Check";
import { Pause } from "@phosphor-icons/react/Pause";
import { Play } from "@phosphor-icons/react/Play";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { SkipForward } from "@phosphor-icons/react/SkipForward";
import { Warning } from "@phosphor-icons/react/Warning";
import { X } from "@phosphor-icons/react/X";
import { Link, Navigate, useNavigate } from "react-router-dom";
import type { BodyLocation, PainEvent, PainSeverity, WorkoutSession } from "@bellgrinda/domain";
import { decidePainAction, type PainDecision } from "@bellgrinda/training-engine";
import { ExerciseDemo } from "../components/ExerciseDemo";
import { getExerciseMedia } from "../media/exerciseMedia";
import { getMovementCues } from "../media/exerciseGuide";
import { painEventRepository, sessionRepository } from "../persistence/database";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setActiveSession } from "../state/store";

const timestamp = () => new Date().toISOString();
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

  if (!session) return <Navigate to="/" replace />;
  const current = session.workout.exercises[session.currentExerciseIndex]!;
  const currentMedia = getExerciseMedia(current.id);
  const nextExercise = session.workout.exercises[session.currentExerciseIndex + 1] ?? (session.currentRound < session.workout.rounds ? session.workout.exercises[0] : undefined);
  const total = session.workout.rounds * session.workout.exercises.length;
  const completed = session.exerciseLogs.reduce((sum, log) => sum + log.completedRounds, 0);
  const progress = Math.round((completed / total) * 100);

  const persist = async (next: WorkoutSession) => {
    dispatch(setActiveSession(next));
    await sessionRepository.save(next);
  };

  const advance = async (base = session, skipped = false) => {
    const logs = base.exerciseLogs.map((log, index) => index === base.currentExerciseIndex
      ? { ...log, completedRounds: skipped ? log.completedRounds : log.completedRounds + 1, skipped: log.skipped || skipped }
      : log);
    const isLastExercise = base.currentExerciseIndex === base.workout.exercises.length - 1;
    const isLastRound = base.currentRound === base.workout.rounds;
    if (isLastExercise && isLastRound) {
      const next = { ...base, exerciseLogs: logs, status: "completed" as const, completedAt: timestamp(), updatedAt: timestamp() };
      await sessionRepository.save(next);
      dispatch(setActiveSession(null));
      navigate("/history", { state: { completed: true } });
      return;
    }
    await persist({
      ...base,
      exerciseLogs: logs,
      status: "active",
      currentExerciseIndex: isLastExercise ? 0 : base.currentExerciseIndex + 1,
      currentRound: isLastExercise ? base.currentRound + 1 : base.currentRound,
      updatedAt: timestamp()
    });
    closePainReport();
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
    const next = { ...base, status: "partial" as const, completedAt: timestamp(), updatedAt: timestamp() };
    await sessionRepository.save(next);
    dispatch(setActiveSession(null));
    navigate("/history", { state: { painStopped: true } });
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
        <p className="kicker">Exercise {session.currentExerciseIndex + 1} of {session.workout.exercises.length}</p>
        <h1>{current.name}</h1>
        <div className="prescription"><strong>{current.target}</strong>{current.loadKg ? <span>{current.loadKg} kg</span> : <span>Bodyweight</span>}</div>
        {current.note ? <div className="technique-note"><Warning size={20} /><p>{current.note}</p></div> : null}
        {currentMedia && session.status === "active" && !showPainReport ? <ExerciseDemo key={`${current.id}-${session.currentRound}`} media={currentMedia} exerciseName={current.name} compact /> : null}
        <details className="cue-details" key={current.id} open={!currentMedia}><summary>Focus on your form</summary><ol className="cue-list">{getMovementCues(current).map((cue) => <li key={cue}>{cue}</li>)}</ol></details>
        <div className="next-exercise"><div><small>Up next</small><strong>{nextExercise?.name ?? "Workout complete"}</strong></div><span>{nextExercise?.target ?? "Finish this set"}</span></div>
        {session.status === "paused" && !showPainReport ? <div className="paused-overlay"><p>Workout paused</p><button className="button light" onClick={togglePause}>Resume</button></div> : null}
      </section>
      <footer className="session-actions">
        <button className="button subtle" disabled={session.status !== "active"} onClick={() => advance(session, true)}><SkipForward size={19} /> Skip</button>
        <button className="complete-button" disabled={session.status !== "active"} onClick={() => advance(session, false)}><Check size={24} weight="bold" /><span>Complete set</span></button>
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
    </main>
  );
}
