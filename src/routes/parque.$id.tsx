import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Navigation, Shield, Sun } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { FavoriteButton } from "@/components/favorite-button";
import { ScoreMark } from "@/components/score-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { listCommunityStations } from "@/lib/community";
import {
  EQUIPMENT_LABEL,
  KIND_LABEL,
  PARKS,
  getPark,
  nearbyParks,
  type Park,
  type Scores,
} from "@/lib/parks";

export const Route = createFileRoute("/parque/$id")({
  component: ParkDetail,
  loader: async ({ params }) => {
    const curated = getPark(params.id);
    let community: Park[] = [];
    try {
      community = await listCommunityStations();
    } catch {
      community = [];
    }
    const park = curated ?? community.find((p) => p.id === params.id);
    if (!park) throw notFound();
    return { park, catalog: [...PARKS, ...community] };
  },
  notFoundComponent: () => (
    <AppShell>
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Estación no encontrada
        </h1>
        <p className="mt-2 text-sm text-muted">
          Esa ficha no está en el mapa.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Volver a explorar</Link>
        </Button>
      </main>
    </AppShell>
  ),
});

const SCORE_LABEL: Record<keyof Scores, string> = {
  barras: "Barras",
  variedad: "Variedad",
  comunidad: "Comunidad",
  iluminacion: "Iluminación",
  superficie: "Piso",
  acceso: "Acceso",
};

const LIGHT_LABEL = {
  buena: "Buena",
  regular: "Regular",
  escasa: "Escasa",
} as const;

const SAFETY_LABEL = {
  alta: "Zona transitada",
  media: "Precaución habitual",
  precaucion: "Mejor de día",
} as const;

function ParkDetail() {
  const { park, catalog } = Route.useLoaderData();
  const nearby = nearbyParks(park, catalog);
  const maps = `https://www.google.com/maps/dir/?api=1&destination=${park.lat},${park.lng}`;

  return (
    <AppShell>
      <main className="mx-auto max-w-3xl overflow-x-hidden">
        <div className="relative">
          <img
            src={park.image}
            alt=""
            className="h-56 w-full object-cover sm:h-72"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Button asChild variant="secondary" size="icon">
              <Link to="/" aria-label="Volver">
                <ArrowLeft />
              </Link>
            </Button>
            <FavoriteButton id={park.id} />
          </div>
        </div>

        <div className="space-y-6 px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={park.kind === "calistenia" ? "accent" : "outline"}
                >
                  {KIND_LABEL[park.kind]}
                </Badge>
                {park.source === "community" && (
                  <Badge variant="good">Aporte</Badge>
                )}
                <Badge variant="outline">{park.city}</Badge>
                <Badge variant="outline">{park.localidad}</Badge>
                <Badge variant="outline">{park.level}</Badge>
              </div>
              <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                {park.name}
              </h1>
              <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {park.address}
              </p>
            </div>
            <ScoreMark score={park.score} size="lg" />
          </div>

          <p className="text-sm leading-relaxed text-fg/90">{park.summary}</p>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={maps} target="_blank" rel="noreferrer">
                <Navigation className="size-4" />
                Cómo llegar
              </a>
            </Button>
            <Button asChild variant="secondary">
              <a
                href={`https://waze.com/ul?ll=${park.lat},${park.lng}&navigate=yes`}
                target="_blank"
                rel="noreferrer"
              >
                Waze
              </a>
            </Button>
          </div>

          <Separator />

          <section>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-subtle">
              Índice de estación
            </h2>
            <ul className="mt-4 space-y-3">
              {(Object.keys(SCORE_LABEL) as (keyof Scores)[]).map((key) => (
                <li key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted">{SCORE_LABEL[key]}</span>
                    <span className="tabular-nums text-fg">
                      {park.scores[key].toFixed(1)}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${park.scores[key] * 10}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-subtle">
              Equipo
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {park.equipment.map((eq) => (
                <Badge key={eq} variant="default">
                  {EQUIPMENT_LABEL[eq]}
                </Badge>
              ))}
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            <Fact icon={Clock} label="Horario" value={park.hours} />
            <Fact
              icon={Sun}
              label="Iluminación"
              value={LIGHT_LABEL[park.lighting]}
            />
            <Fact
              icon={Shield}
              label="Ambiente"
              value={SAFETY_LABEL[park.safety]}
            />
          </section>

          {park.transmilenio.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-subtle">
                TransMilenio
              </h2>
              <p className="mt-2 text-sm text-muted">
                {park.transmilenio.join(" · ")}
              </p>
            </section>
          )}

          <section>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-subtle">
              Bueno para
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {park.bestFor.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-subtle">
              Notas de entrenamiento
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {park.tips.map((tip) => (
                <li key={tip} className="border-l border-border pl-3">
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {nearby.length > 0 && (
            <section>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-subtle">
                Cerca de aquí
              </h2>
              <ul className="mt-3 space-y-2">
                {nearby.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/parque/$id"
                      params={{ id: p.id }}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-3 hover:border-muted"
                    >
                      <span>
                        <span className="block text-sm font-medium">
                          {p.shortName}
                        </span>
                        <span className="text-xs text-muted">
                          {p.city} · {p.localidad}
                        </span>
                      </span>
                      <span className="font-display text-lg tabular-nums">
                        {p.score.toFixed(1)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </AppShell>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-subtle">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="mt-2 text-sm leading-snug text-fg">{value}</p>
    </div>
  );
}
