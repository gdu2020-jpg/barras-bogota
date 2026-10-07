import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ParkCard } from "@/components/park-card";
import { Button } from "@/components/ui/button";
import { useHasHydrated } from "@/lib/hydrate";
import { PARKS } from "@/lib/parks";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/favoritos")({
  component: FavoritosPage,
});

function FavoritosPage() {
  const hydrated = useHasHydrated();
  const favorites = useAppStore((s) => s.favorites);
  const parks = hydrated
    ? PARKS.filter((p) => favorites.includes(p.id)).sort(
        (a, b) => b.score - a.score,
      )
    : [];

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-xs uppercase tracking-widest text-subtle">
          Guardados
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Favoritos
        </h1>
        <p className="mt-2 text-sm text-muted">
          Se quedan en este dispositivo. Úsalos para armar tu circuito de la
          semana.
        </p>

        {!hydrated ? (
          <p className="mt-10 text-sm text-muted">Cargando favoritos…</p>
        ) : parks.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted">
              Aún no has marcado estaciones. Abre una ficha y guarda las que
              valgan el viaje.
            </p>
            <Button asChild className="mt-5">
              <Link to="/">Explorar mapa</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {parks.map((park) => (
              <ParkCard key={park.id} park={park} />
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
