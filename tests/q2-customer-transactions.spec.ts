import { test, expect } from './fixtures';
import { Transaction } from '../pages/types';
import transactionData from '../testdata/q2-transactions.json';

// Q2: Customer runs the transactions from testdata/q2-transactions.json and,
// after each one, the balance we compute must match the balance in the header.

const { customerName, account, expectedFinalBalance } = transactionData;
const TRANSACTIONS = transactionData.transactions as Transaction[];

test('Customer transactions keep the account balance in sync', async ({
  loginPage,
  customerAccountPage,
}) => {
  await loginPage.goto();
  await loginPage.loginAsCustomer(customerName);
  await customerAccountPage.selectAccount(account);

  let expectedBalance = await customerAccountPage.balance();

  for (const tx of TRANSACTIONS) {
    expectedBalance += tx.type === 'Credit' ? tx.amount : -tx.amount;
    await customerAccountPage.applyTransaction(tx.type, tx.amount);
    await customerAccountPage.expectBalance(expectedBalance);
  }

  expect(expectedBalance).toBe(expectedFinalBalance);
  expect(await customerAccountPage.balance()).toBe(expectedFinalBalance);
});
