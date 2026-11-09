// Simulador local de https://restful-booker.herokuapp.com (mismas rutas y códigos de estado).
// Se usa cuando la API pública no responde, para que `npm run test:api` no falle por la red.
import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const TOKEN = 'plumbline-mock-token';

export function startMock(port = 0) {
  const bookings = new Map();
  let nextId = 1;

  const send = (res, status, body, type = 'application/json') => {
    res.writeHead(status, { 'Content-Type': type });
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
  };
  const authorized = (req) =>
    (req.headers.cookie ?? '').includes(`token=${TOKEN}`) ||
    req.headers.authorization === `Basic ${Buffer.from('admin:password123').toString('base64')}`;
  const readJson = (req) =>
    new Promise((resolve) => {
      let raw = '';
      req.on('data', (c) => (raw += c));
      req.on('end', () => {
        try { resolve(raw ? JSON.parse(raw) : {}); } catch { resolve(null); }
      });
    });

  const server = createServer(async (req, res) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    const parts = pathname.split('/').filter(Boolean);
    const body = ['POST', 'PUT', 'PATCH'].includes(req.method ?? '') ? await readJson(req) : {};
    if (body === null) return send(res, 400, 'Bad Request', 'text/plain');

    if (pathname === '/ping' && req.method === 'GET') return send(res, 201, 'Created', 'text/plain');

    if (pathname === '/auth' && req.method === 'POST') {
      const ok = body.username === 'admin' && body.password === 'password123';
      return send(res, 200, ok ? { token: TOKEN } : { reason: 'Bad credentials' });
    }

    if (parts[0] !== 'booking') return send(res, 404, 'Not Found', 'text/plain');

    if (parts.length === 1 && req.method === 'GET')
      return send(res, 200, [...bookings.keys()].map((bookingid) => ({ bookingid })));

    if (parts.length === 1 && req.method === 'POST') {
      const bookingid = nextId++;
      bookings.set(bookingid, body);
      return send(res, 200, { bookingid, booking: body });
    }

    const id = Number(parts[1]);
    if (parts.length === 2 && req.method === 'GET')
      return bookings.has(id) ? send(res, 200, bookings.get(id)) : send(res, 404, 'Not Found', 'text/plain');

    if (parts.length === 2 && ['PUT', 'PATCH', 'DELETE'].includes(req.method ?? '')) {
      if (!authorized(req)) return send(res, 403, 'Forbidden', 'text/plain');
      if (!bookings.has(id)) return send(res, 405, 'Method Not Allowed', 'text/plain');
      if (req.method === 'DELETE') {
        bookings.delete(id);
        return send(res, 201, 'Created', 'text/plain');
      }
      const next = req.method === 'PUT' ? body : { ...bookings.get(id), ...body };
      bookings.set(id, next);
      return send(res, 200, next);
    }
    return send(res, 404, 'Not Found', 'text/plain');
  });

  return new Promise((resolve) =>
    server.listen(port, '127.0.0.1', () => resolve({ server, url: `http://127.0.0.1:${server.address().port}` })),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { url } = await startMock(Number(process.env.PORT ?? 3001));
  console.log(`mock restful-booker listening on ${url}`);
}
