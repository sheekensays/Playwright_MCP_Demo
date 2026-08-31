const { expect } = require('@playwright/test');

const LOGIN_URL =
  'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login';

/**
 * Locator for a single row in the manager "Customers" table, matched on the
 * exact first name / last name / post code triple.
 */
function customerRow(page, { firstName, lastName, postCode }) {
  return page
    .locator('table tbody tr')
    .filter({ has: page.locator(`td:nth-child(1):text-is("${firstName}")`) })
    .filter({ has: page.locator(`td:nth-child(2):text-is("${lastName}")`) })
    .filter({ has: page.locator(`td:nth-child(3):text-is("${postCode}")`) });
}

/** Reads the numeric balance shown in the customer account header. */
async function readBalance(page) {
  const text = await page.locator('.center strong').nth(1).innerText();
  return Number(text.trim());
}

module.exports = { LOGIN_URL, customerRow, readBalance, expect };
