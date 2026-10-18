import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Play } from "@phosphor-icons/react/Play";
import { Check } from "@phosphor-icons/react/Check";
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { Link } from "react-router-dom";
import type { WorkoutSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { KettlebellArt } from "../components/KettlebellArt";
import { sessionRepository } from "../persistence/database";
import { useAppSelector } from "../state/hooks";

export function DashboardPage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const activeSession = useAppSelector((state) => state.app.activeSession);
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  const [historyError, setHistoryError] = useState(false);
  const [finished, setFinished] = useState<WorkoutSession[] | null>(null);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((now.getDay() + 6) % 7));
  const weekStart = start.toISOString();
  useEffect(() => {
    void Promise.all([sessionRepository.listRecent(), sessionRepository.completedSince(weekStart)])
      .then(([recentSessions, weekSessions]) => { setSessions(recentSessions); setFinished(weekSessions); })
      .catch(() => setHistoryError(true));
  }, [weekStart]);
  const dates = Array.from({ length: 7 }, (_, index) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + index));
  const trained = new Set(finished?.map((session) => new Date(session.completedAt ?? session.startedAt).toDateString()));
  const recent = sessions?.find((session) => ["completed", "partial", "abandoned"].includes(session.status));

  return <AppShell action={<Link className="avatar" to="/profile" aria-label="Your training profile">{profile.name.slice(0, 1).toUpperCase()}</Link>}>
    <header className="dashboard-hero">
      <div><p className="kicker">{new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(now)}</p><h1>Your time.<br /><span>Your strength.</span></h1><p>Let’s get moving, {profile.name}.</p></div>
      <span className="level-chip">Novice <span>Phase {profile.phase}</span></span>
    </header>
    <div className="dashboard-layout">
      <section className="training-card">
        <div className="training-card-copy">
          <p className="kicker">{activeSession ? "Pick up where you left off" : "Your next session"}</p>
          <h2>{activeSession ? activeSession.workout.title : <>Build your<br />foundation.</>}</h2>
          <p>{activeSession ? `Round ${activeSession.currentRound} of ${activeSession.workout.rounds}. Your progress is saved.` : "Kettlebell strength. Bodyweight control. A session shaped around you."}</p>
          <div className="training-tags"><span>12 kg kettlebell</span><span>{activeSession ? `${activeSession.workout.exercises.length} movements` : "Novice program"}</span></div>
          <Link className="button primary" to={activeSession ? "/session" : "/readiness"}><Play size={18} weight="fill" /> {activeSession ? "Resume workout" : "Let’s train"}<ArrowRight size={20} /></Link>
          <small>{activeSession ? "Continue your saved session" : "Start with a quick readiness check"}</small>
        </div>
        <div className="training-art"><KettlebellArt /><span>STRENGTH, ONE REP AT A TIME.</span></div>
      </section>
      <section className="week-panel">
        <div className="section-heading"><div><p className="kicker">Keep showing up</p><h2>Your week</h2></div><Link className="text-link" to="/history" aria-label="View workout activity"><ArrowRight size={22} /></Link></div>
        <div className="week-count"><strong>{finished ? finished.length.toString().padStart(2, "0") : "—"}</strong><span>workouts<br />completed this week</span></div>
        <div className="week-days">{dates.map((date) => <div key={date.toISOString()} className={`week-day${date.toDateString() === now.toDateString() ? " today" : ""}${trained.has(date.toDateString()) ? " trained" : ""}`} aria-label={`${date.toLocaleDateString("en", { weekday: "long" })}${trained.has(date.toDateString()) ? ", workout completed" : ""}`}><span>{date.toLocaleDateString("en", { weekday: "short" }).slice(0, 1)}</span><strong>{trained.has(date.toDateString()) ? <Check size={17} weight="bold" /> : date.getDate()}</strong></div>)}</div>
        <p className="week-note">{historyError ? "Your activity couldn’t load. Try opening Activity again." : finished?.length ? "Every session is a step forward. Recovery matters too." : "Your first session starts the story. Make it a good one."}</p>
      </section>
    </div>
    <div className="home-bottom">
      <Link className="library-link" to="/exercises"><span className="icon-tile"><BookOpen size={25} /></span><div><p className="kicker">Move with confidence</p><h2>Know your movements</h2><p>Exercise cues & full-body demos</p></div><ArrowRight size={22} /></Link>
      <section className="recent-session"><div className="section-heading"><h2>Last session</h2><Link className="text-link" to="/history">View all <ArrowRight size={16} /></Link></div>{recent ? <><h3>{recent.workout.title}</h3><p>{new Date(recent.startedAt).toLocaleDateString("en", { month: "short", day: "numeric" })} <span className="inline-dot">·</span> {recent.status}</p></> : <p>{sessions === null && !historyError ? "Loading your activity…" : historyError ? "Activity is unavailable right now." : "A fresh start. Your training record will grow with every session."}</p>}</section>
    </div>
  </AppShell>;
}
