import { useEffect, useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { Link } from "react-router-dom";
import { getProfileEquipment, getSessionCompletedSets, getSessionDurationSeconds, type Equipment, type UserEquipment, type WorkoutSession } from "@bellgrinda/domain";
import { AppShell } from "../components/AppShell";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { profileRepository, sessionRepository } from "../persistence/database";
import { setProfile } from "../state/store";
import { KettlebellEditor } from "../components/KettlebellEditor";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
export function ProfilePage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const dispatch = useAppDispatch();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(profile.defaultKettlebellKg ?? 12);
  const [equipmentItems, setEquipmentItems] = useState<UserEquipment[]>(getProfileEquipment(profile));
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
  const saveProfile = async () => {
    if (!name.trim()) return;
    const equipment = hasDumbbell ? [...new Set([...profile.equipment, "dumbbell" as Equipment])] : profile.equipment.filter((item) => item !== "dumbbell");
    const bells = equipmentItems.filter((item) => item.equipmentType === "kettlebell" && item.active);
    if (!bells.length) return;
    const nonWeights = equipmentItems.filter((item) => !["kettlebell", "dumbbell"].includes(item.equipmentType));
    const now = new Date().toISOString();
    const nextItems = [...bells, ...nonWeights, ...(hasDumbbell ? [{ id: equipmentItems.find((item) => item.equipmentType === "dumbbell")?.id ?? crypto.randomUUID(), equipmentType: "dumbbell" as const, weightKg: dumbbellWeight, quantity: 1, active: true, createdAt: now, updatedAt: now }] : [])];
    const defaultLoad = bells.some((item) => item.weightKg === weight) ? weight : bells[0]!.weightKg!;
    const next = { ...profile, name: name.trim(), equipment, equipmentItems: nextItems, defaultKettlebellKg: defaultLoad, defaultDumbbellKg: hasDumbbell ? dumbbellWeight : undefined };
    await profileRepository.save(next); dispatch(setProfile(next)); setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  };
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
    <section className="profile-section"><h2>Personal setup</h2><p>Keep these current so future workout prescriptions match what you actually use.</p><div className="profile-form"><label className="field">Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} /></label><KettlebellEditor items={equipmentItems} onChange={setEquipmentItems} /><label className="field">Default working kettlebell<span className="weight-input"><select value={weight} onChange={(event) => setWeight(Number(event.target.value))}>{equipmentItems.filter((item) => item.equipmentType === "kettlebell").map((item) => <option key={item.id} value={item.weightKg}>{item.weightKg} kg</option>)}</select></span></label><button className={`equipment-option${hasDumbbell ? " selected" : ""}`} type="button" aria-pressed={hasDumbbell} onClick={() => setHasDumbbell((current) => !current)}><span><strong>{hasDumbbell ? "Dumbbell added" : "Add a dumbbell"}</strong><small>Include dumbbell movements in your equipment library</small></span></button>{hasDumbbell ? <label className="field">Default dumbbell weight<span className="weight-input"><input type="number" inputMode="decimal" min="1" max="200" step="0.5" value={dumbbellWeight} onChange={(event) => setDumbbellWeight(Math.max(1, Number(event.target.value)))} /><small>kg</small></span></label> : null}<button className="button secondary" type="button" onClick={saveProfile}>{saved ? "Saved" : "Save changes"}</button></div></section>
    <section className="profile-section"><h2>Your equipment</h2><div className="equipment-chips">{getProfileEquipment(profile).map((item) => <span key={item.id}>{item.weightKg ? `${item.weightKg} kg ` : ""}{item.equipmentType} × {item.quantity}</span>)}</div></section>
    <section className="profile-section"><h2>Training program</h2><p><strong>{profile.trainingLevel.replaceAll("_", " ")} · Phase {profile.phase}</strong></p><p>If your current training consistently feels too easy, BellGrinda can assess whether you are ready for a higher level. One easy session is never enough.</p><Link className="button secondary" to="/level-review">Review my level</Link><small>Advanced and Grandmaster continue to require their dedicated program evidence.</small></section>
    <section className="profile-section"><h2>Your training record</h2><p>Your profile and sessions are saved in this browser on this device. Clearing browser data removes those records. Account sync is not available yet.</p></section>
    <section className="install-card"><h2>{installed ? "Ready on your home screen" : "Make room for your next workout"}</h2><p>{installed ? "BellGrinda is running as an app. Saved sessions and written movement guides are available offline." : "Add BellGrinda to your home screen for a focused, full-screen workout."}</p>{!installed && prompt ? <button className="button primary" onClick={install}><DownloadSimple size={20} /> Install BellGrinda</button> : !installed ? <p>Open your browser menu and choose Install app or Add to Home Screen.</p> : null}{installError ? <p role="status">{installError}</p> : null}</section>
  </AppShell>;
}
