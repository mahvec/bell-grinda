import { useState, type FormEvent } from "react";
import { ArrowLeft } from "@phosphor-icons/react/ArrowLeft";
import { ArrowRight } from "@phosphor-icons/react/ArrowRight";
import type { ReadinessInput } from "@bellgrinda/domain";
import { classifyReadiness, generateNoviceWorkout } from "@bellgrinda/training-engine";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { useAppDispatch } from "../state/hooks";
import { setPreparedWorkout } from "../state/store";

const questions: { key: keyof ReadinessInput; label: string; choices: { value: string; label: string }[] }[] = [
  { key: "energy", label: "Energy", choices: [["high", "High"], ["normal", "Normal"], ["low", "Low"], ["very_low", "Very low"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "sleep", label: "Sleep", choices: [["good", "Good"], ["okay", "Okay"], ["poor", "Poor"], ["very_poor", "Very poor"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "soreness", label: "Soreness", choices: [["none", "None"], ["mild", "Mild"], ["moderate", "Moderate"], ["severe", "Severe"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "pain", label: "Pain", choices: [["none", "None"], ["mild", "Mild"], ["moderate", "Moderate"], ["severe", "Severe"]].map(([value, label]) => ({ value: value!, label: label! })) },
  { key: "football", label: "Football today", choices: [["none", "No"], ["recreational", "Recreational"], ["match", "Match"], ["high_intensity", "High intensity"], ["competition", "Competition"]].map(([value, label]) => ({ value: value!, label: label! })) }
];

const defaults: ReadinessInput = { energy: "normal", sleep: "good", soreness: "none", pain: "none", football: "none" };

export function ReadinessPage() {
  const [values, setValues] = useState<ReadinessInput>(defaults);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const submit = (event: FormEvent) => {
    event.preventDefault();
    dispatch(setPreparedWorkout(generateNoviceWorkout(new Date(), classifyReadiness(values))));
    navigate("/workout");
  };

  return (
    <AppShell action={<Link className="icon-button" to="/" aria-label="Back to dashboard"><ArrowLeft size={22} /></Link>}>
      <div className="flow-steps"><span><strong>01 Check in</strong></span><span>02 Your workout</span><span>03 Train</span></div>
      <section className="page-heading"><p className="kicker">A moment for yourself</p><h1>How’s your body today?</h1><p>Your answers set today’s pace. Check each selection below; recovery sessions count too.</p></section>
      <form className="readiness-form" onSubmit={submit}>
        {questions.map((question) => (
          <fieldset className="choice-group" key={question.key}>
            <legend>{question.label}</legend>
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
        <button className="button primary" type="submit">Build today's workout <ArrowRight size={18} weight="bold" /></button>
      </form>
    </AppShell>
  );
}
