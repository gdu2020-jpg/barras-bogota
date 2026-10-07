import { useEffect, useState, type ComponentType } from "react";
import type { ParkMapProps } from "@/lib/map-types";

export type { ParkMapProps };

export function ParkMap(props: ParkMapProps) {
  const [Inner, setInner] = useState<ComponentType<ParkMapProps> | null>(null);

  useEffect(() => {
    let alive = true;
    void import("@/components/park-map-inner").then((mod) => {
      if (alive) setInner(() => mod.ParkMapInner);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (!Inner) {
    return (
      <div className="flex h-full min-h-96 w-full items-center justify-center bg-surface text-sm text-muted">
        Cargando mapa
      </div>
    );
  }

  return <Inner {...props} />;
}
