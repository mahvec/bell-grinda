import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { AppShell } from "../components/AppShell";
import { ExerciseDemo } from "../components/ExerciseDemo";
import { exerciseCatalog, getMovementCues } from "../media/exerciseGuide";
import { getExerciseMedia } from "../media/exerciseMedia";

export function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const visible = exerciseCatalog.filter((exercise) => exercise.name.toLowerCase().includes(query.trim().toLowerCase()) && (filter === "All" || (filter === "Kettlebell" && exercise.loadKg !== null) || (filter === "Bodyweight" && exercise.loadKg === null && exercise.id !== "skipping") || (filter === "With video" && Boolean(getExerciseMedia(exercise.id)))));
  return <AppShell>
    <header className="page-heading"><p className="kicker">The movement library</p><h1>Good form.<br />Better training.</h1><p>Learn the movement before adding the reps. Every exercise has a written guide; available videos show the full body.</p></header>
    <label className="search-field"><MagnifyingGlass size={21} /><input aria-label="Search exercises" type="search" placeholder="Find a movement" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="filter-tabs" aria-label="Filter exercises">{["All", "Kettlebell", "Bodyweight", "With video"].map((label) => <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div>
    <p className="kicker" role="status">{visible.length} {visible.length === 1 ? "movement" : "movements"}</p>
    <div className="library-grid">{visible.map((exercise) => {
      const media = getExerciseMedia(exercise.id);
      return <article className="movement-card" key={exercise.id}><p className="kicker">{exercise.category} · {exercise.loadKg ? "Kettlebell" : exercise.id === "skipping" ? "Skipping rope" : "Bodyweight"}</p><h2>{exercise.name}</h2><details className="cue-details"><summary>How to do it</summary><ol className="cue-list">{getMovementCues(exercise).map((cue) => <li key={cue}>{cue}</li>)}</ol></details>{media ? <ExerciseDemo media={media} exerciseName={exercise.name} /> : <span className="media-pending">Written guide · video not yet available</span>}</article>;
    })}</div>
    {visible.length === 0 ? <section className="empty-state"><h2>No matching movements</h2><p>Try another name or choose All.</p><button className="button secondary" onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters</button></section> : null}
  </AppShell>;
}
