import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import { Play } from "@phosphor-icons/react/Play";
import { Check } from "@phosphor-icons/react/Check";
import { BookOpen } from "@phosphor-icons/react/BookOpen";
import { Clock } from "@phosphor-icons/react/Clock";
import { Link } from "react-router-dom";
import { getSessionCompletionPercentage, getSessionDurationSeconds, type ReadinessResult, type WorkoutSession } from "@bellgrinda/domain";
import { generateProgramWorkout } from "@bellgrinda/training-engine";
import { AppShell } from "../components/AppShell";
import { KettlebellArt } from "../components/KettlebellArt";
import { sessionRepository } from "../persistence/database";
import { useAppSelector } from "../state/hooks";

const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
const planningReadiness: ReadinessResult = { score: 80, status: "green", reasonCodes: ["SCHEDULE_PREVIEW"], guidance: "Your readiness check can still adjust this plan." };

export function DashboardPage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const activeSession = useAppSelector((state) => state.app.activeSession);
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  const [historyError, setHistoryError] = useState(false);
  const [finished, setFinished] = useState<WorkoutSession[] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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
  const selected = selectedDate ?? now;
  const selectedSession = sessions?.find((session) => new Date(session.startedAt).toDateString() === selected.toDateString());
  const selectedPlan = generateProgramWorkout(selected, planningReadiness, profile);
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const tomorrowPlan = generateProgramWorkout(tomorrow, planningReadiness, profile);

  return <AppShell action={<Link className="avatar" to="/profile" aria-label="Your training profile">{profile.name.slice(0, 1).toUpperCase()}</Link>}>
    <header className="dashboard-hero">
      <div><p className="kicker">{new Intl.DateTimeFormat("en", { weekday: "long", month: "short", day: "numeric" }).format(now)}</p><h1>Your time.<br /><span>Your strength.</span></h1><p>Let&apos;s get moving, {profile.name}.</p></div>
      <span className="level-chip">{profile.trainingLevel.replaceAll("_", " ")} <span>Phase {profile.phase}</span></span>
    </header>
    <div className="dashboard-layout">
      <section className="training-card">
        <div className="training-card-copy">
          <p className="kicker">{activeSession ? "Pick up where you left off" : "Your next session"}</p>
          <h2>{activeSession ? activeSession.workout.title : <>Build your<br />foundation.</>}</h2>
          <p>{activeSession ? `Round ${activeSession.currentRound} of ${activeSession.workout.rounds}. Your progress is saved.` : "Kettlebell strength. Bodyweight control. A session shaped around you."}</p>
          <div className="training-tags"><span>{profile.defaultKettlebellKg ?? 12} kg kettlebell</span><span>{activeSession ? `${activeSession.workout.exercises.length} movements` : `${profile.trainingLevel.replaceAll("_", " ")} program`}</span></div>
          <Link className="button primary" to={activeSession ? "/session" : "/readiness"}><Play size={18} weight="fill" /> {activeSession ? "Resume workout" : "Let&apos;s train"}<ArrowRight size={20} /></Link>
          <small>{activeSession ? "Continue your saved session" : "Start with a quick readiness check"}</small>
        </div>
        <div className="training-art"><KettlebellArt /><span>STRENGTH, ONE REP AT A TIME.</span></div>
      </section>
      <section className="week-panel">
        <div className="section-heading"><div><p className="kicker">Keep showing up</p><h2>Your week</h2></div><Link className="text-link" to="/history" aria-label="View workout activity"><ArrowRight size={22} /></Link></div>
        <div className="week-count"><strong>{finished ? finished.length.toString().padStart(2, "0") : "—"}</strong><span>workouts<br />completed this week</span></div>
        <div className="week-days">{dates.map((date) => <button type="button" key={date.toISOString()} onClick={() => setSelectedDate(date)} aria-pressed={selected.toDateString() === date.toDateString()} className={`week-day${date.toDateString() === now.toDateString() ? " today" : ""}${trained.has(date.toDateString()) ? " trained" : ""}`} aria-label={`${date.toLocaleDateString("en", { weekday: "long" })}${trained.has(date.toDateString()) ? ", workout completed" : ", view planned workout"}`}><span>{date.toLocaleDateString("en", { weekday: "short" }).slice(0, 1)}</span><strong>{trained.has(date.toDateString()) ? <Check size={17} weight="bold" /> : date.getDate()}</strong></button>)}</div>
        <div className="calendar-detail">
          <p className="kicker">{selected.toDateString() === now.toDateString() ? "Today" : selected.toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</p>
          {selectedSession ? <><h3>{selectedSession.workout.title}</h3><p>{getSessionCompletionPercentage(selectedSession)}% complete · {formatDuration(getSessionDurationSeconds(selectedSession))} · {selectedSession.status}</p><Link className="text-link" to="/history" state={{ detailId: selectedSession.id }}>See workout details <ArrowRight size={15} /></Link></> : <><h3>{selectedPlan.title}</h3><p>{selectedPlan.focus}</p><small>{selectedPlan.estimatedMinutes} min · {selectedPlan.rounds} rounds · {selectedPlan.exercises.length} movements</small></>}
        </div>
        <p className="week-note">{historyError ? "Your activity couldn't load. Try opening Activity again." : "Select a day to see its scheduled workout or training record."}</p>
      </section>
    </div>
    <div className="home-bottom">
      <Link className="library-link" to="/exercises"><span className="icon-tile"><BookOpen size={25} /></span><div><p className="kicker">Move with confidence</p><h2>Know your movements</h2><p>Exercise cues & full-body demos</p></div><ArrowRight size={22} /></Link>
      <section className="next-day-card"><div><p className="kicker">Tomorrow&apos;s preview</p><h2>{tomorrowPlan.title}</h2><p>{tomorrowPlan.focus}</p></div><div className="next-day-meta"><span><Clock size={16} /> {tomorrowPlan.estimatedMinutes} min</span><span>{tomorrowPlan.exercises.length} movements</span></div><ol>{tomorrowPlan.exercises.slice(0, 3).map((exercise) => <li key={exercise.id}>{exercise.name}<span>{exercise.target}</span></li>)}</ol></section>
      <section className="recent-session"><div className="section-heading"><h2>Last session</h2><Link className="text-link" to="/history">View all <ArrowRight size={16} /></Link></div>{recent ? <><h3>{recent.workout.title}</h3><p>{new Date(recent.startedAt).toLocaleDateString("en", { month: "short", day: "numeric" })} <span className="inline-dot">·</span> {recent.status}</p><strong className="session-duration"><Clock size={17} /> {formatDuration(getSessionDurationSeconds(recent))} total</strong></> : <p>{sessions === null && !historyError ? "Loading your activity…" : historyError ? "Activity is unavailable right now." : "A fresh start. Your training record will grow with every session."}</p>}</section>
    </div>
  </AppShell>;
}
