const { test, expect } = require('@playwright/test');

const LOGIN_URL =
  'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login';

test('opens the XYZ Bank login page', async ({ page }) => {
  await page.goto(LOGIN_URL);

  // Placeholder assertion: page loaded and the app shell rendered.
  // Real steps will be built out using Playwright MCP.
  await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
});
