import { useState } from "react";
import type { UserEquipment } from "@bellgrinda/domain";

type WeightEquipment = "kettlebell" | "dumbbell" | "barbell";

export function WeightEquipmentEditor({ items, onChange, equipmentType, title, defaultWeight }: { items: UserEquipment[]; onChange: (items: UserEquipment[]) => void; equipmentType: WeightEquipment; title: string; defaultWeight: number }) {
  const [weight, setWeight] = useState(defaultWeight);
  const [quantity, setQuantity] = useState(1);
  const equipment = items.filter((item) => item.equipmentType === equipmentType && item.active);
  const add = () => {
    const existing = equipment.find((item) => item.weightKg === weight);
    if (existing) {
      onChange(items.map((item) => item.id === existing.id ? { ...item, quantity: item.quantity + quantity, updatedAt: new Date().toISOString() } : item));
      return;
    }
    const now = new Date().toISOString();
    onChange([...items, { id: crypto.randomUUID(), equipmentType, weightKg: weight, quantity, active: true, createdAt: now, updatedAt: now }]);
  };
  const update = (id: string, patch: Partial<UserEquipment>) => onChange(items.map((item) => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
  return <section className="kettlebell-editor">
    <div><p className="kicker">{title}</p><h3>Every weight you own</h3><p>Enter total weight per implement. You can still record a different actual load during training.</p></div>
    <div className="kettlebell-rows">
      {equipment.map((item) => <div className="kettlebell-row" key={item.id}>
        <label>Weight <span className="weight-input"><input aria-label={`${title} weight`} type="number" min="1" max={equipmentType === "barbell" ? 500 : 200} step="0.5" value={item.weightKg} onChange={(event) => update(item.id, { weightKg: Math.max(1, Number(event.target.value)) })} /><small>kg</small></span></label>
        <label>Quantity <input aria-label="Kettlebell quantity" type="number" min="1" max="20" value={item.quantity} onChange={(event) => update(item.id, { quantity: Math.max(1, Number(event.target.value)) })} /></label>
        <button type="button" className="text-link danger" onClick={() => onChange(items.filter((candidate) => candidate.id !== item.id))}>Remove</button>
      </div>)}
    </div>
    <div className="kettlebell-add">
      <label>Weight <span className="weight-input"><input type="number" min="1" max="200" step="0.5" value={weight} onChange={(event) => setWeight(Math.max(1, Number(event.target.value)))} /><small>kg</small></span></label>
      <label>Quantity <input type="number" min="1" max="20" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} /></label>
      <button type="button" className="button secondary" onClick={add}>+ Add weight</button>
    </div>
  </section>;
}

export function KettlebellEditor({ items, onChange }: { items: UserEquipment[]; onChange: (items: UserEquipment[]) => void }) {
  return <WeightEquipmentEditor items={items} onChange={onChange} equipmentType="kettlebell" title="Kettlebells" defaultWeight={12} />;
}
