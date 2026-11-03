import { useState } from "react";
import type { GeneratedWorkout, UserProfile } from "@bellgrinda/domain";
import { askCoach, buildCoachContext, deterministicWorkoutExplanation } from "../services/coach";

export function WorkoutExplanation({ workout, profile }: { workout: GeneratedWorkout; profile: UserProfile }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const explain = async () => {
    if (answer) return setAnswer("");
    setLoading(true);
    try { setAnswer((await askCoach("Why was today's workout selected and adjusted?", await buildCoachContext(profile, workout))).answer); }
    catch { setAnswer(deterministicWorkoutExplanation(workout)); }
    setLoading(false);
  };
  return <section className="workout-explanation"><button className="button secondary" type="button" onClick={explain}>{answer ? "Hide explanation" : loading ? "Building explanation…" : "Why this workout?"}</button>{answer ? <p>{answer}</p> : null}</section>;
}
