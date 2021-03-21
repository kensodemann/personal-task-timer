import { Customer } from '@app/models';
import { CustomersState, selectors } from '@app/store/customer/reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const byName = (c1: Customer, c2: Customer) => {
  const name1 = c1.name.toLowerCase();
  const name2 = c2.name.toLowerCase();
  if (name1 < name2) {
    return -1;
  }
  if (name1 > name2) {
    return 1;
  }
  return 0;
};

export const selectCustomers = createFeatureSelector('customers');
export const selectCustomerEntities = createSelector(
  selectCustomers,
  selectors.selectEntities,
);
export const selectAllCustomers = createSelector(
  selectCustomers,
  selectors.selectAll,
);
export const selectAllCustomersSorted = createSelector(
  selectAllCustomers,
  customers => customers.sort(byName),
);
export const selectActiveCustomersSorted = createSelector(
  selectAllCustomers,
  customers => customers.filter(customer => customer.isActive).sort(byName),
);
export const selectCustomerCount = createSelector(
  selectCustomers,
  selectors.selectTotal,
);
export const selectCustomerIds = createSelector(
  selectCustomers,
  selectors.selectIds,
);
export const selectCustomerLoading = createSelector(
  selectCustomers,
  (state: CustomersState) => state.loading,
);
export const selectCustomerError = createSelector(
  selectCustomers,
  (state: CustomersState) => state.error,
);
export const selectCustomer = createSelector(
  selectAllCustomers,
  (customers: Array<Customer>, props: any) =>
    customers.find(c => c.id === props.customerId),
);
