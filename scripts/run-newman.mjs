import newman from 'newman';
import { mkdirSync } from 'node:fs';

mkdirSync('reports', { recursive: true });
newman.run(
  {
    collection: 'api/postman/restful-booker.postman_collection.json',
    envVar: [{ key: 'baseUrl', value: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com' }],
    reporters: ['cli', 'htmlextra'],
    reporter: { htmlextra: { export: 'reports/newman.html', title: 'Plumbline - Restful-Booker (Newman)' } },
  },
  (err, summary) => {
    if (err || summary.run.failures.length) process.exit(1);
  },
);
