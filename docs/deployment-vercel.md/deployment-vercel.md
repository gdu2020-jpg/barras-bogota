# Despliegue de prueba en Vercel

Esta aplicación usa React, TanStack Start y Nitro. vite.config.ts genera funciones de servidor para Vercel. El build ejecuta npm run build: Vite compila la app y luego se ejecutan las migraciones. vercel.json selecciona el framework tanstack-start y conserva el comando de instalación actual.

## Vista previa sin servicios externos

El catálogo, los filtros, el recomendador y el mapa no requieren base de datos ni credenciales privadas. Para esta primera prueba:

1. Importa gdu2020-jpg/barras-bogota en Vercel.
2. Confirma Framework Preset: TanStack Start, Root Directory: ./, Install Command: npm install --omit=dev --no-audit --no-fund y Build Command: npm run build. No hace falta definir Output Directory manual.
3. En Environment Variables, configura VITE_AUTH_ENABLED=false en Preview antes de desplegar. No es un secreto; evita mostrar un inicio de sesión que no se ha configurado para Vercel.
4. Mantén DATABASE_URL sin configurar para la prueba de exploración. El build omite la migración externa si la variable falta y la app abre sin Postgres.
5. Usa el despliegue de codex/mejoras-recomendador-geolocalizacion y verifica que Vercel lo marque Preview, no Production. Conserva main como rama de producción; no crees dominios personalizados ni promociones el preview.

Vercel suele escoger main como rama de producción al importar un repositorio. Revisa el entorno y la rama antes de iniciar una compilación. Cada push a una rama distinta de producción genera un Preview cuando el proyecto está conectado a Git.

## Base de datos y aportes

DATABASE_URL es opcional para explorar. Sin ella, el servidor usa PGLite en memoria para datos comunitarios; el contenido puede desaparecer al reiniciar una función y no es almacenamiento compartido o permanente. No aceptes aportes reales en esta preview sin una base persistente.

Para conservar aportes más adelante, configura Postgres compatible con pg (el código contempla Neon) y añade DATABASE_URL como variable solo del servidor, nunca con prefijo VITE_. npm run build aplica automáticamente las migraciones de migrations/. Usa una base separada para Preview y Production: los previews también ejecutan migraciones en su build. No reutilices una base de producción para previews.

Si DATABASE_URL existe y la autenticación está desactivada, algunas operaciones protegidas rechazan solicitudes para no compartir una cuenta de desarrollo entre visitantes. No combines una base compartida con VITE_AUTH_ENABLED=false.

## Variables de entorno

| Variable | Uso | ¿Necesaria para explorar? |
| --- | --- | --- |
| VITE_AUTH_ENABLED=false | Desactiva autenticación para esta preview sin credenciales | Sí, en Preview |
| DATABASE_URL | Conexión server-side a Postgres; el build aplica migraciones | No; solo para datos comunitarios persistentes |
| VITE_AUTH_ENABLED=true | Activa Better Auth | No |
| GROK_AUTH_CLIENT_ID, GROK_AUTH_CLIENT_SECRET | Cliente OAuth del proveedor de identidad | No; requeridas si se activa OAuth |
| GROK_AUTH_ISSUER | Emisor OAuth; el código tiene un valor predeterminado | No; solo para un emisor distinto |
| BETTER_AUTH_URL | URL pública exacta para Better Auth | No; necesaria al configurar autenticación |
| BETTER_AUTH_SECRET | Secreto de Better Auth, solo servidor | No; necesario al configurar autenticación |
| GROK_CONNECTORS_URL, GROK_CONNECTOR_ACCESS_TOKEN | Integración de Grok/Connectors | No; no interviene en el catálogo público |
| VITE_STUN_URLS, VITE_OG_SERVICE_URL, VITE_GROK_EXTENSIONS, VITE_PROJECT_ID, GROK_PROJECT_ID, VITE_PUBLIC_HOSTNAME | Integraciones opcionales P2P, metadatos o entorno Grok/PWA | No |

Nunca guardes DATABASE_URL, GROK_AUTH_CLIENT_SECRET, BETTER_AUTH_SECRET ni tokens en el repositorio o en variables VITE_*. Vercel incluye en el navegador los valores con prefijo VITE_.

## Pruebas manuales después del despliegue

- Abre la URL *.vercel.app desde el teléfono; el HTTPS es necesario para GPS.
- Comprueba catálogo, filtros, recomendador y mapa antes de conceder ubicación.
- Prueba permitir y denegar GPS, error de ubicación y detener seguimiento.
- Verifica que la ubicación personal no siga tras recargar: GPS vive solo en memoria; el almacenamiento local guarda únicamente favoritos.
- Sin Postgres, los aportes no son persistentes; no uses esta preview para datos reales.
- Revisa Deployments → Logs si falla una ruta. Build verde no verifica GPS, mosaicos del mapa en teléfono ni servicios externos.

## Fuentes

- TanStack Start hosting: https://tanstack.com/start/latest/docs/framework/react/guide/hosting
- Vercel y TanStack Start: https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel
- Configuración vercel.json: https://vercel.com/docs/project-configuration/vercel-json
- Despliegues Git y previews: https://vercel.com/docs/git
