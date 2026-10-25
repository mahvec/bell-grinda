import { useState } from "react";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { Check } from "@phosphor-icons/react/Check";
import { Play } from "@phosphor-icons/react/Play";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { createSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { sessionRepository } from "../persistence/database";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setActiveSession } from "../state/store";

const warmup = [
  { name: "Easy march or skip", duration: "60 sec", cue: "Raise your temperature at a conversational pace." },
  { name: "Cat-cow", duration: "8 slow reps", cue: "Move gently through the spine; never force range." },
  { name: "Hip hinge reach", duration: "8 reps", cue: "Push the hips back and keep the ribs stacked." },
  { name: "Shoulder circles", duration: "8 each way", cue: "Use smooth circles and relaxed breathing." }
];

export function WarmupPage() {
  const workout = useAppSelector((state) => state.app.preparedWorkout);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [done, setDone] = useState<number[]>([]);
  const [starting, setStarting] = useState(false);
  if (!workout) return <Navigate to="/readiness" replace />;
  const toggle = (index: number) => setDone((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  const startWorkout = async () => {
    if (starting) return;
    setStarting(true);
    const session = createSession(workout);
    await sessionRepository.save(session);
    dispatch(setActiveSession(session));
    navigate("/session");
  };
  return <AppShell action={<Link className="icon-button" to="/workout" aria-label="Back to workout preview"><ArrowLeft size={22} /></Link>}>
    <div className="flow-steps"><span>01 Check in</span><span>02 Your workout</span><span><strong>03 Warm up</strong></span><span>04 Train</span></div>
    <header className="page-heading"><p className="kicker">About 4 minutes</p><h1>Prepare to move.</h1><p>Complete these gentle movements before the working rounds. Stop if a stretch causes pain.</p></header>
    <div className="warmup-list">{warmup.map((item, index) => <button type="button" key={item.name} aria-pressed={done.includes(index)} onClick={() => toggle(index)}><span className="warmup-check">{done.includes(index) ? <Check size={18} weight="bold" /> : String(index + 1).padStart(2, "0")}</span><span><strong>{item.name}</strong><small>{item.cue}</small></span><b>{item.duration}</b></button>)}</div>
    <section className="warmup-ready"><p>{done.length === warmup.length ? "Warm-up complete. Your workout timer starts when you continue." : `${done.length} of ${warmup.length} movements complete`}</p><button className="button primary" disabled={starting} onClick={startWorkout}><Play size={18} weight="fill" /> {starting ? "Starting…" : done.length === warmup.length ? "Start workout" : "Skip and start workout"}</button></section>
  </AppShell>;
}
