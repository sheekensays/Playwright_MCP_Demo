import { Locator, Page } from '@playwright/test';
import { Customer } from './types';

/** Bank Manager area: Add Customer form and the Customers table. */
export class ManagerPage {
  private readonly addCustomerTab: Locator;
  private readonly customersTab: Locator;
  private readonly form: Locator;
  private acceptingAlerts = false;

  constructor(private readonly page: Page) {
    // Tab buttons and the form submit button both read "Add Customer", so the
    // tabs are addressed by their AngularJS handler to stay unambiguous.
    this.addCustomerTab = page.locator('button[ng-click="addCust()"]');
    this.customersTab = page.locator('button[ng-click="showCust()"]');
    this.form = page.locator('form');
  }

  /** Adds every customer in order. Each submit raises an alert that is auto-accepted. */
  async addCustomers(customers: Customer[]): Promise<void> {
    this.autoAcceptAlerts();
    await this.addCustomerTab.click();
    for (const customer of customers) {
      await this.fillAndSubmitCustomer(customer);
    }
  }

  async addCustomer(customer: Customer): Promise<void> {
    this.autoAcceptAlerts();
    await this.addCustomerTab.click();
    await this.fillAndSubmitCustomer(customer);
  }

  async openCustomersTab(): Promise<void> {
    await this.customersTab.click();
  }

  /** Row in the Customers table matched on the exact name / post code triple. */
  customerRow(customer: Customer): Locator {
    return this.page
      .locator('table tbody tr')
      .filter({ has: this.page.locator(`td:nth-child(1):text-is("${customer.firstName}")`) })
      .filter({ has: this.page.locator(`td:nth-child(2):text-is("${customer.lastName}")`) })
      .filter({ has: this.page.locator(`td:nth-child(3):text-is("${customer.postCode}")`) });
  }

  async deleteCustomer(customer: Customer): Promise<void> {
    await this.customerRow(customer).getByRole('button', { name: 'Delete' }).click();
  }

  private async fillAndSubmitCustomer(customer: Customer): Promise<void> {
    await this.form.getByRole('textbox', { name: 'First Name' }).fill(customer.firstName);
    await this.form.getByRole('textbox', { name: 'Last Name' }).fill(customer.lastName);
    await this.form.getByRole('textbox', { name: 'Post Code' }).fill(customer.postCode);
    await this.form.locator('button[type="submit"]').click();
  }

  private autoAcceptAlerts(): void {
    if (this.acceptingAlerts) return;
    this.acceptingAlerts = true;
    this.page.on('dialog', (dialog) => dialog.accept());
  }
}
