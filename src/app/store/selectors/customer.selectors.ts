import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CustomerState } from '@app/store/reducers/customer/customer.reducer';

export const selectCustomers = createFeatureSelector('customers');
export const selectAllCustomers = createSelector(selectCustomers, (state: CustomerState) => state.customers);
