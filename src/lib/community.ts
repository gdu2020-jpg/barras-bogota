import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  CITIES,
  type EquipmentId,
  type Park,
  type Scores,
  type StationKind,
} from "@/lib/parks";

const equipmentIds = [
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
  "maquinas",
] as const satisfies readonly EquipmentId[];

const kinds = ["calistenia", "mixto", "biosaludable"] as const satisfies readonly StationKind[];

const submitSchema = z.object({
  name: z.string().trim().min(3).max(80),
  city: z.enum(CITIES),
  localidad: z.string().trim().max(60).default(""),
  address: z.string().trim().min(5).max(160),
  lat: z.number().min(-5).max(13),
  lng: z.number().min(-80).max(-66),
  kind: z.enum(kinds),
  equipment: z.array(z.enum(equipmentIds)).min(1).max(11),
  hours: z.string().trim().max(120).default("Libre"),
  summary: z.string().trim().min(12).max(400),
});

export type SubmitStationInput = z.infer<typeof submitSchema>;

interface StationRow {
  id: string;
  name: string;
  short_name: string;
  city: string;
  localidad: string;
  address: string;
  lat: number;
  lng: number;
  kind: StationKind;
  image: string;
  score: number;
  scores_json: string;
  equipment_json: string;
  lighting: Park["lighting"];
  surface: Park["surface"];
  crowd: Park["crowd"];
  hours: string;
  transmilenio_json: string;
  best_for_json: string;
  level: Park["level"];
  safety: Park["safety"];
  summary: string;
  tips_json: string;
  source: "community";
  featured: boolean;
}

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function rowToPark(row: StationRow): Park {
  const equipment = parseJson<EquipmentId[]>(row.equipment_json, []);
  const scores = parseJson<Scores>(row.scores_json, {
    barras: 7,
    variedad: 6.5,
    comunidad: 7,
    iluminacion: 6.5,
    superficie: 6.5,
    acceso: 7,
  });
  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    city: row.city,
    localidad: row.localidad,
    address: row.address,
    lat: Number(row.lat),
    lng: Number(row.lng),
    kind: row.kind,
    image: row.image,
    score: Number(row.score),
    scores,
    equipment,
    lighting: row.lighting,
    surface: row.surface,
    crowd: row.crowd,
    hours: row.hours,
    transmilenio: parseJson<string[]>(row.transmilenio_json, []),
    bestFor: parseJson<string[]>(row.best_for_json, ["aporte"]),
    level: row.level,
    safety: row.safety,
    summary: row.summary,
    tips: parseJson<string[]>(row.tips_json, []),
    source: "community",
    featured: false,
  };
}

function defaultScores(equipment: EquipmentId[]): Scores {
  const hasBars = equipment.includes("barras-altas");
  const variety = Math.min(9, 5.5 + equipment.length * 0.35);
  return {
    barras: hasBars ? 7.4 : 6.2,
    variedad: Math.round(variety * 10) / 10,
    comunidad: 7.2,
    iluminacion: 6.8,
    superficie: 6.8,
    acceso: 7.0,
  };
}

function indice(s: Scores): number {
  const raw =
    s.barras * 0.34 +
    s.variedad * 0.18 +
    s.comunidad * 0.16 +
    s.iluminacion * 0.1 +
    s.superficie * 0.12 +
    s.acceso * 0.1;
  return Math.round(raw * 10) / 10;
}

export const listCommunityStations = createServerFn({ method: "GET" }).handler(
  async () => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const rows = await sql<StationRow>`
      select * from stations
      where source = 'community'
      order by created_at desc
      limit 200
    `;
    return rows.map(rowToPark);
  },
);

export const submitStation = createServerFn({ method: "POST" })
  .validator(submitSchema)
  .handler(async ({ data }) => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    const scores = defaultScores(data.equipment);
    const score = indice(scores);
    const id = `c-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const shortName =
      data.name.length > 28 ? `${data.name.slice(0, 26).trim()}…` : data.name;
    const image = data.equipment.includes("anillas")
      ? "/parks/rings.jpg"
      : data.equipment.includes("jaula")
        ? "/parks/box.jpg"
        : "/parks/zonal.jpg";
    const hours = data.hours || "Libre";
    const localidad = data.localidad || data.city;

    await sql`
      insert into stations (
        id, name, short_name, city, localidad, address, lat, lng, kind, image,
        score, scores_json, equipment_json, lighting, surface, crowd, hours,
        transmilenio_json, best_for_json, level, safety, summary, tips_json, source
      ) values (
        ${id},
        ${data.name},
        ${shortName},
        ${data.city},
        ${localidad},
        ${data.address},
        ${data.lat},
        ${data.lng},
        ${data.kind},
        ${image},
        ${score},
        ${JSON.stringify(scores)},
        ${JSON.stringify(data.equipment)},
        ${"regular"},
        ${"mixto"},
        ${"media"},
        ${hours},
        ${"[]"},
        ${JSON.stringify(["aporte", "comunidad"])},
        ${"todos"},
        ${"media"},
        ${data.summary},
        ${JSON.stringify(["Aporte de la comunidad. Verifica el equipo al llegar."])},
        ${"community"}
      )
    `;

    return { id };
  });
