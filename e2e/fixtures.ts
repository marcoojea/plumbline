import { test as base } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CheckoutPage } from './pages/CheckoutPage';

export const USERS = {
  standard: { user: 'standard_user', pass: 'secret_sauce' },
  locked: { user: 'locked_out_user', pass: 'secret_sauce' },
} as const;

type Fixtures = {
  loginPage: LoginPage;
  inventory: InventoryPage;
  checkout: CheckoutPage;
  loggedIn: InventoryPage;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventory: async ({ page }, use) => use(new InventoryPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
  // Deja cada prueba con la sesión ya iniciada como usuario estándar.
  loggedIn: async ({ page, loginPage, inventory }, use) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard.user, USERS.standard.pass);
    await inventory.expectLoaded();
    await use(inventory);
  },
});

export { expect } from '@playwright/test';
