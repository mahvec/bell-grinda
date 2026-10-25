import { useEffect, useMemo, useState } from "react";
import type { Assessment, PerformanceSnapshot, PersonalRecord } from "@bellgrinda/domain";
import { createPerformanceSnapshot } from "@bellgrinda/training-engine";
import { AppShell } from "../components/AppShell";
import { assessmentRepository, performanceSnapshotRepository, personalRecordRepository, sessionRepository } from "../persistence/database";

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
const date = (value: string) => new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));

function ScoreChart({ snapshots }: { snapshots: PerformanceSnapshot[] }) {
  const points = [...snapshots].reverse();
  if (points.length < 2) return <p className="chart-empty">Your score history will draw here after two finalized sessions or assessments.</p>;
  const path = points.map((snapshot, index) => `${(index / (points.length - 1)) * 100},${100 - snapshot.overallScore}`).join(" ");
  return <figure className="score-chart"><svg viewBox="0 0 100 100" role="img" aria-label="Overall performance score trend"><line x1="0" y1="100" x2="100" y2="100" /><line x1="0" y1="50" x2="100" y2="50" /><polyline points={path} vectorEffect="non-scaling-stroke" /></svg><figcaption><span>{date(points[0]!.calculatedAt)}</span><span>{date(points.at(-1)!.calculatedAt)}</span></figcaption></figure>;
}

export function ProgressPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [snapshots, setSnapshots] = useState<PerformanceSnapshot[]>([]);
  const [form, setForm] = useState({ bodyweightKg: "", waistCm: "", chestCm: "", maxStandardPushups: "", notes: "" });
  const load = async () => {
    const [nextAssessments, nextRecords, nextSnapshots] = await Promise.all([assessmentRepository.list(), personalRecordRepository.list(), performanceSnapshotRepository.list()]);
    setAssessments(nextAssessments); setRecords(nextRecords); setSnapshots(nextSnapshots);
  };
  useEffect(() => { void load(); }, []);
  const latest = snapshots[0];
  const currentRecords = useMemo(() => {
    const seen = new Set<string>();
    return records.filter((record) => { const key = `${record.exerciseId}:${record.recordType}:${record.loadKg}`; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 8);
  }, [records]);
  const saveAssessment = async (event: React.FormEvent) => {
    event.preventDefault();
    const now = new Date().toISOString();
    const assessment: Assessment = { id: crypto.randomUUID(), date: now, type: assessments.some((item) => item.type === "baseline") ? "biweekly" : "baseline", bodyweightKg: form.bodyweightKg ? Number(form.bodyweightKg) : null, waistCm: form.waistCm ? Number(form.waistCm) : null, chestCm: form.chestCm ? Number(form.chestCm) : null, maxStandardPushups: form.maxStandardPushups ? Number(form.maxStandardPushups) : null, notes: form.notes.trim(), createdAt: now };
    await assessmentRepository.save(assessment);
    const [sessions, previous] = await Promise.all([sessionRepository.listHistory(), performanceSnapshotRepository.list()]);
    await performanceSnapshotRepository.save(createPerformanceSnapshot({ sessions, previousSnapshots: previous, sourceAssessment: assessment }));
    setForm({ bodyweightKg: "", waistCm: "", chestCm: "", maxStandardPushups: "", notes: "" });
    await load();
  };
  return <AppShell>
    <section className="page-heading"><p className="kicker">Progress analytics</p><h1>See the signal, not the noise.</h1><p>Scores use a rolling view of your recorded work. A single difficult day will not redefine your progress.</p></section>
    <section className="performance-hero">
      <div><p className="kicker">{latest ? `${label(latest.status)} grade` : "Awaiting your first record"}</p><h2>{latest ? label(latest.grade) : "No grade yet"}</h2><p>{latest ? latest.explanation : "Finalize two sessions to establish an initial performance snapshot."}</p></div>
      <div className="score-orb"><strong>{latest?.overallScore ?? "—"}</strong><span>/ 100</span><small>{latest ? label(latest.trend) : "Insufficient data"}</small></div>
    </section>
    <section className="progress-section"><div className="section-heading"><div><p className="kicker">Score history</p><h2>Performance trend</h2></div></div><ScoreChart snapshots={snapshots} /></section>
    {latest ? <section className="category-grid" aria-label="Performance category scores">{Object.entries(latest.categoryScores).map(([name, score]) => <article key={name}><small>{label(name)}</small><strong>{score}</strong><span>{label(latest.categoryTrends[name as keyof typeof latest.categoryTrends])}</span></article>)}</section> : null}
    <section className="progress-section"><p className="kicker">Personal records</p><h2>Best comparable work</h2>{currentRecords.length ? <div className="pr-list">{currentRecords.map((record) => <article key={record.id}><div><strong>{record.exerciseName}</strong><span>{label(record.recordType)}</span></div><b>{record.value} {record.unit}{record.loadKg !== null && record.recordType === "reps_at_load" ? ` @ ${record.loadKg} kg` : ""}</b><small>{date(record.date)}</small></article>)}</div> : <p className="muted-copy">Finalize a comparable exercise set to start building your PR history.</p>}</section>
    <section className="assessment-panel"><div><p className="kicker">{assessments.some((item) => item.type === "baseline") ? "Biweekly check-in" : "Baseline assessment"}</p><h2>{assessments.some((item) => item.type === "baseline") ? "Capture today’s reference point." : "Set your first reference point."}</h2><p>Optional fields stay optional. Measurements are stored on this device and compared with future check-ins.</p></div><form className="assessment-form" onSubmit={saveAssessment}>{([['bodyweightKg', 'Bodyweight (kg)'], ['waistCm', 'Waist (cm)'], ['chestCm', 'Chest (cm)'], ['maxStandardPushups', 'Max standard push-ups']] as const).map(([key, text]) => <label key={key}>{text}<input type="number" min="0" step="0.1" value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} /></label>)}<label className="wide">Notes <textarea maxLength={1000} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="How does your training feel?" /></label><button className="button primary" type="submit">Save assessment</button></form></section>
    {assessments.length ? <section className="progress-section"><p className="kicker">Assessment history</p><h2>Your check-ins</h2><div className="assessment-list">{assessments.map((item) => <article key={item.id}><strong>{label(item.type)}</strong><span>{date(item.date)}</span><small>{item.maxStandardPushups !== null ? `${item.maxStandardPushups} push-ups` : "No test values recorded"}</small></article>)}</div></section> : null}
  </AppShell>;
}
