import { createFileRoute } from "@tanstack/react-router";
import { List, Map as MapIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FiltersBar } from "@/components/filters-bar";
import { ParkCard } from "@/components/park-card";
import { ParkMap } from "@/components/park-map";
import { TrainingRecommender } from "@/components/training-recommender";
import { Button } from "@/components/ui/button";
import { listCommunityStations } from "@/lib/community";
import { distanceLabel, filterParks } from "@/lib/filter-parks";
import { PARKS } from "@/lib/parks";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const community = await listCommunityStations();
      return { community };
    } catch {
      return { community: [] };
    }
  },
  component: Home,
});

function Home() {
  const { community } = Route.useLoaderData();
  const filters = useAppStore((s) => s.filters);
  const sort = useAppStore((s) => s.sort);
  const selectedId = useAppStore((s) => s.selectedId);
  const setSelectedId = useAppStore((s) => s.setSelectedId);
  const userLocation = useAppStore((s) => s.userLocation);
  const setUserLocation = useAppStore((s) => s.setUserLocation);
  const setSort = useAppStore((s) => s.setSort);
  const [view, setView] = useState<"split" | "map" | "list">("split");
  const [geoError, setGeoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [centerOnUserKey, setCenterOnUserKey] = useState(0);
  const watchId = useRef<number | null>(null);

  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation?.clearWatch(watchId.current);
  }, []);

  const catalog = useMemo(() => {
    const seen = new Set(PARKS.map((p) => p.id));
    return [...PARKS, ...community.filter((p) => !seen.has(p.id))];
  }, [community]);

  const parks = useMemo(
    () => filterParks(catalog, filters, sort, userLocation),
    [catalog, filters, sort, userLocation],
  );

  const locate = () => {
    if (!navigator.geolocation) {
      setGeoError("Este navegador no comparte ubicación.");
      return;
    }
    setLocating(true);
    setGeoError(null);
    setSort("distancia");
    setSelectedId(null);
    setCenterOnUserKey((current) => current + 1);
    if (watchId.current !== null) {
      setLocating(false);
      return;
    }
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationAccuracy(pos.coords.accuracy);
        setLocating(false);
        setGeoError(null);
      },
      (error) => {
        setLocating(false);
        setGeoError(error.code === GeolocationPositionError.PERMISSION_DENIED
          ? "Permiso de ubicación denegado. Puedes seguir explorando el mapa."
          : "No se pudo leer la ubicación. Revisa el permiso e inténtalo de nuevo.");
        if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 },
    );
  };

  return (
    <AppShell>
      <div className="mx-auto grid min-w-0 max-w-6xl gap-0 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <aside className="flex min-w-0 flex-col border-b border-border lg:h-[calc(100dvh-3.5rem)] lg:border-b-0 lg:border-r">
          <div className="space-y-4 p-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-subtle">
                {catalog.length} estaciones · gratis
              </p>
              <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                Dónde entrenar en Colombia
              </h1>
              <p className="mt-1 text-sm text-muted">
                Ranking por calidad de barras. La comunidad suma parques de
                Bogotá y del país.
              </p>
            </div>
            <FiltersBar onLocate={locate} locating={locating} />
            {geoError && <p className="text-xs text-warn">{geoError}</p>}
            <TrainingRecommender
              parks={parks}
              location={userLocation}
              onSelect={(park) => {
                setSelectedId(park.id);
                setView("map");
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-subtle">{parks.length} resultados</p>
              <div className="flex rounded-md border border-border p-0.5 lg:hidden">
                <Button
                  type="button"
                  size="sm"
                  variant={view === "list" ? "default" : "ghost"}
                  onClick={() => setView("list")}
                  aria-label="Ver lista"
                >
                  <List />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={view === "map" ? "default" : "ghost"}
                  onClick={() => setView("map")}
                  aria-label="Ver mapa"
                >
                  <MapIcon />
                </Button>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "min-w-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4",
              view === "map" && "hidden lg:block",
            )}
          >
            {parks.length === 0 ? (
              <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted">
                Ninguna estación coincide. Prueba otra ciudad o quita Barras
                reales.
              </p>
            ) : (
              parks.map((park) => (
                <ParkCard
                  key={park.id}
                  park={park}
                  selected={selectedId === park.id}
                  distanceLabel={distanceLabel(park, userLocation)}
                  onSelect={() => {
                    setSelectedId(park.id);
                    setView("map");
                  }}
                />
              ))
            )}
          </div>
        </aside>

        <section
          className={cn(
            "relative min-h-96 min-w-0 overflow-hidden lg:h-[calc(100dvh-3.5rem)]",
            view === "list" && "hidden lg:block",
          )}
        >
          <ParkMap
            parks={parks}
            selectedId={selectedId}
            userLocation={userLocation}
            locationAccuracy={locationAccuracy}
            centerOnUserKey={centerOnUserKey}
            onSelect={(id) => setSelectedId(id)}
          />
        </section>
      </div>
    </AppShell>
  );
}
