export interface Customer {
  firstName: string;
  lastName: string;
  postCode: string;
}

export type TransactionType = 'Credit' | 'Debit';

export interface Transaction {
  amount: number;
  type: TransactionType;
}

export function sameCustomer(a: Customer, b: Customer): boolean {
  return (
    a.firstName === b.firstName &&
    a.lastName === b.lastName &&
    a.postCode === b.postCode
  );
}
