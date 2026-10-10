import { haversineKm } from "./geo.ts";
import type { EquipmentId, Park } from "./parks.ts";

interface GoalProfile {
  id: string;
  label: string;
  tags: string[];
  equipment: EquipmentId[];
  level?: "inicio";
}

const GOAL_PROFILES = [
  {
    id: "fuerza",
    label: "Fuerza",
    tags: ["fuerza", "pesas", "volumen", "barras", "hiit"],
    equipment: ["pesas", "jaula", "barras-altas", "paralelas"],
  },
  {
    id: "dominadas",
    label: "Dominadas",
    tags: ["dominadas", "barras", "muscle-up", "street workout"],
    equipment: ["barras-altas", "barras-medias", "espaldera"],
  },
  {
    id: "fondos",
    label: "Fondos y empuje",
    tags: ["paralelas", "fondos", "empuje", "street workout"],
    equipment: ["paralelas", "dips", "barras-bajas"],
  },
  {
    id: "skills",
    label: "Skills",
    tags: ["skills", "muscle-up", "anillas", "comunidad"],
    equipment: ["anillas", "barras-altas", "paralelas"],
  },
  {
    id: "piernas",
    label: "Piernas y acondicionamiento",
    tags: ["pierna", "hiit", "full body", "volumen"],
    equipment: ["jaula", "pesas", "maquinas", "bancos"],
  },
  {
    id: "inicio",
    label: "Empezar",
    tags: ["principiante", "principiantes", "barrio", "movilidad"],
    equipment: ["barras-altas", "paralelas", "bancos"],
    level: "inicio",
  },
] satisfies GoalProfile[];

export const TRAINING_GOALS = GOAL_PROFILES.map(({ id, label }) => ({ id, label }));
export type TrainingGoal = (typeof GOAL_PROFILES)[number]["id"];

export const TRAINING_EQUIPMENT: EquipmentId[] = [
  "barras-altas",
  "paralelas",
  "anillas",
  "espaldera",
  "pesas",
  "jaula",
];

export interface Recommendation {
  park: Park;
  score: number;
  distanceKm?: number;
  reasons: string[];
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

function goalFit(profile: GoalProfile, park: Park): { points: number; reason: string } {
  const tags = park.bestFor.map(normalize);
  const matchedTags = profile.tags.filter((term) =>
    tags.some((tag) => tag.includes(normalize(term))),
  );
  const equipmentMatches = profile.equipment.filter((item) => park.equipment.includes(item));
  const tagPoints = matchedTags.length ? Math.min(28, 18 + (matchedTags.length - 1) * 5) : 0;
  const equipmentPoints = (equipmentMatches.length / profile.equipment.length) * 12;
  const beginnerPoints = profile.level === "inicio"
    ? (park.level === "inicio" ? 5 : park.level === "todos" ? 3 : 0) + (park.safety === "alta" ? 2 : 0)
    : 0;
  const points = Math.min(45, tagPoints + equipmentPoints + beginnerPoints);

  if (matchedTags.length) {
    return { points, reason: `Ideal para ${profile.label.toLocaleLowerCase("es")}` };
  }
  if (equipmentMatches.length) {
    return { points, reason: `Equipo útil para ${profile.label.toLocaleLowerCase("es")}` };
  }
  return { points, reason: "Buena opción por calidad general" };
}

/** Ranks parks by training fit, verified equipment, quality, and optional proximity. */
export function recommendParks(
  parks: Park[],
  goal: TrainingGoal,
  requiredEquipment: EquipmentId[],
  location: { lat: number; lng: number } | null,
): Recommendation[] {
  const profile = GOAL_PROFILES.find((item) => item.id === goal);
  if (!profile) return [];

  return parks
    .filter((park) => requiredEquipment.every((item) => park.equipment.includes(item)))
    .map((park) => {
      const { points: goalPoints, reason: goalReason } = goalFit(profile, park);
      const qualityPoints = (park.score / 10) * 25;
      const distanceKm = location
        ? haversineKm(location.lat, location.lng, park.lat, park.lng)
        : undefined;
      // Distance helps break ties, without making a low-quality nearby park win by default.
      const proximityPoints = distanceKm === undefined ? 0 : 20 * Math.exp(-distanceKm / 8);
      const score = Math.round(goalPoints + qualityPoints + proximityPoints);
      const reasons = [goalReason];

      if (requiredEquipment.length) reasons.push("Tiene todo el equipo que pediste");
      if (distanceKm !== undefined) reasons.push(`${distanceKm.toFixed(1)} km de ti`);

      return { park, score, distanceKm, reasons };
    })
    .sort((a, b) =>
      b.score - a.score ||
      (a.distanceKm ?? Number.POSITIVE_INFINITY) - (b.distanceKm ?? Number.POSITIVE_INFINITY) ||
      b.park.score - a.park.score,
    )
    .slice(0, 3);
}
