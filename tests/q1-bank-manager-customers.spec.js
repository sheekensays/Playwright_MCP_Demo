const { test } = require('@playwright/test');
const { LOGIN_URL, customerRow, expect } = require('./helpers');

// Q1: Bank Manager - add customers, verify the table, delete specific customers.

const CUSTOMERS = [
  { firstName: 'Christopher', lastName: 'Connely', postCode: 'L789C349' },
  { firstName: 'Frank', lastName: 'Christopher', postCode: 'A897N450' },
  { firstName: 'Christopher', lastName: 'Minka', postCode: 'M098Q585' },
  { firstName: 'Connely', lastName: 'Jackson', postCode: 'L789C349' },
  { firstName: 'Jackson', lastName: 'Frank', postCode: 'L789C349' },
  { firstName: 'Minka', lastName: 'Jackson', postCode: 'A897N450' },
  { firstName: 'Jackson', lastName: 'Connely', postCode: 'L789C349' },
];

const TO_DELETE = [
  { firstName: 'Jackson', lastName: 'Frank', postCode: 'L789C349' },
  { firstName: 'Christopher', lastName: 'Connely', postCode: 'L789C349' },
];

test('Bank Manager adds, verifies and deletes customers', async ({ page }) => {
  // The "Customer added successfully" alert fires after every submission.
  page.on('dialog', (dialog) => dialog.accept());

  await page.goto(LOGIN_URL);
  await page.getByRole('button', { name: 'Bank Manager Login' }).click();

  // --- Add all customers -------------------------------------------------
  await page.getByRole('button', { name: 'Add Customer' }).click();
  const form = page.getByRole('form');

  for (const c of CUSTOMERS) {
    await form.getByRole('textbox', { name: 'First Name' }).fill(c.firstName);
    await form.getByRole('textbox', { name: 'Last Name' }).fill(c.lastName);
    await form.getByRole('textbox', { name: 'Post Code' }).fill(c.postCode);
    await form.getByRole('button', { name: 'Add Customer' }).click();
  }

  // --- Verify every customer is in the Customers table ------------------
  await page.getByRole('button', { name: 'Customers' }).click();

  for (const c of CUSTOMERS) {
    await expect(
      customerRow(page, c),
      `${c.firstName} ${c.lastName} (${c.postCode}) should be listed`,
    ).toHaveCount(1);
  }

  // --- Delete the specified customers ----------------------------------
  for (const c of TO_DELETE) {
    await customerRow(page, c).getByRole('button', { name: 'Delete' }).click();
    await expect(
      customerRow(page, c),
      `${c.firstName} ${c.lastName} (${c.postCode}) should be removed`,
    ).toHaveCount(0);
  }

  // The customers that were not targeted are still present.
  const remaining = CUSTOMERS.filter(
    (c) =>
      !TO_DELETE.some(
        (d) =>
          d.firstName === c.firstName &&
          d.lastName === c.lastName &&
          d.postCode === c.postCode,
      ),
  );
  for (const c of remaining) {
    await expect(customerRow(page, c)).toHaveCount(1);
  }
});
