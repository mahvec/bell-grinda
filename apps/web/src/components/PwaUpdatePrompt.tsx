import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { useAppSelector } from "../state/hooks";

export function PwaUpdatePrompt() {
  const { hydrated, activeSession } = useAppSelector((state) => state.app);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const [dismissed, setDismissed] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW({
    onRegisteredSW(_url, registered) { setRegistration(registered); }
  });

  useEffect(() => {
    if (!registration) return;
    let checking = false;
    const check = async () => {
      if (checking || registration.installing || document.visibilityState !== "visible" || !navigator.onLine) return;
      checking = true;
      try {
        await registration.update();
      } catch {
        // Offline operation and temporary server failures must not interrupt training.
      } finally {
        checking = false;
      }
    };
    const foreground = () => {
      if (document.visibilityState !== "visible") return;
      setDismissed(false);
      void check();
    };
    void check();
    document.addEventListener("visibilitychange", foreground);
    window.addEventListener("online", check);
    const interval = window.setInterval(check, 60 * 60 * 1000);
    return () => {
      document.removeEventListener("visibilitychange", foreground);
      window.removeEventListener("online", check);
      window.clearInterval(interval);
    };
  }, [registration]);

  // Include paused sessions and pending reviews; wait until all session work is saved.
  if (!hydrated || activeSession || !needRefresh || dismissed) return null;

  const restart = async () => {
    setUpdating(true);
    setError("");
    try {
      await updateServiceWorker(true);
    } catch {
      setError("Could not apply the update. Please try again.");
      setUpdating(false);
    }
  };

  return <aside className="pwa-update" aria-label="App update">
    <div role="status"><strong>Update available</strong><p>{error || "Restart to load the latest BellGrinda. Your saved workouts stay on this device."}</p></div>
    <div className="pwa-update-actions">
      <button className="button primary" type="button" disabled={updating} onClick={() => void restart()}>{updating ? "Restarting…" : "Restart to update"}</button>
      <button className="button secondary" type="button" disabled={updating} onClick={() => setDismissed(true)}>Later</button>
    </div>
  </aside>;
}
