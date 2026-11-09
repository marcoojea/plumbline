# Registro de cambios

Una línea por cambio. Leer antes de empezar para no duplicar trabajo. Formato: fecha · rama · qué · archivos.

- 2026-11-09 · main (commit inicial) · Estructura inicial, tsconfig, .gitignore, .npmrc, package.json con scripts · raíz
- 2026-11-09 · main (commit inicial) · Suite E2E SauceDemo (POM, fixtures, 11 tests) · `e2e/`, `playwright.config.ts`
- 2026-11-09 · main (commit inicial) · Tests API Playwright, colección Postman generada, runner Newman, mock local y selector de target · `api/`, `scripts/`
- 2026-11-09 · main (commit inicial) · Workflow CI con jobs paralelos, informes, Pages condicional · `.github/workflows/ci.yml`, `scripts/build-site.mjs`
- 2026-11-09 · main (commit inicial) · README, LICENSE, CLAUDE.md, EstadoActual.md, cambios.md · raíz
- 2026-11-09 · fix/review-hardening · Revisión de seguridad/TS: deploy Pages en job aparte, spawn compatible con Windows, informes por suite, workers=2 en API, tests de orden deterministas, resumen de target en CI, dependabot · `.github/`, `scripts/`, `playwright.config.ts`, `e2e/tests/inventory.spec.ts`, `api/`
- 2026-11-09 · main (Dependabot) · Fusionados PRs de actions/checkout 7, download-artifact 8, upload-artifact 7, setup-node 7; CI verde en main. PR de deploy-pages 5 (#4) pendiente: no se puede probar sin Pages activo, probar tras activarlo · `.github/workflows/ci.yml`
- 2026-11-09 · main · Historial reducido a un commit limpio antes de publicar · repo
- 2026-11-09 · main · Soporte de SLOWMO (env) y script test:headed para ver los tests E2E en navegador visible · `playwright.config.ts`, `package.json`
- 2026-11-09 · docs/espanol · README completo en español (qué hace, por qué, stack, cómo arrancar, glosario); comentarios, títulos de tests y workflow traducidos · todo el repo
