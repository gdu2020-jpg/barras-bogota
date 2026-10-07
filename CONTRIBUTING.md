# Contribuir a Barras Bogotá

Proyecto abierto para la escena de calistenia. No hace falta ser programador para sumar.

## Aportar un parque (sin código)

1. Abre la app
2. Ve a **Aportar**
3. Nombre, ciudad, dirección, coordenadas (botón de ubicación) y equipo
4. Publica. El spot aparece en el mapa con etiqueta Aporte

No pongas nombres, teléfonos ni datos de personas. Solo el lugar.

## Aportar al código

Issues útiles para arrancar:

- Completar fichas de Medellín, Cali, Barranquilla, Bucaramanga
- Fotos reales de cada estación (sin caras reconocibles si no hay permiso)
- Moderación de aportes (reportar duplicados / vandalismo)
- Ajuste fino del índice de estación
- Modo offline

### Datos curados

Los spots editoriales viven en `src/lib/parks.ts`. Un parque nuevo necesita:

- `id` estable en kebab-case
- coordenadas reales
- `equipment` honesto (si no hay barras altas, no las pongas)
- `kind`: `calistenia` | `mixto` | `biosaludable`
- `source: "curated"` (el helper `park()` lo pone solo)

### Código

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Convenciones:

- Español en la UI
- Tokens en `src/styles.css`, no hex suelto en JSX
- Server functions para la base (`src/lib/community.ts`); no importar `@/lib/db` en el cliente
- Sin cuentas: los aportes son de toda la comunidad, no de un perfil

Pull requests pequeños y con un parque o un arreglo por cada una.
