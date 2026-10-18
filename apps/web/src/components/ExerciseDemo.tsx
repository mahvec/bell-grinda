import { useEffect, useRef, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react/DownloadSimple";
import { PlayCircle } from "@phosphor-icons/react/PlayCircle";
import { X } from "@phosphor-icons/react/X";
import type { ExerciseMedia } from "@bellgrinda/domain";
import { getSavedMedia, isMediaSaved, saveMediaForOffline } from "../media/mediaCache";

type SaveState = "idle" | "saving" | "saved" | "error";

export function ExerciseDemo({ media, exerciseName, compact = false }: { media: ExerciseMedia; exerciseName: string; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [speed, setSpeed] = useState("1");

  useEffect(() => {
    let active = true;
    void isMediaSaved(media).then((saved) => {
      if (active && saved) setSaveState("saved");
    }).catch(() => undefined);
    return () => { active = false; };
  }, [media]);

  useEffect(() => {
    if (!open) return;
    let active = true;
    let objectUrl: string | null = null;
    void getSavedMedia(media).then((blob) => {
      if (active && blob) { objectUrl = URL.createObjectURL(blob); setCachedUrl(objectUrl); setVideoFailed(false); }
    }).catch(() => undefined);
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [media, open]);

  const saveOffline = async () => {
    setSaveState("saving");
    try {
      await saveMediaForOffline(media);
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  if (!open) {
    return <button className={`demo-trigger${compact ? " compact" : ""}`} type="button" onClick={() => { setVideoFailed(false); setCachedUrl(null); setSpeed("1"); setOpen(true); }}><PlayCircle size={20} weight="fill" /> Watch demo <span>Full body · human video · {media.durationSeconds}s</span></button>;
  }

  return (
    <section className={`exercise-demo${compact ? " compact" : ""}`} aria-label={`${exerciseName} demonstration`}>
      <div className="demo-heading"><strong>Full-body human demonstration</strong><button className="demo-close" type="button" onClick={() => setOpen(false)} aria-label="Close exercise demonstration"><X size={18} /></button></div>
      {videoFailed ? <div className="demo-fallback" role="status"><strong>Video unavailable</strong><span>Use the written cues and keep your movement controlled.</span><button className="button secondary" onClick={() => setVideoFailed(false)}>Try again</button></div> : <video ref={videoRef} src={cachedUrl ?? media.videoUrl} controls playsInline muted preload="metadata" poster={media.posterUrl} onLoadedMetadata={(event) => { event.currentTarget.playbackRate = Number(speed); }} onError={() => setVideoFailed(true)} aria-label={`${exerciseName} video demonstration`} />}
      {media.coachingNote ? <p className="demo-coaching-note">{media.coachingNote}</p> : null}
      <label className="playback-speed">Playback speed <select aria-label="Playback speed" value={speed} onChange={(event) => { setSpeed(event.target.value); if (videoRef.current) videoRef.current.playbackRate = Number(event.target.value); }}><option value="1">Normal</option><option value="0.75">0.75×</option><option value="0.5">0.5× · slow</option></select></label>
      <div className="demo-meta">
        <span>Video by <a href={media.sourcePageUrl} target="_blank" rel="noreferrer">{media.creator}</a> · <a href={media.licenseUrl} target="_blank" rel="noreferrer">{media.licenseName}</a></span>
        <button type="button" onClick={saveOffline} disabled={saveState === "saving" || saveState === "saved"}><DownloadSimple size={16} /> {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved offline" : saveState === "error" ? "Retry save" : "Save offline"}</button>
      </div>
      {saveState === "error" ? <p className="demo-error" role="status">Could not save the video. The written exercise cues still work offline.</p> : null}
    </section>
  );
}
