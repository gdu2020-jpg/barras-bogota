export function geolocationErrorMessage(code: number): string {
  if (code === 1) {
    return "Permiso de ubicación denegado. Actívalo en los permisos del navegador y vuelve a intentarlo; el mapa sigue disponible.";
  }
  if (code === 3) {
    return "El GPS tardó demasiado. Comprueba la señal y vuelve a pulsar «Cerca de mí».";
  }
  return "No fue posible obtener la ubicación. Comprueba el GPS y vuelve a intentarlo.";
}

export function stopGeolocationWatch(
  geolocation: Pick<Geolocation, "clearWatch"> | undefined,
  watchId: number | null,
): void {
  if (geolocation && watchId !== null) geolocation.clearWatch(watchId);
}
