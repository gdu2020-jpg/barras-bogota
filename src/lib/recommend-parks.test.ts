import assert from "node:assert/strict";
import { test } from "node:test";
import type { Park } from "./parks.ts";
import {
  recommendParks,
  TRAINING_GOALS,
  type TrainingGoal,
} from "./recommend-parks.ts";

function makePark(overrides: Partial<Park> = {}): Park {
  return {
    id: "test-park",
    name: "Parque de prueba",
    shortName: "Prueba",
    city: "Bogotá",
    localidad: "Chapinero",
    address: "",
    lat: 4.65,
    lng: -74.08,
    kind: "calistenia",
    image: "",
    score: 8,
    scores: { barras: 8, variedad: 8, comunidad: 8, iluminacion: 8, superficie: 8, acceso: 8 },
    equipment: ["barras-altas", "paralelas", "anillas", "espaldera", "pesas", "jaula"],
    lighting: "buena",
    surface: "caucho",
    crowd: "media",
    hours: "",
    transmilenio: [],
    bestFor: [],
    level: "todos",
    safety: "alta",
    summary: "",
    tips: [],
    source: "curated",
    ...overrides,
  };
}

test("cada objetivo reconoce parques compatibles", () => {
  const fixtures: Record<TrainingGoal, Park> = {
    fuerza: makePark({ bestFor: ["pesas"] }),
    dominadas: makePark({ bestFor: ["dominadas"] }),
    fondos: makePark({ bestFor: ["fondos"] }),
    skills: makePark({ bestFor: ["skills"] }),
    piernas: makePark({ bestFor: ["pierna"] }),
    inicio: makePark({ bestFor: ["principiante"], level: "inicio" }),
  };

  for (const { id } of TRAINING_GOALS) {
    const result = recommendParks([fixtures[id as TrainingGoal]], id as TrainingGoal, [], null);
    assert.equal(result.length, 1, `debe recomendar para ${id}`);
    assert.match(result[0].reasons[0], /Ideal para/);
  }
});

test("cada equipo marcado es un requisito obligatorio", () => {
  const park = makePark({ equipment: ["barras-altas", "paralelas"] });
  assert.deepEqual(recommendParks([park], "dominadas", ["barras-altas"], null).map((r) => r.park.id), [park.id]);
  assert.deepEqual(recommendParks([park], "dominadas", ["barras-altas", "anillas"], null), []);
});

test("sin ubicación ordena por calidad y no inventa distancias", () => {
  const lowerQuality = makePark({ id: "lower", score: 6 });
  const higherQuality = makePark({ id: "higher", score: 9 });
  const result = recommendParks([lowerQuality, higherQuality], "fuerza", [], null);
  assert.equal(result[0].park.id, "higher");
  assert.equal(result[0].distanceKm, undefined);
  assert.ok(result.every((item) => !item.reasons.some((reason) => reason.includes("km de ti"))));
});

test("con calidad igual, la cercanía desempata y muestra la distancia", () => {
  const farther = makePark({ id: "farther", lat: 4.8, score: 8 });
  const nearer = makePark({ id: "nearer", lat: 4.651, score: 8 });
  const result = recommendParks([farther, nearer], "fuerza", [], { lat: 4.65, lng: -74.08 });
  assert.equal(result[0].park.id, "nearer");
  assert.ok((result[0].distanceKm ?? Infinity) < (result[1].distanceKm ?? -Infinity));
});
