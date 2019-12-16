import { Action, createReducer, on } from '@ngrx/store';
import * as CustomerActions from '@app/store/actions/customer.actions';

export interface CustomerState {
  customers: Array<string>;
}

export const initialState: CustomerState = {
  customers: []
};

const customerReducer = createReducer(
  initialState,
  on(CustomerActions.add, (state, { customer }) => ({
    ...state,
    customers: adjustedCustomerList(customer, state.customers)
  })),
  on(CustomerActions.addMany, (state, { customers }) => ({
    ...state,
    customers: mergedCustomerLists(customers, state.customers)
  }))
);

function mergedCustomerLists(newCustomers: Array<string>, customers: Array<string>): Array<string> {
  let mergedCustomers: Array<string> = [...customers];
  newCustomers.forEach(c => (mergedCustomers = adjustedCustomerList(c, mergedCustomers)));
  return mergedCustomers;
}

function adjustedCustomerList(customer: string, customers: Array<string>): Array<string> {
  if (exists(customer, customers)) {
    return customers;
  }
  return addSorted(customer, customers);
}

function exists(customer: string, customers: Array<string>): boolean {
  return customers.indexOf(customer) > -1;
}

function addSorted(customer: string, customers: Array<string>): Array<string> {
  let idx = customers.findIndex(c => c > customer);
  idx = idx > -1 ? idx : customers.length;
  const before = customers.slice(0, idx);
  const after = customers.slice(idx);
  return [...before, customer, ...after];
}

export function reducer(state: CustomerState | undefined, action: Action) {
  return customerReducer(state, action);
}
