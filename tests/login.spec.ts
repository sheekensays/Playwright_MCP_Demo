import { test, expect } from './fixtures';

test('opens the XYZ Bank login page', async ({ loginPage, page }) => {
  await loginPage.goto();

  // Placeholder assertion: the app shell rendered.
  // Real steps are built out using Playwright MCP.
  await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();
});
