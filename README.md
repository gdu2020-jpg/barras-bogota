# Barras Bogotá

Guía gratuita de estaciones de calistenia en Bogotá y el resto de Colombia. Ranking por calidad de barras — no por máquinas biosaludables.

La app es **gratis**, se puede instalar en el teléfono como PWA y cualquiera de la escena puede aportar un parque.

## Qué hace

- Mapa y lista de spots curados (IDRD, IDU y comunidad de calle)
- Índice de estación: barras, variedad, comunidad, luz, piso, acceso
- Filtros por ciudad, localidad, equipo y tipo
- Rutas de un día (norte, centro, occidente, sur)
- Favoritos en el dispositivo
- Aportes de la comunidad: un calisténico publica un parque y aparece en el mapa

## Cómo contribuir

Lee [CONTRIBUTING.md](CONTRIBUTING.md). El camino más útil:

1. Entrenar en un parque que no está y subirlo con **Aportar**
2. Abrir un issue o un pull request con datos, fotos o código
3. Mejorar el índice, cubrir otra ciudad o moderar aportes

## Desarrollo

```bash
npm install
npm run dev
```

Stack: React 19, TanStack Start, Tailwind v4, Leaflet, Postgres (Neon en deploy, PGLite en local).

- Catálogo curado: `src/lib/parks.ts`
- Aportes: `src/lib/community.ts` + `migrations/0002_stations.sql`
- UI: `src/routes/` y `src/components/`

## Licencia

MIT. Úsala, forkéeala, llévala a tu ciudad.
