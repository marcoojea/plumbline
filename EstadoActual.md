# Estado actual

**Última actualización:** 2026-11-09 · rama `main`

## Qué es
Repo de demostración QA (Playwright + TypeScript, Newman, GitHub Actions). Objetivo: mostrar una suite QA completa y ejecutable sin configuración.

## Hecho
- Suite E2E SauceDemo: 11 tests (login, inventario, checkout), POM + fixtures.
- Suite API Restful-Booker con Playwright: 9 tests.
- Colección Postman generada por código + runner Newman con informe HTML.
- Mock local de Restful-Booker; `with-api.mjs` cae a él si la API pública no responde.
- Workflow CI (e2e y api en paralelo, informes como artefactos, despliegue en Pages).
- README, LICENSE, CLAUDE.md.
- CI verde en main, informes del artefacto revisados en local.
- Revisión de seguridad y sanitización (historial reducido a un commit).

## Publicación
- Repo público: https://github.com/marcoojea/plumbline
- Informes en vivo (GitHub Pages): https://marcoojea.github.io/plumbline/
- Dependabot actualiza acciones y dependencias cada mes; sus PRs pasan el CI antes de fusionarse.

## Pendiente
- Capturas del informe en el README (opcional).
- Ideas futuras: pruebas de accesibilidad, rendimiento o contratos de API.

## Cómo verificar
`npm ci && npx playwright install chromium && npm test`
