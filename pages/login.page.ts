import { Page } from '@playwright/test';

/** The `#/login` landing screen and the customer name-select step. */
export class LoginPage {
  static readonly url =
    'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login';

  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(LoginPage.url);
  }

  async loginAsBankManager(): Promise<void> {
    await this.page.getByRole('button', { name: 'Bank Manager Login' }).click();
  }

  /** Clicks "Customer Login", picks the given name and submits. */
  async loginAsCustomer(name: string): Promise<void> {
    await this.page.getByRole('button', { name: 'Customer Login' }).click();
    await this.page.locator('#userSelect').selectOption(name);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
