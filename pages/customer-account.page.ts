import { Locator, Page, expect } from '@playwright/test';
import { TransactionType } from './types';

/** Customer account screen: account switcher, deposit / withdraw, balance. */
export class CustomerAccountPage {
  private readonly accountSelect: Locator;
  private readonly balanceValue: Locator;
  private readonly amountField: Locator;
  private readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.accountSelect = page.locator('#accountSelect');
    // `.center strong` -> [0] account number, [1] balance, [2] currency.
    this.balanceValue = page.locator('.center strong').nth(1);
    this.amountField = page.locator('form input[ng-model="amount"]');
    this.submitButton = page.locator('form button[type="submit"]');
  }

  async selectAccount(accountId: string): Promise<void> {
    await this.accountSelect.selectOption(accountId);
  }

  async balance(): Promise<number> {
    return Number((await this.balanceValue.innerText()).trim());
  }

  async applyTransaction(type: TransactionType, amount: number): Promise<void> {
    if (type === 'Credit') {
      await this.deposit(amount);
    } else {
      await this.withdraw(amount);
    }
  }

  async deposit(amount: number): Promise<void> {
    await this.page.locator('button[ng-click="deposit()"]').click();
    await expect(this.page.getByText('Amount to be Deposited :')).toBeVisible();
    await this.amountField.fill(String(amount));
    await this.submitButton.click();
  }

  async withdraw(amount: number): Promise<void> {
    await this.page.locator('button[ng-click="withdrawl()"]').click();
    await expect(this.page.getByText('Amount to be Withdrawn :')).toBeVisible();
    await this.amountField.fill(String(amount));
    await this.submitButton.click();
  }

  async expectBalance(expected: number): Promise<void> {
    await expect(this.balanceValue).toHaveText(String(expected));
  }
}
