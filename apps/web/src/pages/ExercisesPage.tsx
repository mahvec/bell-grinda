import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/MagnifyingGlass";
import { getSupplementalExerciseMapping } from "@bellgrinda/training-engine";
import { AppShell } from "../components/AppShell";
import { ExerciseDemo } from "../components/ExerciseDemo";
import { exerciseCatalog, getExerciseMuscles, getMovementCues } from "../media/exerciseGuide";
import { getExerciseMedia } from "../media/exerciseMedia";

const filters = ["All", "Kettlebell", "Dumbbell", "Bodyweight", "With video"] as const;
type ExerciseFilter = (typeof filters)[number];
const equipmentNames = { kettlebell: "Kettlebell", dumbbell: "Dumbbell", kettlebell_or_dumbbell: "Kettlebell or dumbbell", bodyweight: "Bodyweight", skipping_rope: "Skipping rope" };
const levelNames = { novice: "Novice", advanced_novice: "Advanced Novice", intermediate: "Intermediate", advanced: "Advanced", grandmaster: "Grandmaster" };

export function ExercisesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ExerciseFilter>("All");
  const visible = exerciseCatalog.filter((exercise) => {
    const matchesEquipment = filter === "All" || filter === equipmentNames[exercise.equipmentType] || (exercise.equipmentType === "kettlebell_or_dumbbell" && (filter === "Kettlebell" || filter === "Dumbbell"));
    return exercise.name.toLowerCase().includes(query.trim().toLowerCase()) && (matchesEquipment || (filter === "With video" && Boolean(getExerciseMedia(exercise.id))));
  });
  return <AppShell>
    <header className="page-heading"><p className="kicker">The movement library</p><h1>Good form.<br />Better training.</h1><p>Learn the movement before adding the reps. Every exercise has a written guide and reviewed demonstration; hosted tutorials require an internet connection.</p></header>
    <label className="search-field"><MagnifyingGlass size={21} /><input aria-label="Search exercises" type="search" placeholder="Find a movement" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    <div className="filter-tabs" aria-label="Filter exercises">{filters.map((label) => <button key={label} type="button" aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}</button>)}</div>
    <p className="kicker" role="status">{visible.length} {visible.length === 1 ? "movement" : "movements"}</p>
    <div className="library-grid">{visible.map((exercise) => {
      const media = getExerciseMedia(exercise.id);
      const muscles = getExerciseMuscles(exercise);
      const programming = getSupplementalExerciseMapping(exercise.id);
      return <article className="movement-card" key={exercise.id}><p className="kicker">{exercise.category} · {equipmentNames[exercise.equipmentType]}</p><h2>{exercise.name}</h2><section className="muscles-worked" aria-label={`${exercise.name} muscles worked`}><strong>Muscles worked</strong><div><span>Primary</span><p>{muscles.primary.join(" · ")}</p></div>{muscles.supporting.length ? <div><span>Supporting</span><p>{muscles.supporting.join(" · ")}</p></div> : null}</section>{programming ? <details className="program-fit"><summary>Program eligibility</summary><dl><div><dt>Minimum level</dt><dd>{levelNames[programming.minimumLevel]}</dd></div><div><dt>Prerequisites</dt><dd>{programming.prerequisites.length ? programming.prerequisites.map((id) => exerciseCatalog.find((item) => item.id === id)?.name ?? id.replaceAll("-", " ")).join(" · ") : "None"}</dd></div><div><dt>Safety block</dt><dd>{programming.blockedAtPain === "mild" ? "Any" : "Moderate or severe"} pain in: {programming.blockedPainLocations.join(", ").replaceAll("_", " ")}</dd></div><div><dt>Days / phases</dt><dd>Days {programming.eligibleDays.join(", ")} · Phases {programming.eligiblePhases.join(", ")}</dd></div><div><dt>Load approval</dt><dd>Exercise-specific approval required · at least {programming.loadRule.minimumSuccessfulSessionsBeforeIncrease} successful sessions before an increase</dd></div><div><dt>Easier</dt><dd>{programming.easierVariation}</dd></div><div><dt>Harder</dt><dd>{programming.harderVariation}</dd></div></dl></details> : null}<details className="cue-details"><summary>How to do it</summary><ol className="cue-list">{getMovementCues(exercise).map((cue) => <li key={cue}>{cue}</li>)}</ol></details>{media ? <ExerciseDemo media={media} exerciseName={exercise.name} /> : <span className="media-pending">Written guide · video not yet available</span>}</article>;
    })}</div>
    {visible.length === 0 ? <section className="empty-state"><h2>No matching movements</h2><p>Try another name or choose All.</p><button className="button secondary" onClick={() => { setQuery(""); setFilter("All"); }}>Clear filters</button></section> : null}
  </AppShell>;
}
