import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LocateFixed } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitStation } from "@/lib/community";
import {
  CITIES,
  EQUIPMENT_LABEL,
  type EquipmentId,
  type StationKind,
} from "@/lib/parks";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aportar")({
  component: AportarPage,
});

const EQUIPMENT_OPTIONS: EquipmentId[] = [
  "barras-altas",
  "barras-medias",
  "barras-bajas",
  "paralelas",
  "anillas",
  "espaldera",
  "dips",
  "bancos",
  "pesas",
  "jaula",
];

const KINDS: { id: StationKind; label: string }[] = [
  { id: "calistenia", label: "Calistenia" },
  { id: "mixto", label: "Mixto" },
  { id: "biosaludable", label: "Biosaludable" },
];

function AportarPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [city, setCity] = useState<(typeof CITIES)[number]>("Bogotá");
  const [localidad, setLocalidad] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [kind, setKind] = useState<StationKind>("calistenia");
  const [equipment, setEquipment] = useState<EquipmentId[]>(["barras-altas"]);
  const [hours, setHours] = useState("Libre");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const toggleEq = (id: EquipmentId) => {
    setEquipment((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const locate = () => {
    if (!navigator.geolocation) {
      setError("Este navegador no comparte ubicación.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(5));
        setLng(pos.coords.longitude.toFixed(5));
        setError(null);
      },
      () => setError("No se pudo leer la ubicación."),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const latN = Number(lat);
    const lngN = Number(lng);
    if (!Number.isFinite(latN) || !Number.isFinite(lngN)) {
      setError("Faltan coordenadas. Usa tu ubicación o pégalas del mapa.");
      return;
    }
    if (equipment.length === 0) {
      setError("Marca al menos un aparato.");
      return;
    }
    setPending(true);
    try {
      const { id } = await submitStation({
        data: {
          name,
          city,
          localidad,
          address,
          lat: latN,
          lng: lngN,
          kind,
          equipment,
          hours,
          summary,
        },
      });
      await navigate({ to: "/parque/$id", params: { id } });
    } catch {
      setError("No se pudo publicar. Revisa los campos e inténtalo de nuevo.");
    } finally {
      setPending(false);
    }
  };

  return (
    <AppShell>
      <main className="mx-auto max-w-xl px-4 py-8">
        <p className="text-xs uppercase tracking-widest text-subtle">
          Comunidad
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
          Aportar una estación
        </h1>
        <p className="mt-2 text-sm text-muted">
          Gratis y abierto. Si entrenas en un parque que no está, súbelo para
          el resto de la escena. Sin datos personales: solo el spot.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Nombre del parque o módulo">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={80}
              placeholder="Barras parque El Carmelo"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Ciudad">
              <select
                value={city}
                onChange={(e) =>
                  setCity(e.target.value as (typeof CITIES)[number])
                }
                className="flex h-11 w-full rounded-md border border-border bg-elevated px-3 text-sm text-fg"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Barrio o localidad">
              <Input
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
                maxLength={60}
                placeholder="Chapinero, El Poblado…"
              />
            </Field>
          </div>

          <Field label="Dirección o cruce">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              minLength={5}
              maxLength={160}
              placeholder="Calle 88 con Carrera 15"
            />
          </Field>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Coordenadas</Label>
              <Button type="button" size="sm" variant="secondary" onClick={locate}>
                <LocateFixed className="size-3.5" />
                Usar mi ubicación
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                inputMode="decimal"
                placeholder="4.67424"
                aria-label="Latitud"
                required
              />
              <Input
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                inputMode="decimal"
                placeholder="-74.05630"
                aria-label="Longitud"
                required
              />
            </div>
          </div>

          <Field label="Tipo de estación">
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  type="button"
                  onClick={() => setKind(k.id)}
                  className={cn(
                    "h-9 rounded-full border px-3 text-xs font-medium",
                    kind === k.id
                      ? "border-accent bg-accent text-accent-fg"
                      : "border-border bg-elevated text-muted",
                  )}
                >
                  {k.label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Equipo">
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => {
                const on = equipment.includes(eq);
                return (
                  <button
                    key={eq}
                    type="button"
                    onClick={() => toggleEq(eq)}
                    className={cn(
                      "h-9 rounded-full border px-3 text-xs font-medium",
                      on
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border bg-elevated text-muted",
                    )}
                  >
                    {EQUIPMENT_LABEL[eq]}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Horario (opcional)">
            <Input
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              maxLength={120}
              placeholder="Libre · mejor 6:00–8:00"
            />
          </Field>

          <Field label="Qué hay y por qué vale el viaje">
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              minLength={12}
              maxLength={400}
              placeholder="Barras altas, paralelas y buen piso de caucho. Se llena los sábados a las 8."
            />
          </Field>

          {error && <p className="text-sm text-warn">{error}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Publicando…" : "Publicar estación"}
          </Button>
        </form>
      </main>
    </AppShell>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
