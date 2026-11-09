import { test, expect, type APIRequestContext } from '@playwright/test';

const booking = {
  firstname: 'Grace',
  lastname: 'Hopper',
  totalprice: 150,
  depositpaid: true,
  bookingdates: { checkin: '2027-01-10', checkout: '2027-01-15' },
  additionalneeds: 'Breakfast',
};

async function token(request: APIRequestContext) {
  const res = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
  expect(res.ok()).toBeTruthy();
  return (await res.json()).token as string;
}

async function create(request: APIRequestContext) {
  const res = await request.post('/booking', { data: booking, headers: { Accept: 'application/json' } });
  expect(res.status()).toBe(200);
  return (await res.json()).bookingid as number;
}

test.describe('API Restful-Booker', () => {
  test('el health check responde 201 @smoke', async ({ request }) => {
    expect((await request.get('/ping')).status()).toBe(201);
  });

  test('la autenticación devuelve token con credenciales válidas', async ({ request }) => {
    expect(await token(request)).toBeTruthy();
  });

  test('la autenticación rechaza credenciales erróneas', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });

  test('crea una reserva y la lee de vuelta', async ({ request }) => {
    const id = await create(request);
    const res = await request.get(`/booking/${id}`, { headers: { Accept: 'application/json' } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ firstname: 'Grace', lastname: 'Hopper', totalprice: 150 });
  });

  test('la reserva nueva aparece en el listado', async ({ request }) => {
    const id = await create(request);
    const res = await request.get('/booking?firstname=Grace&lastname=Hopper', { headers: { Accept: 'application/json' } });
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(id);
  });

  test('actualizar sin token está prohibido', async ({ request }) => {
    const id = await create(request);
    const res = await request.put(`/booking/${id}`, { data: booking, headers: { Accept: 'application/json' } });
    expect(res.status()).toBe(403);
  });

  test('la actualización completa con token reemplaza la reserva', async ({ request }) => {
    const id = await create(request);
    const res = await request.put(`/booking/${id}`, {
      data: { ...booking, firstname: 'Margaret', totalprice: 200 },
      headers: { Accept: 'application/json', Cookie: `token=${await token(request)}` },
    });
    expect(res.status()).toBe(200);
    expect(await res.json()).toMatchObject({ firstname: 'Margaret', totalprice: 200 });
  });

  test('la actualización parcial solo cambia los campos enviados', async ({ request }) => {
    const id = await create(request);
    const res = await request.patch(`/booking/${id}`, {
      data: { lastname: 'Murray' },
      headers: { Accept: 'application/json', Cookie: `token=${await token(request)}` },
    });
    expect(await res.json()).toMatchObject({ firstname: 'Grace', lastname: 'Murray' });
  });

  test('una reserva borrada devuelve 404', async ({ request }) => {
    const id = await create(request);
    const del = await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${await token(request)}` } });
    expect(del.status()).toBe(201);
    expect((await request.get(`/booking/${id}`)).status()).toBe(404);
  });
});
