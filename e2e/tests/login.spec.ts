import { test, expect, USERS } from '../fixtures';

test.describe('Inicio de sesión', () => {
  test.beforeEach(async ({ loginPage }) => loginPage.goto());

  test('el usuario estándar llega al inventario @smoke', async ({ loginPage, inventory }) => {
    await loginPage.login(USERS.standard.user, USERS.standard.pass);
    await inventory.expectLoaded();
    await expect(inventory.items).toHaveCount(6);
  });

  test('el usuario bloqueado es rechazado', async ({ loginPage }) => {
    await loginPage.login(USERS.locked.user, USERS.locked.pass);
    await loginPage.expectError('locked out');
  });

  test('una contraseña errónea muestra error de credenciales', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.user, 'nope');
    await loginPage.expectError('do not match');
  });

  test('el nombre de usuario es obligatorio', async ({ loginPage }) => {
    await loginPage.password.fill('secret_sauce');
    await loginPage.submit.click();
    await loginPage.expectError('Username is required');
  });

  test('no se puede entrar al inventario sin iniciar sesión', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.expectError('You can only access');
  });
});
