# Estado actual

**Última actualización:** 2026-11-09 · rama `main`

## Qué es
Repo de demostración QA (Playwright + TypeScript, Newman, GitHub Actions). Objetivo: mostrar una suite QA completa y ejecutable sin configuración.

## Hecho
- Suite E2E SauceDemo: 11 tests (login, inventario, checkout), POM + fixtures.
- Suite API Restful-Booker con Playwright: 9 tests.
- Colección Postman generada por código + runner Newman con informe HTML.
- Mock local de Restful-Booker; `with-api.mjs` cae a él si la API pública no responde.
- Workflow CI (e2e y api en paralelo, informes como artefactos, Pages solo si repo público).
- README, LICENSE, CLAUDE.md.
- CI verde en main, informes del artefacto revisados en local.
- Revisión de seguridad y sanitización (historial reducido a un commit).

## Pendiente
- PR #4 Dependabot (deploy-pages 5): fusionar tras activar Pages y comprobar el deploy.
- Activar Pages (Settings > Pages > GitHub Actions).
- Capturas del informe en el README (opcional).

## Cómo verificar
`npm ci && npx playwright install chromium && npm test`
