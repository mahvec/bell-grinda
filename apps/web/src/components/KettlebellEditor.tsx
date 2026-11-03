import { useState } from "react";
import type { UserEquipment } from "@bellgrinda/domain";

export function KettlebellEditor({ items, onChange }: { items: UserEquipment[]; onChange: (items: UserEquipment[]) => void }) {
  const [weight, setWeight] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const kettlebells = items.filter((item) => item.equipmentType === "kettlebell" && item.active);
  const add = () => {
    const existing = kettlebells.find((item) => item.weightKg === weight);
    if (existing) {
      onChange(items.map((item) => item.id === existing.id ? { ...item, quantity: item.quantity + quantity, updatedAt: new Date().toISOString() } : item));
      return;
    }
    const now = new Date().toISOString();
    onChange([...items, { id: crypto.randomUUID(), equipmentType: "kettlebell", weightKg: weight, quantity, active: true, createdAt: now, updatedAt: now }]);
  };
  const update = (id: string, patch: Partial<UserEquipment>) => onChange(items.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  return <section className="kettlebell-editor">
    <div><p className="kicker">Kettlebells</p><h3>Every bell you own</h3><p>Loads remain exercise-specific. Adding a heavy bell never approves it automatically.</p></div>
    <div className="kettlebell-rows">
      {kettlebells.map((item) => <div className="kettlebell-row" key={item.id}>
        <label>Weight <span className="weight-input"><input aria-label="Kettlebell weight" type="number" min="1" max="200" step="0.5" value={item.weightKg} onChange={(event) => update(item.id, { weightKg: Math.max(1, Number(event.target.value)) })} /><small>kg</small></span></label>
        <label>Quantity <input aria-label="Kettlebell quantity" type="number" min="1" max="20" value={item.quantity} onChange={(event) => update(item.id, { quantity: Math.max(1, Number(event.target.value)) })} /></label>
        <button type="button" className="text-link danger" onClick={() => onChange(items.filter((candidate) => candidate.id !== item.id))}>Remove</button>
      </div>)}
    </div>
    <div className="kettlebell-add">
      <label>Weight <span className="weight-input"><input type="number" min="1" max="200" step="0.5" value={weight} onChange={(event) => setWeight(Math.max(1, Number(event.target.value)))} /><small>kg</small></span></label>
      <label>Quantity <input type="number" min="1" max="20" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} /></label>
      <button type="button" className="button secondary" onClick={add}>+ Add kettlebell</button>
    </div>
  </section>;
}
