import { formatKm, haversineKm } from "@/lib/geo";
import type { Park } from "@/lib/parks";
import type { SortKey } from "@/lib/store";

export interface FilterInput {
  query: string;
  city: string;
  localidad: string;
  kind: string;
  equipment: string;
  onlyRealBars: boolean;
}

export function filterParks(
  parks: Park[],
  filters: FilterInput,
  sort: SortKey,
  userLocation: { lat: number; lng: number } | null,
): Park[] {
  const q = filters.query.trim().toLowerCase();
  let list = parks.filter((p) => {
    if (filters.onlyRealBars && !p.equipment.includes("barras-altas")) {
      return false;
    }
    if (filters.city !== "todas" && p.city !== filters.city) return false;
    if (filters.localidad !== "todas" && p.localidad !== filters.localidad) {
      return false;
    }
    if (filters.kind !== "todas" && p.kind !== filters.kind) return false;
    if (
      filters.equipment !== "todas" &&
      !p.equipment.includes(filters.equipment as Park["equipment"][number])
    ) {
      return false;
    }
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.shortName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.localidad.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.bestFor.some((b) => b.toLowerCase().includes(q))
    );
  });

  list = [...list].sort((a, b) => {
    if (sort === "comunidad") return b.scores.comunidad - a.scores.comunidad;
    if (sort === "distancia" && userLocation) {
      return (
        haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        haversineKm(userLocation.lat, userLocation.lng, b.lat, b.lng)
      );
    }
    return b.score - a.score;
  });

  return list;
}

export function distanceLabel(
  park: Park,
  userLocation: { lat: number; lng: number } | null,
): string | undefined {
  if (!userLocation) return undefined;
  return formatKm(
    haversineKm(userLocation.lat, userLocation.lng, park.lat, park.lng),
  );
}
