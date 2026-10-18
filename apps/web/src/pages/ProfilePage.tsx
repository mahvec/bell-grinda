import { useEffect, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { AppShell } from "../components/AppShell";
import { useAppSelector } from "../state/hooks";

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const equipmentLabels = { kettlebell_12: "12 kg kettlebell", mat: "Exercise mat", chair: "Chair or bench", skipping_rope: "Skipping rope" };

export function ProfilePage() {
  const profile = useAppSelector((state) => state.app.profile)!;
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
  const install = async () => {
    if (!prompt) return;
    try { await prompt.prompt(); await prompt.userChoice; setPrompt(null); }
    catch { setInstallError("Use your browser menu to add BellGrinda to your home screen."); }
  };
  return <AppShell>
    <header className="page-heading"><p className="kicker">Your training space</p><h1>Built around you.</h1></header>
    <section className="profile-panel"><span className="avatar">{profile.name.slice(0, 1).toUpperCase()}</span><div><h2>{profile.name}</h2><p>Novice · Phase {profile.phase}</p></div></section>
    <section className="profile-section"><h2>Your equipment</h2><div className="equipment-chips">{profile.equipment.map((item) => <span key={item}>{equipmentLabels[item]}</span>)}</div></section>
    <section className="profile-section"><h2>Your training record</h2><p>Your profile and sessions are saved in this browser on this device. Clearing browser data removes those records. Account sync is not available yet.</p></section>
    <section className="install-card"><h2>{installed ? "Ready on your home screen" : "Make room for your next workout"}</h2><p>{installed ? "BellGrinda is running as an app. Saved sessions and written movement guides are available offline." : "Add BellGrinda to your home screen for a focused, full-screen workout. Save individual demos before training offline."}</p>{!installed && prompt ? <button className="button primary" onClick={install}><DownloadSimple size={20} /> Install BellGrinda</button> : !installed ? <p>Open your browser menu and choose Install app or Add to Home Screen. On iPhone, use Safari’s Share menu.</p> : null}{installError ? <p role="status">{installError}</p> : null}</section>
  </AppShell>;
}
