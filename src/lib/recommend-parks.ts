import { haversineKm } from "@/lib/geo";
import type { EquipmentId, Park } from "@/lib/parks";

export const TRAINING_GOALS = [
  { id: "fuerza", label: "Fuerza", terms: ["fuerza", "pesas", "volumen", "barras", "hiit"] },
  { id: "dominadas", label: "Dominadas", terms: ["dominadas", "barras", "street workout"] },
  { id: "fondos", label: "Fondos y empuje", terms: ["paralelas", "fondos", "empuje"] },
  { id: "skills", label: "Skills", terms: ["skills", "muscle-up", "anillas"] },
  { id: "piernas", label: "Piernas y acondicionamiento", terms: ["pierna", "hiit", "full body", "volumen"] },
  { id: "inicio", label: "Empezar", terms: ["principiantes", "principiante", "barrio"] },
] as const;

export type TrainingGoal = (typeof TRAINING_GOALS)[number]["id"];

export const TRAINING_EQUIPMENT: EquipmentId[] = [
  "barras-altas", "paralelas", "anillas", "espaldera", "pesas", "jaula",
];

export interface Recommendation {
  park: Park;
  score: number;
  distanceKm?: number;
  reasons: string[];
}

export function recommendParks(
  parks: Park[],
  goal: TrainingGoal,
  requiredEquipment: EquipmentId[],
  location: { lat: number; lng: number } | null,
): Recommendation[] {
  const selectedGoal = TRAINING_GOALS.find((item) => item.id === goal);
  if (!selectedGoal) return [];

  return parks
    .filter((park) => requiredEquipment.every((item) => park.equipment.includes(item)))
    .map((park) => {
      const tags = park.bestFor.join(" ").toLocaleLowerCase("es");
      const goalMatch = selectedGoal.terms.some((term) => tags.includes(term));
      const distanceKm = location
        ? haversineKm(location.lat, location.lng, park.lat, park.lng)
        : undefined;
      const distanceScore = distanceKm === undefined ? 0 : Math.max(0, 10 - distanceKm / 2);
      const score = Math.round(
        (goalMatch ? 50 : 25) + park.score * 3 +
        (requiredEquipment.length ? 15 : 0) + (distanceKm === undefined ? 0 : distanceScore),
      );
      const reasons = [goalMatch ? `Recomendado para ${selectedGoal.label.toLowerCase()}` : `Estación completa para ${selectedGoal.label.toLowerCase()}`];
      if (requiredEquipment.length) reasons.push("Tiene todo el equipo que pediste");
      if (distanceKm !== undefined) reasons.push(`${distanceKm.toFixed(1)} km de ti`);
      return { park, score, distanceKm, reasons };
    })
    .sort((a, b) => b.score - a.score || b.park.score - a.park.score)
    .slice(0, 3);
}
