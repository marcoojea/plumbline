// Reúne los informes HTML en site/ con una portada sencilla (se usa para GitHub Pages).
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('site', { recursive: true });
const links = [];
for (const [src, dest, label] of [
  ['playwright-report/e2e', 'e2e', 'Interfaz (E2E) - Playwright (SauceDemo)'],
  ['playwright-report/api', 'api', 'API - Playwright (Restful-Booker)'],
]) {
  if (existsSync(src)) {
    cpSync(src, `site/${dest}`, { recursive: true });
    links.push(`<li><a href="${dest}/index.html">${label}</a></li>`);
  }
}
if (existsSync('reports/newman.html')) {
  cpSync('reports/newman.html', 'site/newman.html');
  links.push('<li><a href="newman.html">API - Postman/Newman (Restful-Booker)</a></li>');
}
writeFileSync(
  'site/index.html',
  `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plumbline - informes de pruebas</title>
<style>body{font:16px/1.5 system-ui;max-width:40rem;margin:3rem auto;padding:0 1rem}a{color:#0b5fff}</style>
<h1>Informes de pruebas de Plumbline</h1><p>Última ejecución en <code>main</code>.</p><ul>${links.join('')}</ul>`,
);
console.log(`site/ ready with ${links.length} reports`);
