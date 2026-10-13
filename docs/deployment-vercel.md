# Despliegue de prueba en Vercel

Barras Bogotá usa React, TanStack Start y Nitro. vite.config.ts configura el preset Vercel, que sirve las rutas y server functions en funciones Node. npm run build ejecuta Vite y luego migrations. vercel.json selecciona explícitamente TanStack Start. Se conserva el Install Command actual porque Vite, Nitro y TanStack están en dependencies.

## Prueba de exploración

El catálogo curado, filtros, recomendador y mapa funcionan sin credenciales privadas ni base de datos.

1. Importa gdu2020-jpg/barras-bogota en Vercel.
2. Confirma Framework Preset TanStack Start, Root Directory ./, Install Command npm install --omit=dev --no-audit --no-fund y Build Command npm run build. No definas Output Directory manual.
3. En Environment Variables, añade VITE_AUTH_ENABLED=false para Preview antes de desplegar. No es un secreto; la autenticación está activada por defecto en el código y esta variable evita ofrecer un inicio de sesión sin configurar.
4. Deja DATABASE_URL vacío para explorar. El build omite la migración externa si esta variable falta.
5. Verifica que la rama codex/mejoras-recomendador-geolocalizacion produzca un despliegue Preview, nunca Production. Conserva main como rama de producción y no promociones el preview.

Vercel suele elegir main como rama de producción al importar un repo. Antes de iniciar cualquier build, revisa que la rama y el entorno muestren la rama de trabajo y Preview. Los pushes a ramas distintas de la rama de producción generan previews con Git integrado.

## Base de datos

Sin DATABASE_URL, las funciones de datos usan PGLite en memoria. Los aportes comunitarios pueden perderse al reiniciar una función y no son compartidos ni permanentes. No uses la preview para guardar aportes reales.

Para persistir aportes después, configura Postgres compatible con pg (el proyecto contempla Neon) y guarda DATABASE_URL solo en el servidor de Vercel, nunca como VITE_*. npm run build aplica migrations/ automáticamente. Usa una base distinta para Preview y Production: los previews también aplican migraciones durante el build. Sin autenticación, algunas operaciones protegidas fallan de forma deliberada si DATABASE_URL está configurada, para no compartir el usuario de desarrollo.

## Variables

| Variable | Uso | ¿Necesaria para explorar? |
| --- | --- | --- |
| VITE_AUTH_ENABLED=false | Desactiva la autenticación en esta preview | Sí, en Preview |
| DATABASE_URL | PostgreSQL para datos comunitarios persistentes | No |
| VITE_AUTH_ENABLED=true | Activa Better Auth | No |
| GROK_AUTH_CLIENT_ID, GROK_AUTH_CLIENT_SECRET | Credenciales OAuth | Solo si se activa autenticación |
| GROK_AUTH_ISSUER | Emisor OAuth (hay un valor predeterminado) | No |
| BETTER_AUTH_URL | URL pública exacta de la aplicación | Solo con autenticación |
| BETTER_AUTH_SECRET | Secreto privado de Better Auth | Solo con autenticación |
| GROK_CONNECTORS_URL, GROK_CONNECTOR_ACCESS_TOKEN | Integración de Grok Connectors | No |
| VITE_STUN_URLS, VITE_OG_SERVICE_URL, VITE_GROK_EXTENSIONS, VITE_PROJECT_ID, GROK_PROJECT_ID, VITE_PUBLIC_HOSTNAME | Integraciones opcionales P2P, metadatos, Grok o PWA | No |

No publiques DATABASE_URL, GROK_AUTH_CLIENT_SECRET, BETTER_AUTH_SECRET ni tokens. Vercel incluye en el código del navegador todo valor VITE_*.

## Prueba en el teléfono

Abre el enlace HTTPS de Vercel. Revisa catálogo, filtros, recomendador, mapa, permitir/denegar GPS, error GPS y detener seguimiento. La ubicación solo vive en memoria; el estado persistente del navegador guarda únicamente favoritos. Build correcto no verifica la interacción GPS, las teselas de mapa ni servicios externos en el celular.

Fuentes: TanStack Start hosting https://tanstack.com/start/latest/docs/framework/react/guide/hosting; Vercel y TanStack Start https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel; configuración https://vercel.com/docs/project-configuration/vercel-json; Git y previews https://vercel.com/docs/git.


## Actualización de la vista previa

Con el repositorio conectado, un nuevo commit en codex/mejoras-recomendador-geolocalizacion debe generar un despliegue Preview. Comprueba que Vercel indique Preview antes de compartir la URL. No promociones la vista previa a Production.
