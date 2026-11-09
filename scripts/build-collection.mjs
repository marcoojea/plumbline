// Genera api/postman/restful-booker.postman_collection.json para que la colección se mantenga legible como código.
import { writeFileSync } from 'node:fs';

const json = { 'Content-Type': 'application/json', Accept: 'application/json' };
const body = (o) => ({ mode: 'raw', raw: JSON.stringify(o, null, 2) });
const booking = {
  firstname: 'Grace', lastname: 'Hopper', totalprice: 150, depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-15' }, additionalneeds: 'Breakfast',
};
const test = (lines) => [{ listen: 'test', script: { type: 'text/javascript', exec: lines } }];
const req = (name, method, path, { data, headers = json, tests = [] } = {}) => ({
  name,
  event: test(tests),
  request: {
    method,
    header: Object.entries(headers).map(([key, value]) => ({ key, value })),
    ...(data ? { body: body(data) } : {}),
    url: { raw: `{{baseUrl}}${path}`, host: ['{{baseUrl}}'], path: path.split('/').filter(Boolean) },
  },
});

const items = [
  req('Ping', 'GET', '/ping', { tests: ['pm.test("el estado es 201", () => pm.response.to.have.status(201));'] }),
  req('Auth - get token', 'POST', '/auth', {
    data: { username: 'admin', password: 'password123' },
    tests: [
      'pm.test("el estado es 200", () => pm.response.to.have.status(200));',
      'const token = pm.response.json().token;',
      'pm.test("hay token", () => pm.expect(token).to.be.a("string").and.not.empty);',
      'pm.collectionVariables.set("token", token);',
    ],
  }),
  req('Auth - bad credentials', 'POST', '/auth', {
    data: { username: 'admin', password: 'wrong' },
    tests: ['pm.test("el motivo es Bad credentials", () => pm.expect(pm.response.json().reason).to.eql("Bad credentials"));'],
  }),
  req('Create booking', 'POST', '/booking', {
    data: booking,
    tests: [
      'pm.test("el estado es 200", () => pm.response.to.have.status(200));',
      'const r = pm.response.json();',
      'pm.test("devuelve la reserva creada", () => pm.expect(r.booking.firstname).to.eql("Grace"));',
      'pm.collectionVariables.set("bookingId", r.bookingid);',
    ],
  }),
  req('Get booking', 'GET', '/booking/{{bookingId}}', {
    tests: [
      'pm.test("el estado es 200", () => pm.response.to.have.status(200));',
      'pm.test("el apellido es Hopper", () => pm.expect(pm.response.json().lastname).to.eql("Hopper"));',
      'pm.test("responde en menos de 10 s", () => pm.expect(pm.response.responseTime).to.be.below(10000));',
    ],
  }),
  req('Update booking without token', 'PUT', '/booking/{{bookingId}}', {
    data: booking,
    tests: ['pm.test("el estado es 403", () => pm.response.to.have.status(403));'],
  }),
  req('Partial update (PATCH)', 'PATCH', '/booking/{{bookingId}}', {
    data: { lastname: 'Murray' },
    headers: { ...json, Cookie: 'token={{token}}' },
    tests: [
      'pm.test("el estado es 200", () => pm.response.to.have.status(200));',
      'pm.test("cambia el apellido y se conserva el nombre", () => {',
      '  const r = pm.response.json();',
      '  pm.expect(r.lastname).to.eql("Murray");',
      '  pm.expect(r.firstname).to.eql("Grace");',
      '});',
    ],
  }),
  req('Delete booking', 'DELETE', '/booking/{{bookingId}}', {
    headers: { ...json, Cookie: 'token={{token}}' },
    tests: ['pm.test("el estado es 201", () => pm.response.to.have.status(201));'],
  }),
  req('Get deleted booking', 'GET', '/booking/{{bookingId}}', {
    tests: ['pm.test("el estado es 404", () => pm.response.to.have.status(404));'],
  }),
];

const collection = {
  info: {
    name: 'Restful-Booker',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [
    { key: 'baseUrl', value: 'https://restful-booker.herokuapp.com' },
    { key: 'token', value: '' },
    { key: 'bookingId', value: '' },
  ],
  item: items,
};
writeFileSync('api/postman/restful-booker.postman_collection.json', JSON.stringify(collection, null, 2) + '\n');
console.log('collection written');
