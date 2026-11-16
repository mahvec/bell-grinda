import { useState, type FormEvent } from "react";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import type { BodyLocation, ReadinessInput } from "@bellgrinda/domain";
import { applyProgressionDecisions, classifyReadiness, generateProgramWorkout } from "@bellgrinda/training-engine";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAppDispatch, useAppSelector } from "../state/hooks";
import { setPreparedWorkout } from "../state/store";
import { progressionDecisionRepository, readinessRepository } from "../persistence/database";

const questions: { key: "energy" | "sleep" | "soreness" | "pain" | "motivation" | "availableMinutes" | "football"; label: string; hint: string; choices: { value: string | number; label: string }[] }[] = [
  { key: "energy", label: "Energy", hint: "How energetic do you feel right now?", choices: [["high", "High"], ["normal", "Normal"], ["low", "Low"], ["very_low", "Very low"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "sleep", label: "Sleep", hint: "Think about both duration and quality.", choices: [["excellent", "Excellent"], ["good", "Good"], ["okay", "Okay"], ["poor", "Poor"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "soreness", label: "Muscle soreness", hint: "Normal training soreness, stiffness, or heaviness.", choices: [["none", "None"], ["mild", "Mild"], ["moderate", "Moderate"], ["severe", "Severe"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "pain", label: "Pain or discomfort", hint: "Different from normal muscle soreness.", choices: [["none", "None"], ["mild", "Mild"], ["moderate", "Moderate"], ["severe", "Severe"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "motivation", label: "Mood and motivation", hint: "How willing do you feel to train today?", choices: [["low", "Low"], ["normal", "Normal"], ["good", "Good"], ["very_motivated", "Very motivated"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "availableMinutes", label: "Available time", hint: "BellGrinda will fit the session to your day.", choices: [20, 30, 40, 45].map((value) => ({ value, label: value === 45 ? "45+ min" : `${value} min` })) },
  { key: "football", label: "Football or other activity", hint: "Include activity planned for later today.", choices: [["none", "None"], ["recreational", "Light"], ["match", "Normal match"], ["high_intensity", "High intensity"], ["competition", "Competition"]].map(([value, label]) => ({ value: value!, label: label! })) }
];

const defaults: ReadinessInput = { energy: "normal", sleep: "good", soreness: "none", pain: "none", football: "none", motivation: "normal", availableMinutes: 40, sorenessLocations: [], painLocations: [] };
const locations: { value: BodyLocation; label: string }[] = [{ value: "neck", label: "Neck" }, { value: "chest", label: "Chest" }, { value: "upper_back", label: "Upper back" }, { value: "lower_back", label: "Lower back" }, { value: "shoulder", label: "Shoulder" }, { value: "elbow", label: "Elbow" }, { value: "wrist", label: "Wrist" }, { value: "hip", label: "Hip" }, { value: "quadriceps", label: "Front thigh" }, { value: "hamstring", label: "Hamstring" }, { value: "knee", label: "Knee" }, { value: "calf", label: "Calf" }, { value: "ankle", label: "Ankle" }, { value: "other", label: "Other" }];

export function ReadinessPage() {
  const [values, setValues] = useState<ReadinessInput>(defaults);
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.app.profile)!;
  const navigate = useNavigate();
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const decisions = await progressionDecisionRepository.listLatestApplicable();
    const result = classifyReadiness(values);
    const today = new Date().toISOString().slice(0, 10);
    await readinessRepository.save({ id: `${today}:${profile.id}`, date: today, input: values, result, createdAt: new Date().toISOString() });
    const workout = generateProgramWorkout(new Date(), result, profile);
    dispatch(setPreparedWorkout(applyProgressionDecisions(workout, decisions)));
    navigate("/workout");
  };

  return (
    <AppShell action={<Link className="icon-button" to="/" aria-label="Back to dashboard"><ArrowLeft size={22} /></Link>}>
      <div className="flow-steps"><span><strong>01 Check in</strong></span><span>02 Your workout</span><span>03 Train</span></div>
      <section className="page-heading"><p className="kicker">A moment for yourself</p><h1>How’s your body today?</h1><p>Your answers set today’s pace. Check each selection below; recovery sessions count too.</p></section>
      <form className="readiness-form" onSubmit={submit}>
        {questions.map((question, index) => (
          <fieldset className="choice-group" key={question.key}>
            <legend><span>{index + 1}</span>{question.label}</legend>
            <p>{question.hint}</p>
            <div className="segmented">
              {question.choices.map((choice) => (
                <label key={choice.value}>
                  <input
                    type="radio"
                    name={question.key}
                    value={choice.value}
                    checked={values[question.key] === choice.value}
                    onChange={() => setValues((current) => ({ ...current, [question.key]: choice.value }))}
                  />
                  <span>{choice.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {(["soreness", "pain"] as const).map((kind) => values[kind] !== "none" ? <fieldset className="choice-group" key={`${kind}-locations`}><legend>Where is the {kind === "pain" ? "discomfort" : "soreness"}?</legend><div className="region-grid">{locations.map((location) => { const key = kind === "pain" ? "painLocations" : "sorenessLocations"; const selected = values[key].includes(location.value); return <button type="button" key={location.value} aria-pressed={selected} onClick={() => setValues((current) => ({ ...current, [key]: selected ? current[key].filter((item) => item !== location.value) : [...current[key], location.value] }))}>{location.label}</button>; })}</div></fieldset> : null)}
        <div className="readiness-submit"><span>All selections can be changed before continuing.</span><button className="button primary" type="submit">Build today&apos;s workout <ArrowRight size={18} weight="bold" /></button></div>
      </form>
    </AppShell>
  );
}
