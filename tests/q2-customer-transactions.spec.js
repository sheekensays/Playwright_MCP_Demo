const { test } = require('@playwright/test');
const { LOGIN_URL, readBalance, expect } = require('./helpers');

// Q2: Customer Hermoine Granger, account 1003 - run the transactions below and
// check, after each one, that the balance we compute matches the balance shown
// in the account header.

const TRANSACTIONS = [
  { amount: 50000, type: 'Credit' },
  { amount: 3000, type: 'Debit' },
  { amount: 2000, type: 'Debit' },
  { amount: 5000, type: 'Credit' },
  { amount: 10000, type: 'Debit' },
  { amount: 15000, type: 'Debit' },
  { amount: 1500, type: 'Credit' },
];

test('Customer transactions keep the account balance in sync', async ({ page }) => {
  await page.goto(LOGIN_URL);
  await page.getByRole('button', { name: 'Customer Login' }).click();
  await page.locator('#userSelect').selectOption('Hermoine Granger');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.locator('#accountSelect').selectOption('1003');

  const balanceValue = page.locator('.center strong').nth(1);
  const amountField = page.locator('form input[ng-model="amount"]');
  const submitButton = page.locator('form button[type="submit"]');

  let expectedBalance = await readBalance(page);

  for (const tx of TRANSACTIONS) {
    expectedBalance += tx.type === 'Credit' ? tx.amount : -tx.amount;

    if (tx.type === 'Credit') {
      await page.locator('button[ng-click="deposit()"]').click();
      await expect(page.getByText('Amount to be Deposited :')).toBeVisible();
    } else {
      await page.locator('button[ng-click="withdrawl()"]').click();
      await expect(page.getByText('Amount to be Withdrawn :')).toBeVisible();
    }

    await amountField.fill(String(tx.amount));
    await submitButton.click();

    // Balance in the header updates once the transaction is applied.
    await expect(balanceValue).toHaveText(String(expectedBalance));
  }

  // 0 + 50000 - 3000 - 2000 + 5000 - 10000 - 15000 + 1500 = 26500
  expect(expectedBalance).toBe(26500);
  expect(await readBalance(page)).toBe(26500);
});
