# Plumbline

[![CI](https://github.com/marcoojea/plumbline/actions/workflows/ci.yml/badge.svg)](https://github.com/marcoojea/plumbline/actions/workflows/ci.yml)
![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33?logo=playwright&logoColor=white)
![Newman](https://img.shields.io/badge/Postman-Newman-FF6C37?logo=postman&logoColor=white)

Proyecto de demostración de **automatización de pruebas (QA)**: pruebas de interfaz de usuario (E2E), pruebas de API y una pipeline de integración continua que lo ejecuta todo y publica los informes.

Todo se prueba contra **sistemas de demo públicos**, así que se puede clonar y ejecutar sin cuentas, claves ni configuración.

## Qué hace

Es un conjunto de pruebas automáticas que actúan como un usuario (o como otro programa) y comprueban que dos aplicaciones funcionan:

| Capa | Herramienta | Contra qué prueba | Pruebas |
|------|-------------|-------------------|---------|
| Interfaz (E2E) | Playwright + TypeScript | [SauceDemo](https://www.saucedemo.com), una tienda online de demo | 11 |
| API | Playwright (`request`) | [Restful-Booker](https://restful-booker.herokuapp.com), una API de reservas de demo | 9 |
| API | Colección de Postman ejecutada con Newman | Restful-Booker | 9 peticiones, 14 comprobaciones |
| Integración continua | GitHub Actions | - | Lanza todo en cada cambio y guarda los informes |

**Pruebas de interfaz (E2E):** un navegador real abre la tienda, inicia sesión, ordena productos, llena el carrito y completa una compra. "E2E" significa *end to end*: se prueba el recorrido completo de un usuario.

**Pruebas de API:** se envían peticiones directamente al servidor (crear una reserva, leerla, modificarla, borrarla) y se comprueban las respuestas, sin pasar por ninguna pantalla.

**Integración continua (CI):** cada vez que se sube código a GitHub, un servidor ejecuta todas las pruebas de forma automática. Si algo se rompe, se ve al instante con una marca roja. Si todo va bien, una verde.

## Cómo arrancarlo

Necesitas Node 20 o superior (`node -v` para comprobarlo).

```bash
git clone https://github.com/marcoojea/plumbline.git
cd plumbline
npm ci                          # instala las dependencias exactas del proyecto
npx playwright install chromium # descarga el navegador que usan las pruebas
npm test                        # ejecuta todo
npm run report                  # abre el informe visual de las pruebas de interfaz
```

Qué ocurre con `npm test`: se lanzan las 11 pruebas de interfaz, las 9 de API con Playwright y la colección de Postman con Newman. Si todo va bien, termina sin errores y verás marcas ✓ en verde.

### Otros comandos útiles

```bash
npm run test:smoke      # solo 2 pruebas críticas (etiqueta @smoke), muy rápido
npm run test:e2e        # todas las pruebas de interfaz
npm run test:api        # pruebas de API con Playwright
npm run test:newman     # colección de Postman; informe en reports/newman.html
npm run test:offline    # pruebas de API contra un simulador local, sin internet
npm run report:api      # abre el informe de las pruebas de API
```

**Ver el navegador trabajando** (lo mejor para entender qué hace):

```bash
SLOWMO=800 npm run test:headed
```

Abre Chrome visible y ejecuta cada paso con 0,8 segundos de pausa. Si prefieres un modo interactivo con la lista de pruebas y capturas paso a paso: `npx playwright test --project=e2e --ui`.

## Qué se prueba

- **Inicio de sesión:** usuario válido, usuario bloqueado, contraseña errónea, usuario vacío y acceso directo sin sesión.
- **Inventario:** ordenar por precio y por nombre, y el contador del carrito al añadir y quitar productos.
- **Compra:** compra completa, validación de campos obligatorios y conservación del carrito.
- **API de reservas:** comprobación de estado, autenticación (válida e inválida), crear, leer, listar, actualizar (completa y parcial) y borrar, además de errores esperados (403 sin permiso, 404 no encontrado).

## Por qué este stack tecnológico

| Elección | Por qué |
|----------|---------|
| **Playwright** | Es hoy el estándar en automatización de interfaces. Espera de forma automática a que los elementos estén listos (menos pruebas inestables), ejecuta pruebas en paralelo, guarda trazas y capturas cuando algo falla y trae su propio informe HTML. |
| **TypeScript** | Añade tipos a JavaScript: el editor avisa de errores antes de ejecutar nada y el código se mantiene mejor cuando crece. Es lo que más piden las ofertas de QA Automation. |
| **Postman + Newman** | Postman es la herramienta más conocida para probar APIs y Newman permite ejecutar sus colecciones desde la terminal y en CI. Así se demuestra que se domina el flujo habitual de los equipos. |
| **Playwright `request`** | Permite probar la API con el mismo framework y el mismo informe que la interfaz, y escribir pruebas como código. Postman cubre el enfoque de herramienta y Playwright el enfoque de código. |
| **GitHub Actions** | Es la integración continua que ya viene con GitHub: sin servidores que montar y es donde vive el código. |
| **Sistemas de demo públicos** | SauceDemo y Restful-Booker están pensados para practicar. Cualquiera puede ejecutar el proyecto sin credenciales ni instalar aplicaciones. |

## Decisiones de diseño (y por qué)

- **Page Object Model** (`e2e/pages`): cada pantalla de la web es una clase con sus elementos y acciones. Si cambia la web, se arregla en un solo sitio y las pruebas se leen como una historia de usuario.
- **Fixtures** (`e2e/fixtures.ts`): preparación reutilizable. Por ejemplo, `loggedIn` deja al usuario con la sesión iniciada para no repetir el login en cada prueba.
- **Localizadores estables:** se buscan los elementos por su identificador de pruebas (`data-test`), no por estilos CSS que cambian con facilidad.
- **Pruebas independientes:** cada una crea sus propios datos, así que se pueden ejecutar en paralelo y en cualquier orden.
- **Resistente a caídas de terceros:** las APIs de demo a veces fallan o se reinician. `scripts/with-api.mjs` comprueba antes si la API pública responde. Si no, ejecuta las mismas pruebas contra `scripts/mock-booker.mjs`, un simulador local con las mismas rutas y códigos de respuesta. Así una caída ajena no pone el CI en rojo. El destino elegido se imprime en el log.
- **La colección de Postman es código:** se genera con `scripts/build-collection.mjs`, de modo que los cambios se pueden revisar como cualquier otro código.
- **Reintentos y trazas:** si una prueba falla se conserva una traza y una captura. En CI se reintenta dos veces para descartar fallos pasajeros.

## Integración continua

El archivo `.github/workflows/ci.yml` se ejecuta en cada push y pull request, de forma manual y una vez por semana (para detectar a tiempo si cambian las webs de demo).

1. Los trabajos `e2e` y `api` se ejecutan **en paralelo**.
2. Otro trabajo reúne los informes HTML y los guarda como artefacto `report-site`.
3. En un repositorio **público**, los informes se publican además en GitHub Pages. Se activa una vez en *Settings > Pages > Source: GitHub Actions*.

## Estructura

```
e2e/            pages/, fixtures.ts, tests/      pruebas de interfaz
api/            tests/, postman/                 pruebas de API
scripts/        with-api, mock-booker, run-newman, build-collection, build-site
.github/workflows/ci.yml                         pipeline de integración continua
```

## Notas

- `admin/password123` y `secret_sauce` son las **credenciales públicas publicadas por los propios sistemas de demo**, no secretos.
- SauceDemo es una interfaz y no tiene alternativa sin conexión: si cae, fallarán las pruebas E2E. La ejecución semanal lo haría visible.
- `newman` instala dependencias que `npm audit` marca con avisos. Son solo de desarrollo y no se distribuyen; `.npmrc` silencia el aviso al instalar.
- Las APIs públicas reinician sus datos de vez en cuando. Por eso cada prueba crea lo que necesita.

## Glosario rápido

- **E2E:** prueba que recorre una aplicación completa como lo haría un usuario.
- **CI (integración continua):** ejecutar las pruebas automáticamente en cada cambio.
- **Flaky (inestable):** prueba que a veces pasa y a veces falla sin que el código haya cambiado.
- **Mock:** simulador de un servicio real para poder probar sin depender de él.
- **Artefacto:** archivo que genera el CI y que se puede descargar, como un informe.

Autor: Marco Ojea. Proyecto de demostración de automatización QA (Playwright, pruebas de API y CI/CD).
