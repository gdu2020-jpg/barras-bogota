import { LocateFixed, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CITIES,
  EQUIPMENT_LABEL,
  LOCALIDADES,
  type EquipmentId,
  type Localidad,
  type StationKind,
} from "@/lib/parks";
import { useAppStore, type SortKey } from "@/lib/store";
import { cn } from "@/lib/utils";

const KINDS: { id: StationKind | "todas"; label: string }[] = [
  { id: "todas", label: "Todas" },
  { id: "calistenia", label: "Calistenia" },
  { id: "mixto", label: "Mixto" },
  { id: "biosaludable", label: "Biosaludable" },
];

const SORTS: { id: SortKey; label: string }[] = [
  { id: "indice", label: "Índice" },
  { id: "distancia", label: "Cercanía" },
  { id: "comunidad", label: "Comunidad" },
];

const EQUIPMENT: EquipmentId[] = [
  "barras-altas",
  "paralelas",
  "anillas",
  "espaldera",
  "pesas",
  "jaula",
];

export function FiltersBar({ onLocate }: { onLocate: () => void }) {
  const filters = useAppStore((s) => s.filters);
  const setFilters = useAppStore((s) => s.setFilters);
  const resetFilters = useAppStore((s) => s.resetFilters);
  const sort = useAppStore((s) => s.sort);
  const setSort = useAppStore((s) => s.setSort);
  const hasLocation = useAppStore((s) => s.userLocation !== null);

  const dirty =
    filters.query !== "" ||
    filters.city !== "Bogotá" ||
    filters.localidad !== "todas" ||
    filters.kind !== "todas" ||
    filters.equipment !== "todas" ||
    !filters.onlyRealBars;

  return (
    <div className="max-w-full space-y-3 overflow-hidden">
      <div className="flex gap-2">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={filters.query}
            onChange={(e) => setFilters({ query: e.target.value })}
            placeholder="Buscar parque, barrio o estación"
            className="pl-9"
            aria-label="Buscar estaciones"
          />
        </div>
        <Button
          type="button"
          variant={hasLocation ? "default" : "secondary"}
          size="icon"
          className="shrink-0"
          aria-label="Usar mi ubicación"
          onClick={onLocate}
        >
          <LocateFixed className="size-4" />
        </Button>
      </div>

      <div className="flex max-w-full gap-2 overflow-x-auto scrollbar-none">
        {SORTS.map((s) => (
          <Chip
            key={s.id}
            active={sort === s.id}
            onClick={() => setSort(s.id)}
          >
            {s.label}
          </Chip>
        ))}
        <Chip
          active={filters.onlyRealBars}
          onClick={() => setFilters({ onlyRealBars: !filters.onlyRealBars })}
        >
          Barras reales
        </Chip>
        {dirty && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full px-3 text-xs text-muted hover:text-fg"
          >
            <X className="size-3.5" />
            Limpiar
          </button>
        )}
      </div>

      <div className="flex max-w-full gap-2 overflow-x-auto scrollbar-none">
        <Chip
          active={filters.city === "todas"}
          onClick={() => setFilters({ city: "todas", localidad: "todas" })}
        >
          Colombia
        </Chip>
        {CITIES.slice(0, 8).map((city) => (
          <Chip
            key={city}
            active={filters.city === city}
            onClick={() => setFilters({ city, localidad: "todas" })}
          >
            {city}
          </Chip>
        ))}
      </div>

      <div className="flex max-w-full gap-2 overflow-x-auto scrollbar-none">
        {KINDS.map((k) => (
          <Chip
            key={k.id}
            active={filters.kind === k.id}
            onClick={() => setFilters({ kind: k.id })}
          >
            {k.label}
          </Chip>
        ))}
      </div>

      <div className="flex max-w-full gap-2 overflow-x-auto scrollbar-none">
        {filters.city === "Bogotá" && (
          <select
            value={filters.localidad}
            onChange={(e) =>
              setFilters({
                localidad: e.target.value as Localidad | "todas",
              })
            }
            className="h-9 max-w-full shrink-0 rounded-full border border-border bg-elevated px-3 text-xs text-fg"
            aria-label="Localidad"
          >
            <option value="todas">Todas las localidades</option>
            {LOCALIDADES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        )}
        {EQUIPMENT.map((eq) => (
          <Chip
            key={eq}
            active={filters.equipment === eq}
            onClick={() =>
              setFilters({
                equipment: filters.equipment === eq ? "todas" : eq,
              })
            }
          >
            {EQUIPMENT_LABEL[eq]}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 items-center rounded-full border px-3 text-xs font-medium transition-colors duration-150",
        active
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-elevated text-muted hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}
