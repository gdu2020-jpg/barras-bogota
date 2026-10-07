import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { CIRCUITS, getPark } from "@/lib/parks";

export const Route = createFileRoute("/rutas")({ component: RutasPage });

function RutasPage() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-xs uppercase tracking-widest text-subtle">
          Circuitos
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Rutas de un día
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Tres estaciones por eje. Pensadas para moverse en TransMilenio o
          bici, no para cruzar la ciudad en hora pico.
        </p>

        <ul className="mt-8 space-y-5">
          {CIRCUITS.map((circuit) => {
            const parks = circuit.parkIds
              .map((id) => getPark(id))
              .filter((p) => p != null);
            return (
              <li
                key={circuit.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface"
              >
                <img
                  src={parks[0]?.image}
                  alt=""
                  className="h-40 w-full object-cover"
                />
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-display text-xl font-semibold">
                        {circuit.name}
                      </h2>
                      <p className="mt-1 text-xs uppercase tracking-widest text-subtle">
                        {circuit.area}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {circuit.km} km · {circuit.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">{circuit.blurb}</p>
                  <ol className="space-y-2">
                    {parks.map((park, i) => (
                      <li key={park.id}>
                        <Link
                          to="/parque/$id"
                          params={{ id: park.id }}
                          className="flex items-center gap-3 rounded-lg border border-border bg-elevated px-3 py-2.5 hover:border-muted"
                        >
                          <span className="font-display w-6 text-sm text-subtle">
                            {i + 1}
                          </span>
                          <span className="flex-1 text-sm font-medium">
                            {park.shortName}
                          </span>
                          <span className="text-xs text-muted">
                            {park.localidad}
                          </span>
                          <span className="font-display tabular-nums text-sm">
                            {park.score.toFixed(1)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </AppShell>
  );
}
