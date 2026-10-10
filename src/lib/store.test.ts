import assert from "node:assert/strict";
import { test } from "node:test";
import { persistedAppState, type AppState } from "./store.ts";

test("el estado persistente excluye la ubicación personal", () => {
  const state = {
    favorites: ["park-1"],
    userLocation: { lat: 4.65, lng: -74.08 },
  } as AppState;
  assert.deepEqual(persistedAppState(state), { favorites: ["park-1"] });
});
