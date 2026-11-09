import { test, expect } from '../fixtures';

test.describe('Inventario', () => {
  test('ordena por precio de menor a mayor', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    await expect
      .poll(async () => {
        const prices = await loggedIn.priceValues();
        return prices.join() === [...prices].sort((a, b) => a - b).join();
      })
      .toBe(true);
  });

  test('ordena por nombre de Z a A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    await expect(loggedIn.names).toHaveText([
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Onesie',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Bike Light',
      'Sauce Labs Backpack',
    ]);
  });

  test('el contador del carrito sigue las altas y bajas', async ({ loggedIn }) => {
    await loggedIn.add('sauce-labs-backpack');
    await loggedIn.add('sauce-labs-bike-light');
    await expect(loggedIn.cartBadge).toHaveText('2');
    await loggedIn.remove('sauce-labs-backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');
  });
});
