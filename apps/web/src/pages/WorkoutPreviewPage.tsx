import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { Clock } from "@phosphor-icons/react/Clock";
import { Play } from "@phosphor-icons/react/Play";
import { ShieldCheck } from "@phosphor-icons/react/ShieldCheck";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { ExerciseDemo } from "../components/ExerciseDemo";
import { StatusBadge } from "../components/StatusBadge";
import { getExerciseMedia } from "../media/exerciseMedia";
import { getMovementCues } from "../media/exerciseGuide";
import { sessionRepository } from "../persistence/database";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setActiveSession } from "../state/store";

export function WorkoutPreviewPage() {
  const workout = useAppSelector((state) => state.app.preparedWorkout);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  if (!workout) return <Navigate to="/readiness" replace />;

  const start = async () => {
    const session = createSession(workout);
    await sessionRepository.save(session);
    dispatch(setActiveSession(session));
    navigate("/session");
  };

  return (
    <AppShell action={<Link className="icon-button" to="/readiness" aria-label="Back to readiness"><ArrowLeft size={22} /></Link>}>
      <div className="flow-steps"><span>01 Check in</span><span><strong>02 Your workout</strong></span><span>03 Train</span></div>
      <section className="workout-heading">
        <div><StatusBadge status={workout.readiness.status} score={workout.readiness.score} /><h1>{workout.title}</h1><p>{workout.focus}</p></div>
        <div className="workout-facts"><span><Clock size={18} /> {workout.estimatedMinutes} min</span><span>{workout.rounds} {workout.rounds === 1 ? "round" : "rounds"}</span></div>
      </section>
      <div className="guidance"><ShieldCheck size={22} /><p>{workout.readiness.guidance}</p></div>
      <div className="section-heading"><h2>Your movements</h2><span className="optional">Repeat for {workout.rounds} {workout.rounds === 1 ? "round" : "rounds"}</span></div>
      <ol className="exercise-list">
        {workout.exercises.map((item, index) => {
          const media = getExerciseMedia(item.id);
          return <li key={item.id}>
            <span className="exercise-number">{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{item.name}</h2><p>{item.target}{item.loadKg ? ` · ${item.loadKg} kg` : ""}</p>{item.note ? <small>{item.note}</small> : null}<details className="cue-details"><summary>Movement guide</summary><ol className="cue-list">{getMovementCues(item).map((cue) => <li key={cue}>{cue}</li>)}</ol></details>{media ? <ExerciseDemo media={media} exerciseName={item.name} /> : null}</div>
          </li>;
        })}
      </ol>
      <div className="sticky-action"><button className="button primary" onClick={start}><Play size={18} weight="fill" /> Start workout</button></div>
    </AppShell>
  );
}
