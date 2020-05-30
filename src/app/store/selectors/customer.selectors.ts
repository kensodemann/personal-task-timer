import { createSelector, createFeatureSelector } from '@ngrx/store';

import { selectors, CustomersState } from '@app/store/reducers/customer/customer.reducer';
import { selectAllTimers } from './timer.selectors';
import { byName, byDate } from './sorters';
import { Customer, Timer } from '@app/models';

export const selectCustomers = createFeatureSelector('customers');
export const selectCustomerEntities = createSelector(selectCustomers, selectors.selectEntities);
export const selectAllCustomers = createSelector(selectCustomers, selectors.selectAll);
export const selectAllCustomersSorted = createSelector(selectAllCustomers, customers => customers.sort(byName));
export const selectCustomerCount = createSelector(selectCustomers, selectors.selectTotal);
export const selectCustomerIds = createSelector(selectCustomers, selectors.selectIds);
export const selectCustomerLoading = createSelector(selectCustomers, (state: CustomersState) => state.loading);
export const selectCustomerError = createSelector(selectCustomers, (state: CustomersState) => state.error);
export const selectCustomer = createSelector(selectAllCustomers, (customers: Array<Customer>, props: any) =>
  customers.find(c => c.id === props.customerId)
);

export const selectCustomerTimers = createSelector(selectAllTimers, (timers: Array<Timer>, props: any) =>
  timers.filter(t => t.customerId === props.customerId && (!props.taskType || t.type === props.taskType))
);
export const selectCustomerTimersSorted = createSelector(selectCustomerTimers, (timers: Array<Timer>) =>
  timers.sort(byDate)
);
export const selectCustomerTimersCount = createSelector(selectCustomerTimers, (timers: Array<Timer>) => timers.length);
export const selectCustomerTimersMinutes = createSelector(selectCustomerTimers, (timers: Array<Timer>) =>
  timers.reduce((minutes, t) => (minutes += t.minutes), 0)
);
