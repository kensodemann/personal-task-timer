import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectors, CustomersState } from '@app/store/reducers/customer/customer.reducer';

export const selectCustomers = createFeatureSelector('customers');
export const selectCustomerEntities = createSelector(selectCustomers, selectors.selectEntities);
export const selectAllCustomers = createSelector(selectCustomers, selectors.selectAll);
export const selectAllCustomersSortedByName = createSelector(selectAllCustomers, customers =>
  customers.sort((t1, t2) => {
    if (t1.name > t2.name) {
      return -1;
    }
    if (t1.name < t2.name) {
      return 1;
    }
    return 0;
  })
);
export const selectCustomerCount = createSelector(selectCustomers, selectors.selectTotal);
export const selectCustomerIds = createSelector(selectCustomers, selectors.selectIds);
export const selectCustomerLoading = createSelector(selectCustomers, (state: CustomersState) => state.loading);
export const selectCustomerError = createSelector(selectCustomers, (state: CustomersState) => state.error);
