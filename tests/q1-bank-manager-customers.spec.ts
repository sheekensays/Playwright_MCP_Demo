import { test, expect } from './fixtures';
import { Customer, sameCustomer } from '../pages/types';
import customerData from '../testdata/q1-customers.json';

// Q1: Bank Manager - add customers, verify the table, delete specific customers.
// Test data lives in testdata/q1-customers.json.

const CUSTOMERS = customerData.customers as Customer[];
const TO_DELETE = customerData.toDelete as Customer[];

test('Bank Manager adds, verifies and deletes customers', async ({
  loginPage,
  managerPage,
}) => {
  await loginPage.goto();
  await loginPage.loginAsBankManager();

  await managerPage.addCustomers(CUSTOMERS);
  await managerPage.openCustomersTab();

  for (const customer of CUSTOMERS) {
    await expect(
      managerPage.customerRow(customer),
      `${customer.firstName} ${customer.lastName} (${customer.postCode}) should be listed`,
    ).toHaveCount(1);
  }

  for (const customer of TO_DELETE) {
    await managerPage.deleteCustomer(customer);
    await expect(
      managerPage.customerRow(customer),
      `${customer.firstName} ${customer.lastName} (${customer.postCode}) should be removed`,
    ).toHaveCount(0);
  }

  const remaining = CUSTOMERS.filter(
    (customer) => !TO_DELETE.some((deleted) => sameCustomer(customer, deleted)),
  );
  for (const customer of remaining) {
    await expect(managerPage.customerRow(customer)).toHaveCount(1);
  }
});
