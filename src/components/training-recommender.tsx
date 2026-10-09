import { useMemo, useState } from "react";
import { Dumbbell, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParkCard } from "@/components/park-card";
import { EQUIPMENT_LABEL, type EquipmentId, type Park } from "@/lib/parks";
import { formatKm } from "@/lib/geo";
import { recommendParks, TRAINING_EQUIPMENT, TRAINING_GOALS, type TrainingGoal } from "@/lib/recommend-parks";

export function TrainingRecommender({
  parks,
  location,
  onSelect,
}: {
  parks: Park[];
  location: { lat: number; lng: number } | null;
  onSelect: (park: Park) => void;
}) {
  const [goal, setGoal] = useState<TrainingGoal>("fuerza");
  const [equipment, setEquipment] = useState<EquipmentId[]>([]);
  const recommendations = useMemo(
    () => recommendParks(parks, goal, equipment, location),
    [parks, goal, equipment, location],
  );

  const toggleEquipment = (item: EquipmentId) => {
    setEquipment((current) => current.includes(item)
      ? current.filter((value) => value !== item)
      : [...current, item]);
  };

  return (
    <section className="space-y-3 rounded-xl border border-border bg-surface p-3" aria-labelledby="training-title">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-elevated text-accent"><Sparkles className="size-4" /></span>
        <div>
          <h2 id="training-title" className="text-sm font-semibold">Encuentra tu parque ideal</h2>
          <p className="text-xs text-muted">Objetivo + equipo + cercanía</p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs font-medium text-muted" htmlFor="training-goal">
        <Dumbbell className="size-3.5" /> ¿Qué quieres entrenar?
      </label>
      <select id="training-goal" value={goal} onChange={(event) => setGoal(event.target.value as TrainingGoal)} className="h-10 w-full rounded-lg border border-border bg-elevated px-3 text-sm text-fg">
        {TRAINING_GOALS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>

      <fieldset className="space-y-2">
        <legend className="text-xs font-medium text-muted">Equipo que necesitas en el parque</legend>
        <div className="flex flex-wrap gap-1.5">
          {TRAINING_EQUIPMENT.map((item) => {
            const active = equipment.includes(item);
            return <Button key={item} type="button" size="sm" variant={active ? "default" : "outline"} aria-pressed={active} onClick={() => toggleEquipment(item)} className="h-8 px-2.5 text-xs">{EQUIPMENT_LABEL[item]}</Button>;
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between border-t border-border pt-2">
        <p className="text-xs font-medium text-muted">Mejores opciones</p>
        {location ? <span className="flex items-center gap-1 text-xs text-good"><MapPin className="size-3" />Con distancia</span> : <span className="text-xs text-subtle">Activa ubicación para ordenar por cercanía</span>}
      </div>
      {recommendations.length ? (
        <div className="space-y-2">
          {recommendations.map(({ park, reasons, distanceKm }, index) => (
            <div key={park.id} className="space-y-1">
              <p className="text-[11px] font-medium text-accent">{index === 0 ? "Mejor coincidencia" : `Opción ${index + 1}`} · {reasons.join(" · ")}</p>
              <ParkCard park={park} compact distanceLabel={distanceKm === undefined ? undefined : formatKm(distanceKm)} onSelect={() => onSelect(park)} />
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-border bg-elevated p-3 text-xs text-muted">No hay estaciones que reúnan todo ese equipo en los resultados actuales. Quita un filtro de equipo o amplía la ciudad.</p>
      )}
    </section>
  );
}
