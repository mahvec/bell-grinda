import { useState, type FormEvent } from "react";
import { Barbell } from "@phosphor-icons/react/Barbell";
import { Check } from "@phosphor-icons/react/Check";
import type { Equipment, UserEquipment, UserProfile } from "@bellgrinda/domain";
import { profileRepository } from "../persistence/database";
import { setProfile } from "../state/store";
import { useAppDispatch } from "../state/hooks";
import { KettlebellArt } from "../components/KettlebellArt";
import { KettlebellEditor } from "../components/KettlebellEditor";

const choices: { id: Equipment; label: string; note: string }[] = [
  { id: "kettlebell_12", label: "Kettlebell", note: "Add every weight and quantity you own below" },
  { id: "dumbbell", label: "Dumbbell", note: "Optional strength and single-leg work" },
  { id: "mat", label: "Exercise mat", note: "Core and recovery work" },
  { id: "chair", label: "Chair or bench", note: "Regressions and supported movements" },
  { id: "skipping_rope", label: "Skipping rope", note: "Conditioning sessions" }
];

export function OnboardingPage() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [equipment, setEquipment] = useState<Equipment[]>(["kettlebell_12", "mat", "skipping_rope"]);
  const now = new Date().toISOString();
  const [equipmentItems, setEquipmentItems] = useState<UserEquipment[]>([{ id: crypto.randomUUID(), equipmentType: "kettlebell", weightKg: 12, quantity: 1, active: true, createdAt: now, updatedAt: now }]);
  const [dumbbellKg, setDumbbellKg] = useState(15);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return setError("Enter the name you want BellGrinda to use.");
    const kettlebells = equipmentItems.filter((item) => item.equipmentType === "kettlebell" && item.active);
    if (!equipment.includes("kettlebell_12") || !kettlebells.length) return setError("Add at least one kettlebell for the initial plan.");
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name: name.trim(),
      trainingLevel: "novice",
      phase: 1,
      equipment,
      equipmentItems: [...equipmentItems, ...equipment.filter((item) => !["kettlebell_12", "dumbbell"].includes(item)).map((item) => ({ id: crypto.randomUUID(), equipmentType: item === "skipping_rope" ? "rope" as const : item === "chair" ? "bench" as const : item as "mat", quantity: 1, active: true, createdAt: now, updatedAt: now })), ...(equipment.includes("dumbbell") ? [{ id: crypto.randomUUID(), equipmentType: "dumbbell" as const, weightKg: dumbbellKg, quantity: 1, active: true, createdAt: now, updatedAt: now }] : [])],
      defaultKettlebellKg: kettlebells[0]!.weightKg,
      defaultDumbbellKg: equipment.includes("dumbbell") ? dumbbellKg : undefined,
      createdAt: new Date().toISOString()
    };
    await profileRepository.save(profile);
    dispatch(setProfile(profile));
  };

  const toggle = (id: Equipment) => {
    setEquipment((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setError("");
  };

  return (
    <main className="onboarding">
      <section className="onboarding-copy">
        <span className="brand"><img src="/icon.svg" className="brand-mark" alt="" />bellgrinda.</span>
        <p className="kicker">Show up. Get stronger.</p>
        <h1>Your bells.<br />A stronger you.</h1>
        <p>Build strength with kettlebell and bodyweight workouts that meet you where you are.</p>
        <div className="onboarding-art"><KettlebellArt /></div>
      </section>
      <form className="setup-form" onSubmit={submit}>
        <div>
          <p className="step-label">Set up your first cycle</p>
          <h2>Start with what you have</h2>
        </div>
        <label className="field">
          <span>Your name</span>
          <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="given-name" placeholder="Name" />
        </label>
        <fieldset>
          <legend>Available equipment</legend>
          <div className="equipment-list">
            {choices.map((choice) => {
              const selected = equipment.includes(choice.id);
              return (
                <button type="button" aria-pressed={selected} className={`equipment-option${selected ? " selected" : ""}`} onClick={() => toggle(choice.id)} key={choice.id}>
                  <span className="equipment-icon">{selected ? <Check size={20} weight="bold" /> : <Barbell size={20} />}</span>
                  <span><strong>{choice.label}</strong><small>{choice.note}</small></span>
                </button>
              );
            })}
          </div>
        </fieldset>
        {equipment.includes("kettlebell_12") ? <KettlebellEditor items={equipmentItems} onChange={setEquipmentItems} /> : null}
        {equipment.includes("dumbbell") ? <label className="field">
          <span>Your dumbbell weight</span>
          <span className="weight-input"><input type="number" inputMode="decimal" min="1" max="200" step="0.5" value={dumbbellKg} onChange={(event) => setDumbbellKg(Math.max(1, Number(event.target.value)))} /><small>kg</small></span>
        </label> : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <button className="button primary" type="submit">Create my plan</button>
        <p className="privacy-note">Your first workouts stay on this device.</p>
      </form>
    </main>
  );
}
