import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ManagerPage } from '../pages/manager.page';
import { CustomerAccountPage } from '../pages/customer-account.page';

type Pages = {
  loginPage: LoginPage;
  managerPage: ManagerPage;
  customerAccountPage: CustomerAccountPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  managerPage: async ({ page }, use) => {
    await use(new ManagerPage(page));
  },
  customerAccountPage: async ({ page }, use) => {
    await use(new CustomerAccountPage(page));
  },
});

export { expect } from '@playwright/test';
