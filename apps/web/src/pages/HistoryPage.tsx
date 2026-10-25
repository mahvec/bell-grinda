import { useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { ClockCounterClockwise } from "@phosphor-icons/react/ClockCounterClockwise";
import { WarningCircle } from "@phosphor-icons/react/WarningCircle";
import { useLocation } from "react-router-dom";
import { getSessionCompletedSets, getSessionCompletionPercentage, getSessionDurationSeconds, getSessionSkippedSets, type ProgressionDecision, type WorkoutSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { progressionDecisionRepository, sessionRepository } from "../persistence/database";

const formatDuration = (seconds: number) => `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
const exerciseBreakdown = (session: WorkoutSession) => {
  const rows = new Map<string, { name: string; completed: number; skipped: number; load: number | null }>();
  for (const log of session.setLogs ?? []) {
    const row = rows.get(log.exerciseId) ?? { name: log.exerciseName, completed: 0, skipped: 0, load: null };
    if (log.status === "completed") row.completed += 1; else row.skipped += 1;
    if (log.actualLoadKg !== null) row.load = Math.max(row.load ?? 0, log.actualLoadKg);
    rows.set(log.exerciseId, row);
  }
  return [...rows.values()];
};

export function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  const [decisions, setDecisions] = useState<ProgressionDecision[]>([]);
  const location = useLocation();
  const detailId = (location.state as { detailId?: string } | null)?.detailId;
  useEffect(() => { void Promise.all([sessionRepository.listHistory(), progressionDecisionRepository.listAll()]).then(([history, progression]) => { setSessions(history); setDecisions(progression); }); }, []);
  const totalSeconds = sessions?.reduce((sum, session) => sum + getSessionDurationSeconds(session), 0) ?? 0;
  const totalSets = sessions?.reduce((sum, session) => sum + getSessionCompletedSets(session), 0) ?? 0;
  return (
    <AppShell>
      <section className="page-heading"><p className="kicker">Training record</p><h1>Workout history</h1><p>Completed, partial, and abandoned sessions remain on this device. Open any record to inspect the work performed.</p></section>
      {sessions?.length ? <section className="activity-overview"><span><strong>{sessions.length}</strong> sessions</span><span><strong>{formatDuration(totalSeconds)}</strong> total time</span><span><strong>{totalSets}</strong> completed sets</span><span><strong>{Math.round(sessions.reduce((sum, session) => sum + getSessionCompletionPercentage(session), 0) / sessions.length)}%</strong> avg completion</span></section> : null}
      {sessions === null ? <div className="skeleton-list" aria-label="Loading workout history"><span /><span /><span /></div> : sessions.length === 0 ? (
        <section className="empty-state"><ClockCounterClockwise size={34} /><h2>No sessions yet</h2><p>Your first finalized workout will appear here.</p></section>
      ) : (
        <div className="history-list">{sessions.map((session) => {
          const completed = getSessionCompletedSets(session);
          const skipped = getSessionSkippedSets(session);
          const completion = getSessionCompletionPercentage(session);
          const sessionDecisions = decisions.filter((decision) => decision.sessionId === session.id);
          return <details className="history-record" key={session.id} open={detailId === session.id}>
            <summary>
              {session.status === "completed" ? <CheckCircle size={24} weight="fill" /> : <WarningCircle size={24} weight="fill" />}
              <div><h2>{session.workout.title}</h2><p>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(session.startedAt))} · {completion}% complete · {session.rpe ? `RPE ${session.rpe}` : "No RPE"}</p></div>
              <span>{session.status}</span>
            </summary>
            <div className="history-detail">
              <div className="history-metrics"><span><strong>{completed}</strong> completed</span><span><strong>{skipped}</strong> skipped</span><span><strong>{formatDuration(getSessionDurationSeconds(session))}</strong> duration</span><span><strong>{session.workout.rounds}</strong> planned rounds</span></div>
              <section className="session-context"><div><small>Focus</small><strong>{session.workout.focus}</strong></div><div><small>Readiness</small><strong>{session.workout.readiness.score}/100 · {session.workout.readiness.status}</strong></div><div><small>Started</small><strong>{new Date(session.startedAt).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}</strong></div><div><small>Finished</small><strong>{session.completedAt ? new Date(session.completedAt).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" }) : "Not finalized"}</strong></div></section>
              {exerciseBreakdown(session).length ? <section><h3>Movement breakdown</h3><div className="movement-breakdown">{exerciseBreakdown(session).map((item) => <div key={item.name}><strong>{item.name}</strong><span>{item.completed} sets completed{item.skipped ? ` · ${item.skipped} skipped` : ""}</span><small>{item.load !== null ? `Heaviest logged: ${item.load} kg` : "Bodyweight / timed"}</small></div>)}</div></section> : null}
              {session.endReason ? <p className="history-reason"><strong>Why it ended:</strong> {session.endReason}</p> : null}
              {(session.setLogs ?? []).length ? <div className="history-sets">{session.setLogs.map((log, index) => <div key={`${log.exerciseId}-${log.round}-${index}`}><span>Round {log.round}</span><strong>{log.exerciseName}</strong><small>{log.status === "skipped" ? "Skipped" : `${log.actualTarget ?? log.plannedTarget}${log.actualLoadKg !== null ? ` · ${log.actualLoadKg} kg` : ""}`}</small></div>)}</div> : <p>Detailed set data was not recorded for this older session.</p>}
              {session.substitutions.length ? <p><strong>Substitutions:</strong> {session.substitutions.map((item) => item.substituteName).join(", ")}</p> : null}
              {session.painEventIds.length ? <p><strong>Discomfort reports:</strong> {session.painEventIds.length}</p> : null}
              {session.notes ? <blockquote>{session.notes}</blockquote> : null}
              {sessionDecisions.length ? <section className="progression-summary"><h3>Next-session decisions</h3>{sessionDecisions.map((decision) => <article key={decision.id} data-decision={decision.decision}><span>{decision.decision.replaceAll("_", " ")}</span><strong>{decision.exerciseName ?? "Session recovery"}</strong><p>{decision.explanation}</p>{decision.plateauType ? <small>{decision.plateauType} signal · {decision.reasonCodes.join(" · ")}</small> : <small>{decision.reasonCodes.join(" · ")}</small>}</article>)}</section> : null}
            </div>
          </details>;
        })}</div>
      )}
    </AppShell>
  );
}
