import assert from "node:assert/strict";
import { test } from "node:test";
import { persistedAppState } from "./store.ts";

test("el estado persistente excluye la ubicación personal", () => {
  const state = {
    favorites: ["park-1"],
    userLocation: { lat: 4.65, lng: -74.08 },
  } as Parameters<typeof persistedAppState>[0];
  assert.deepEqual(persistedAppState(state), { favorites: ["park-1"] });
});
