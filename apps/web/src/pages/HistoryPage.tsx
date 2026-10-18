import { useEffect, useState } from "react";
import { CheckCircle } from "@phosphor-icons/react/CheckCircle";
import { ClockCounterClockwise } from "@phosphor-icons/react/ClockCounterClockwise";
import type { WorkoutSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { sessionRepository } from "../persistence/database";

export function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[] | null>(null);
  useEffect(() => { void sessionRepository.listRecent().then(setSessions); }, []);
  return (
    <AppShell>
      <section className="page-heading"><p className="kicker">Training record</p><h1>Workout history</h1><p>Completed and interrupted sessions remain on this device.</p></section>
      {sessions === null ? <div className="skeleton-list" aria-label="Loading workout history"><span /><span /><span /></div> : sessions.length === 0 ? (
        <section className="empty-state"><ClockCounterClockwise size={34} /><h2>No sessions yet</h2><p>Your first completed workout will appear here.</p></section>
      ) : (
        <div className="history-list">{sessions.map((session) => (
          <article key={session.id}><CheckCircle size={24} weight="fill" /><div><h2>{session.workout.title}</h2><p>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(session.startedAt))}</p></div><span>{session.status}</span></article>
        ))}</div>
      )}
    </AppShell>
  );
}
