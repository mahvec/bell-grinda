import { useEffect, useMemo, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { Link } from "react-router-dom";
import { getGoalPriorities, getProfileEquipment, getSessionCompletedSets, getSessionDurationSeconds, type Equipment, type UserEquipment, type WorkoutSession } from "@bellgrinda/domain";
import { supplementalExerciseMappings } from "@bellgrinda/training-engine";
import { AppShell } from "../components/AppShell";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { profileRepository, sessionRepository } from "../persistence/database";
import { setProfile } from "../state/store";
import { KettlebellEditor, WeightEquipmentEditor } from "../components/KettlebellEditor";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const levelRank = { novice: 0, advanced_novice: 1, intermediate: 2, advanced: 3, grandmaster: 4 } as const;
const goalLabel: Record<string, string> = { consistency: "Training consistency and discipline", strength: "Strength", muscle_gain: "Overall muscle gain", fat_loss_recomposition: "Fat loss and body recomposition", bigger_chest: "Bigger chest", athleticism: "Athleticism", endurance_cardio: "Muscular endurance and cardiovascular conditioning" };
export function ProfilePage() {
  const profile = useAppSelector((state) => state.app.profile)!;
  const dispatch = useAppDispatch();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(profile.defaultKettlebellKg ?? 12);
  const [equipmentItems, setEquipmentItems] = useState<UserEquipment[]>(getProfileEquipment(profile));
  const [hasDumbbell, setHasDumbbell] = useState(profile.equipment.includes("dumbbell"));
  const [hasBarbell, setHasBarbell] = useState(profile.equipment.includes("barbell"));
  const [workingLoads, setWorkingLoads] = useState<Record<string, number>>(profile.exerciseWorkingLoadsKg ?? {});
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
    const selectedEquipment = profile.equipment.filter((item) => !["dumbbell", "barbell"].includes(item));
    const equipment = [...new Set([...selectedEquipment, ...(hasDumbbell ? ["dumbbell" as Equipment] : []), ...(hasBarbell ? ["barbell" as Equipment] : [])])];
    const bells = equipmentItems.filter((item) => item.equipmentType === "kettlebell" && item.active);
    if (!bells.length) return;
    const allowedWeightedTypes = new Set(["kettlebell", ...(hasDumbbell ? ["dumbbell"] : []), ...(hasBarbell ? ["barbell"] : [])]);
    const nextItems = equipmentItems.filter((item) => !["kettlebell", "dumbbell", "barbell"].includes(item.equipmentType) || allowedWeightedTypes.has(item.equipmentType));
    const now = new Date().toISOString();
    if (hasDumbbell && !nextItems.some((item) => item.equipmentType === "dumbbell")) nextItems.push({ id: crypto.randomUUID(), equipmentType: "dumbbell", weightKg: 15, quantity: 1, active: true, createdAt: now, updatedAt: now });
    if (hasBarbell && !nextItems.some((item) => item.equipmentType === "barbell")) nextItems.push({ id: crypto.randomUUID(), equipmentType: "barbell", weightKg: 20, quantity: 1, active: true, createdAt: now, updatedAt: now });
    const defaultLoad = bells.some((item) => item.weightKg === weight) ? weight : bells[0]!.weightKg!;
    const next = { ...profile, name: name.trim(), equipment, equipmentItems: nextItems, exerciseWorkingLoadsKg: workingLoads, defaultKettlebellKg: defaultLoad, defaultDumbbellKg: hasDumbbell ? nextItems.find((item) => item.equipmentType === "dumbbell")?.weightKg : undefined, defaultBarbellKg: hasBarbell ? nextItems.find((item) => item.equipmentType === "barbell")?.weightKg : undefined };
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
    <nav className="profile-nav" aria-label="Profile sections"><a href="#personal-setup">Setup</a><a href="#working-loads">Working loads</a><a href="#priorities">Priorities</a><a href="#training-program">Program</a></nav>
    <section className="profile-insight"><p className="kicker">Your most trained movement</p><h2>{favoriteMovement}</h2><p>Based on completed sets in your workout history.</p></section>
    <section className="profile-section" id="personal-setup"><h2>Personal setup</h2><p>Keep these current so future workout prescriptions match what you actually use.</p><div className="profile-form"><label className="field">Name<input value={name} onChange={(event) => setName(event.target.value)} maxLength={60} /></label><KettlebellEditor items={equipmentItems} onChange={setEquipmentItems} /><label className="field">Default working kettlebell<span className="weight-input"><select value={weight} onChange={(event) => setWeight(Number(event.target.value))}>{equipmentItems.filter((item) => item.equipmentType === "kettlebell").map((item) => <option key={item.id} value={item.weightKg}>{item.weightKg} kg</option>)}</select></span></label><button className={`equipment-option${hasDumbbell ? " selected" : ""}`} type="button" aria-pressed={hasDumbbell} onClick={() => setHasDumbbell((current) => !current)}><span><strong>{hasDumbbell ? "Dumbbells enabled" : "Add dumbbells"}</strong><small>Track every dumbbell weight or pair you own</small></span></button>{hasDumbbell ? <WeightEquipmentEditor items={equipmentItems} onChange={setEquipmentItems} equipmentType="dumbbell" title="Dumbbells" defaultWeight={15} /> : null}<button className={`equipment-option${hasBarbell ? " selected" : ""}`} type="button" aria-pressed={hasBarbell} onClick={() => setHasBarbell((current) => !current)}><span><strong>{hasBarbell ? "Barbell enabled" : "Add a barbell"}</strong><small>Track total loaded barbell weights</small></span></button>{hasBarbell ? <WeightEquipmentEditor items={equipmentItems} onChange={setEquipmentItems} equipmentType="barbell" title="Barbell loads" defaultWeight={20} /> : null}<button className="button secondary" type="button" onClick={saveProfile}>{saved ? "Saved" : "Save changes"}</button></div></section>
    <section className="profile-section"><h2>Your equipment</h2><div className="equipment-chips">{getProfileEquipment(profile).map((item) => <span key={item.id}>{item.weightKg ? `${item.weightKg} kg ` : ""}{item.equipmentType} × {item.quantity}</span>)}</div></section>
    <section className="profile-section" id="working-loads"><h2>Exercise working loads</h2><p>Choose any weight you own as the working load for a level-eligible movement. Suggested starting weights are guidance, not limits, and you can record a different actual weight during every set. Level, phase, pain, soreness, activity, and equipment rules still apply.</p><div className="working-load-list">{supplementalExerciseMappings.map((mapping) => {
      const loads = [...new Set(equipmentItems.filter((item) => item.active && (mapping.equipmentType === "kettlebell_or_dumbbell" ? ["kettlebell", "dumbbell"].includes(item.equipmentType) : item.equipmentType === mapping.equipmentType)).flatMap((item) => item.weightKg ? [item.weightKg] : []))].sort((a, b) => a - b);
      const levelEligible = levelRank[profile.trainingLevel] >= levelRank[mapping.minimumLevel];
      return <label key={mapping.exercise.id}><span><strong>{mapping.exercise.name}</strong><small>{levelEligible ? `Minimum ${mapping.minimumLevel.replaceAll("_", " ")} · suggested start ${mapping.loadRule.suggestedStartingLoadKg} kg · no weight cap` : `Unlocks at ${mapping.minimumLevel.replaceAll("_", " ")}`}</small></span><select disabled={!levelEligible} aria-label={`${mapping.exercise.name} approved working load`} value={levelEligible ? workingLoads[mapping.exercise.id] ?? "" : ""} onChange={(event) => setWorkingLoads((current) => { const next = { ...current }; if (event.target.value) next[mapping.exercise.id] = Number(event.target.value); else delete next[mapping.exercise.id]; return next; })}><option value="">{levelEligible ? "Not approved" : "Level locked"}</option>{levelEligible ? loads.map((load) => <option key={load} value={load}>{load} kg</option>) : null}</select></label>;
    })}</div><button className="button secondary" type="button" onClick={saveProfile}>{saved ? "Saved" : "Save working loads"}</button></section>
    <section className="profile-section" id="priorities"><h2>Development priorities</h2><p>BellGrinda uses this order to explain and shape your training while readiness and pain rules always take precedence.</p><ol className="goal-priority-list">{getGoalPriorities(profile).map((goal) => <li key={goal}>{goalLabel[goal]}</li>)}</ol></section>
    <section className="profile-section" id="training-program"><h2>Training program</h2><p><strong>{profile.trainingLevel.replaceAll("_", " ")} · Phase {profile.phase}</strong></p><p>If your current training consistently feels too easy, you can request a progress test at any time. BellGrinda first checks your recent training, then offers a controlled next-level workout when it is safe to test.</p><Link className="button secondary" to="/progress-test">Take a progress test</Link><small>Advanced and Grandmaster continue to require their dedicated program evidence.</small></section>
    <section className="profile-section"><h2>Your training record</h2><p>Your profile and sessions are saved in this browser on this device. Clearing browser data removes those records. Account sync is not available yet.</p></section>
    <section className="install-card"><h2>{installed ? "Ready on your home screen" : "Make room for your next workout"}</h2><p>{installed ? "BellGrinda is running as an app. Saved sessions and written movement guides are available offline." : "Add BellGrinda to your home screen for a focused, full-screen workout."}</p>{!installed && prompt ? <button className="button primary" onClick={install}><DownloadSimple size={20} /> Install BellGrinda</button> : !installed ? <p>Open your browser menu and choose Install app or Add to Home Screen.</p> : null}{installError ? <p role="status">{installError}</p> : null}</section>
  </AppShell>;
}
