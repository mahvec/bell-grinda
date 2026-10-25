import { useEffect, useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { getSessionCompletedSets, getSessionDurationSeconds, type Equipment, type TrainingLevel, type WorkoutSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { profileRepository, sessionRepository } from "../persistence/database";
import { setProfile } from "../state/store";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const equipmentLabels: Record<Equipment, string> = { kettlebell_12: "Kettlebell", dumbbell: "Dumbbell", mat: "Exercise mat", chair: "Chair or bench", skipping_rope: "Skipping rope" };

export function ProfilePage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const dispatch = useAppDispatch();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(profile.defaultKettlebellKg ?? 12);
  const [dumbbellWeight, setDumbbellWeight] = useState(profile.defaultDumbbellKg ?? 15);
  const [hasDumbbell, setHasDumbbell] = useState(profile.equipment.includes("dumbbell"));
  const [saved, setSaved] = useState(false);
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(() => window.matchMedia?.("(display-mode: standalone)").matches ?? false);
  const [installError, setInstallError] = useState("");
  useEffect(() => {
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const complete = () => { setInstalled(true); setPrompt(null); };
    window.addEventListener("beforeinstallprompt", capture);
    window.addEventListener("appinstalled", complete);
    return () => { window.removeEventListener("beforeinstallprompt", capture); window.removeEventListener("appinstalled", complete); };
  }, []);
  useEffect(() => { void sessionRepository.listHistory().then(setSessions); }, []);
  const completedSessions = sessions.filter((session) => session.status === "completed").length;
  const totalSeconds = sessions.reduce((sum, session) => sum + getSessionDurationSeconds(session), 0);
  const totalSets = sessions.reduce((sum, session) => sum + getSessionCompletedSets(session), 0);
  const favoriteMovement = useMemo(() => {
    const counts = new Map<string, number>();
    sessions.flatMap((session) => session.setLogs ?? []).filter((log) => log.status === "completed").forEach((log) => counts.set(log.exerciseName, (counts.get(log.exerciseName) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Complete a workout to discover it";
  }, [sessions]);
  const levels: { value: TrainingLevel; label: string; required: number; detail: string }[] = [
    { value: "novice", label: "Novice", required: 0, detail: "Foundation templates" },
    { value: "advanced_novice", label: "Advanced Novice", required: 12, detail: "Five-day density and unilateral block" },
    { value: "intermediate", label: "Intermediate", required: 36, detail: "Mixed-demand program" },
    { value: "advanced", label: "Advanced", required: 72, detail: "Adaptive priority blocks" },
    { value: "grandmaster", label: "Grandmaster", required: 120, detail: "Readiness-reviewed adaptive cycles" }
  ];
  const saveProfile = async () => {
    if (!name.trim()) return;
    const equipment = hasDumbbell ? [...new Set([...profile.equipment, "dumbbell" as Equipment])] : profile.equipment.filter((item) => item !== "dumbbell");
    const next = { ...profile, name: name.trim(), equipment, defaultKettlebellKg: weight, defaultDumbbellKg: hasDumbbell ? dumbbellWeight : undefined };
    await profileRepository.save(next); dispatch(setProfile(next)); setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  };
  const selectLevel = async (trainingLevel: TrainingLevel) => { const next = { ...profile, trainingLevel, phase: 1 }; await profileRepository.save(next); dispatch(setProfile(next)); };
  const install = async () => {
    if (!prompt) return;
    try { await prompt.prompt(); await prompt.userChoice; setPrompt(null); }
    catch { setInstallError("Use your browser menu to add BellGrinda to your home screen."); }
  };
  return <AppShell>
    <header className="page-heading"><p className="kicker">Your training space</p><h1>A look at your work.</h1><p>Your setup, habits, and current training path in one place.</p></header>
    <section className="profile-panel"><span className="avatar">{profile.name.slice(0, 1).toUpperCase()}</span><div><h2>{profile.name}</h2><p>{profile.trainingLevel.replaceAll("_", " ")} · Phase {profile.phase}</p><small>Training since {new Date(profile.createdAt).toLocaleDateString("en", { month: "long", year: "numeric" })}</small></div></section>
    <section className="profile-stats" aria-label="Training summary"><span><strong>{completedSessions}</strong> workouts</span><span><strong>{Math.round(totalSeconds / 60)}</strong> minutes</span><span><strong>{totalSets}</strong> sets</span><span><strong>{sessions.length ? Math.round(totalSeconds / sessions.length / 60) : 0}</strong> avg min</span></section>
    <section className="profile-insight"><p className="kicker">Your most trained movement</p><h2>{favoriteMovement}</h2><p>Based on completed sets in your workout history.</p></section>
    <section className="profile-section"><h2>Personal setup</h2><p>Keep these current so future workout prescriptions match what you actually use.</p><div className="profile-form"><label className="field">Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} /></label><label className="field">Default kettlebell weight<span className="weight-input"><input type="number" inputMode="decimal" min="1" max="200" step="0.5" value={weight} onChange={(event) => setWeight(Math.max(1, Number(event.target.value)))} /><small>kg</small></span></label><button className={`equipment-option${hasDumbbell ? " selected" : ""}`} type="button" aria-pressed={hasDumbbell} onClick={() => setHasDumbbell((current) => !current)}><span><strong>{hasDumbbell ? "Dumbbell added" : "Add a dumbbell"}</strong><small>Include dumbbell movements in your equipment library</small></span></button>{hasDumbbell ? <label className="field">Default dumbbell weight<span className="weight-input"><input type="number" inputMode="decimal" min="1" max="200" step="0.5" value={dumbbellWeight} onChange={(event) => setDumbbellWeight(Math.max(1, Number(event.target.value)))} /><small>kg</small></span></label> : null}<button className="button secondary" type="button" onClick={saveProfile}>{saved ? "Saved" : "Save changes"}</button></div></section>
    <section className="profile-section"><h2>Your equipment</h2><div className="equipment-chips">{profile.equipment.map((item) => <span key={item}>{item === "kettlebell_12" ? `${weight} kg ${equipmentLabels[item].toLowerCase()}` : item === "dumbbell" ? `${dumbbellWeight} kg ${equipmentLabels[item].toLowerCase()}` : equipmentLabels[item]}</span>)}</div></section>
    <section className="profile-section"><h2>Training program</h2><p>Programs unlock through completed-session history. Grandmaster additionally requires a readiness review.</p><div className="program-selector">{levels.map((level) => { const unlocked = completedSessions >= level.required; return <button key={level.value} type="button" disabled={!unlocked} aria-pressed={profile.trainingLevel === level.value} onClick={() => void selectLevel(level.value)}><strong>{level.label}</strong><span>{level.detail}</span><small>{unlocked ? (profile.trainingLevel === level.value ? "Active" : "Available") : `${completedSessions}/${level.required} completed sessions`}</small></button>; })}</div></section>
    <section className="profile-section"><h2>Your training record</h2><p>Your profile and sessions are saved in this browser on this device. Clearing browser data removes those records. Account sync is not available yet.</p></section>
    <section className="install-card"><h2>{installed ? "Ready on your home screen" : "Make room for your next workout"}</h2><p>{installed ? "BellGrinda is running as an app. Saved sessions and written movement guides are available offline." : "Add BellGrinda to your home screen for a focused, full-screen workout."}</p>{!installed && prompt ? <button className="button primary" onClick={install}><DownloadSimple size={20} /> Install BellGrinda</button> : !installed ? <p>Open your browser menu and choose Install app or Add to Home Screen.</p> : null}{installError ? <p role="status">{installError}</p> : null}</section>
  </AppShell>;
}
