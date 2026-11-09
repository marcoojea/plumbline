import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
// Un informe HTML por suite, para que `npm test` no pise el informe E2E con el de API.
const reportDir =
  process.env.PLAYWRIGHT_HTML_REPORT ??
  `playwright-report/${process.argv.includes('--project=api') ? 'api' : 'e2e'}`;

export default defineConfig({
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: reportDir }]],
  use: { trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    {
      name: 'e2e',
      testDir: './e2e/tests',
      use: { ...devices['Desktop Chrome'], launchOptions: { slowMo: Number(process.env.SLOWMO ?? 0) }, baseURL: 'https://www.saucedemo.com', testIdAttribute: 'data-test' },
    },
    {
      name: 'api',
      testDir: './api/tests',
      workers: 2, // no saturar la API pública compartida
      use: { baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com' },
    },
  ],
});
