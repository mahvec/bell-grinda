import { AppShell } from "../components/AppShell";

export function PlaceholderPage({ title, body }: { title: string; body: string }) {
  return <AppShell><section className="page-heading"><p className="kicker">Coming in the next slice</p><h1>{title}</h1><p>{body}</p></section><section className="empty-state"><h2>The foundation is ready</h2><p>This screen will use the same local-first training records already created by the workout loop.</p></section></AppShell>;
}
