import { Customer } from '@app/models';
import {
  addCustomer,
  addCustomerFailure,
  customerAdded,
  customerModified,
  customerRemoved,
  customersAdded,
  loadCustomersFailure,
  loginChanged,
  removeCustomer,
  removeCustomerFailure,
  updateCustomer,
  updateCustomerFailure,
} from '@app/store/actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

export interface CustomersState extends EntityState<Customer> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Customer>();

export const initialState = adapter.getInitialState({ loading: false });

const customerReducer = createReducer(
  initialState,
  on(loginChanged, state =>
    adapter.removeAll({ ...state, loading: true, error: undefined }),
  ),
  on(loadCustomersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(addCustomer, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(addCustomerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateCustomer, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(updateCustomerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(removeCustomer, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(removeCustomerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(customerAdded, (state, { customer }) =>
    adapter.addOne(customer, { ...state, loading: false }),
  ),
  on(customersAdded, (state, { customers }) =>
    adapter.addMany(customers, { ...state, loading: false }),
  ),
  on(customerModified, (state, { customer }) =>
    adapter.updateOne(
      { id: customer.id, changes: customer },
      { ...state, loading: false },
    ),
  ),
  on(customerRemoved, (state, { customer }) =>
    adapter.removeOne(customer.id, { ...state, loading: false }),
  ),
);

export const reducer = (state: CustomersState | undefined, action: Action) =>
  customerReducer(state, action);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
};
