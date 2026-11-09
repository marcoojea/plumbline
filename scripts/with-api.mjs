// Uso: node scripts/with-api.mjs [--mock] <comando> [args...]
// Elige el destino de la API (Restful-Booker público, o el simulador local si está caído),
// lo exporta como API_BASE_URL y ejecuta el comando.
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { startMock } from './mock-booker.mjs';

const PUBLIC = 'https://restful-booker.herokuapp.com';

async function publicIsUp() {
  try {
    const res = await fetch(`${PUBLIC}/ping`, { signal: AbortSignal.timeout(5000) });
    return res.status === 201;
  } catch {
    return false;
  }
}

const forced = process.env.API_BASE_URL;
const argv = process.argv.slice(2);
const flagMock = argv[0] === '--mock';
if (flagMock) argv.shift();
const forceMock = flagMock || process.env.API_MODE === 'mock';
let baseUrl = forced;
let mock;

if (!baseUrl) {
  if (!forceMock && (await publicIsUp())) {
    baseUrl = PUBLIC;
  } else {
    mock = await startMock();
    baseUrl = mock.url;
    console.log(`[plumbline] API pública no disponible o API_MODE=mock -> usando simulador local en ${baseUrl}`);
  }
}
console.log(`[plumbline] destino de la API: ${baseUrl}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Destino de la API: \`${baseUrl}\`${mock ? ' (simulador local, API pública no disponible)' : ''}\n\n`);
}

const [cmd, ...args] = argv;
const child = spawn(cmd, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32', // en Windows npm/playwright son archivos .cmd
  env: { ...process.env, API_BASE_URL: baseUrl },
});
child.on('error', (err) => {
  console.error(`[plumbline] no se pudo ejecutar "${cmd}": ${err.message}`);
  mock?.server.close();
  process.exit(1);
});
child.on('exit', (code) => {
  mock?.server.close();
  process.exit(code ?? 1);
});
