import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EquipmentId, Localidad, StationKind } from "@/lib/parks";

export type SortKey = "indice" | "distancia" | "comunidad";

interface Filters {
  query: string;
  city: string;
  localidad: Localidad | "todas";
  kind: StationKind | "todas";
  equipment: EquipmentId | "todas";
  onlyRealBars: boolean;
}

interface AppState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  filters: Filters;
  setFilters: (patch: Partial<Filters>) => void;
  resetFilters: () => void;
  sort: SortKey;
  setSort: (sort: SortKey) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
}

const defaultFilters: Filters = {
  query: "",
  city: "Bogotá",
  localidad: "todas",
  kind: "todas",
  equipment: "todas",
  onlyRealBars: true,
};

export function persistedAppState(state: AppState): Pick<AppState, "favorites"> {
  return { favorites: state.favorites };
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((x) => x !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
      filters: defaultFilters,
      setFilters: (patch) =>
        set((s) => ({ filters: { ...s.filters, ...patch } })),
      resetFilters: () => set({ filters: defaultFilters }),
      sort: "indice",
      setSort: (sort) => set({ sort }),
      selectedId: null,
      setSelectedId: (selectedId) => set({ selectedId }),
      userLocation: null,
      setUserLocation: (userLocation) => set({ userLocation }),
    }),
    {
      name: "barras-bogota",
      partialize: persistedAppState,
    },
  ),
);
