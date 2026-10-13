# Comprobaciones de CI

GitHub Actions ejecuta `npm run typecheck`, `npm test` y `npm run build` con
Node 22. La suite incluye las pruebas del recomendador, la geolocalización y
el estado persistido, además de las pruebas públicas de utilidades del proyecto.

## Aserciones que requieren archivos internos

El repositorio público no contiene `.grok/skills/og/` ni sus referencias, por
lo que GitHub no puede comprobar las instrucciones internas de esa habilidad.
Las pruebas que dependen de esos archivos se omiten individualmente cuando no
están presentes:

- `scripts/brand-check.test.mjs`: `SKILL.md tells the pass to self-check with
  the flag this CLI accepts` depende de `.grok/skills/og/SKILL.md`.
- `scripts/write-atomic.test.mjs`: `every hand-over the og skill prints is one
  this script accepts` depende de `.grok/skills/og/SKILL.md` y de los archivos
  de `.grok/skills/og/references/`.

Las otras pruebas de esos archivos, incluido el chequeo de `AGENTS.md`, siguen
ejecutándose. Las aserciones omitidas son verificaciones internas de documentos
del entorno de desarrollo, no funcionalidades publicadas de la aplicación.
Solo se pueden ejecutar en un workspace que tenga esos archivos `.grok/skills`.

## Diagnóstico de fallos anteriores de la PR #2

- `brand-check.test.mjs` y `write-atomic.test.mjs`: pruebas internas de
  instrucciones `.grok/skills/og` ausentes del repositorio público; no son
  defectos del producto. En CI se omiten solo esas aserciones.
- `grok-pwa-plugin.test.mjs`: los casos genéricos tomaban por error la tarjeta
  y el título de Barras Bogotá desde el directorio real. Se aislaron con un
  workspace temporal vacío; las pruebas del plugin siguen ejecutándose.
- `migration-plan.test.mjs`: una aserción anterior asumía que `migrations/`
  estaba vacía, pero el proyecto ya incluye `0002_stations.sql`. Esa prueba se
  corrigió en el commit previo de la rama.

En el run `38068525056`, typecheck y build pasaron; los fallos fueron los casos
de pruebas listados arriba. Los nuevos casos de producto se ejecutan en la
misma suite normal y sus fallos harán fallar CI.
