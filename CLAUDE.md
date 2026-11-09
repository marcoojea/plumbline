# Plumbline - reglas de trabajo

Proyecto independiente de demostración de automatización QA. No depende de otros proyectos.

## Flujo obligatorio
1. Leer `EstadoActual.md` primero.
2. Leer `cambios.md` después. No repetir un cambio ya registrado.
3. Trabajar en una rama (`feat/...`, `fix/...`, `docs/...`, `ci/...`), nunca directo en `main`.
4. Al terminar: añadir una línea en `cambios.md` y actualizar `EstadoActual.md`.

## Reglas del proyecto
- Todo debe pasar con `npm ci && npx playwright install chromium && npm test` sin errores en un clon limpio.
- Los tests son independientes: cada uno crea sus datos.
- Sin secretos ni datos personales en el repo (se hará público).
- Commits en Conventional Commits.
