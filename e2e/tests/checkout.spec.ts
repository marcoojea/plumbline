import { test, expect } from '../fixtures';

test.describe('Compra', () => {
  test('compra un producto de principio a fin @smoke', async ({ loggedIn, checkout }) => {
    await loggedIn.add('sauce-labs-backpack');
    await loggedIn.openCart();
    await expect(checkout.cartItems).toHaveCount(1);
    await checkout.checkoutButton.click();
    await checkout.fillDetails('Ada', 'Lovelace', '28001');
    await checkout.expectOnOverview();
    await checkout.finishButton.click();
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });

  test('exige el nombre', async ({ loggedIn, checkout }) => {
    await loggedIn.add('sauce-labs-onesie');
    await loggedIn.openCart();
    await checkout.checkoutButton.click();
    await checkout.fillDetails('', 'Lovelace', '28001');
    await expect(checkout.error).toContainText('First Name is required');
  });

  test('el carrito conserva los productos al volver a la tienda', async ({ loggedIn, page }) => {
    await loggedIn.add('sauce-labs-bolt-t-shirt');
    await loggedIn.openCart();
    await page.getByTestId('continue-shopping').click();
    await expect(loggedIn.cartBadge).toHaveText('1');
  });
});
