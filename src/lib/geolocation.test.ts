import assert from "node:assert/strict";
import { test } from "node:test";
import { geolocationErrorMessage, stopGeolocationWatch } from "./geolocation.ts";

test("geolocalización explica permiso, timeout y errores generales", () => {
  assert.match(geolocationErrorMessage(1), /Permiso.*denegado/);
  assert.match(geolocationErrorMessage(3), /tardó demasiado/);
  assert.match(geolocationErrorMessage(2), /No fue posible obtener/);
});

test("limpia el seguimiento GPS activo una sola vez y tolera ausencia de id", () => {
  const cleared: number[] = [];
  const geolocation = { clearWatch: (id: number) => cleared.push(id) };
  stopGeolocationWatch(geolocation, 42);
  stopGeolocationWatch(geolocation, null);
  stopGeolocationWatch(undefined, 43);
  assert.deepEqual(cleared, [42]);
});
