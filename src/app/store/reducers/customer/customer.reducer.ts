import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as CustomerActions from '@app/store/actions/customer.actions';
import { Customer } from '@app/models';

export interface CustomersState extends EntityState<Customer> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Customer>();

export const initialState = adapter.getInitialState({ loading: false });

const customerReducer = createReducer(
  initialState,
  on(CustomerActions.load, state => adapter.removeAll({ ...state, loading: true, error: undefined })),
  on(CustomerActions.loadFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(CustomerActions.create, state => ({ ...state, loading: true, error: undefined })),
  on(CustomerActions.createFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(CustomerActions.update, state => ({ ...state, loading: true, error: undefined })),
  on(CustomerActions.updateFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(CustomerActions.remove, state => ({ ...state, loading: true, error: undefined })),
  on(CustomerActions.removeFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(CustomerActions.customerAdded, (state, { customer }) => adapter.addOne(customer, { ...state, loading: false })),
  on(CustomerActions.customersAdded, (state, { customers }) =>
    adapter.addMany(customers, { ...state, loading: false })
  ),
  on(CustomerActions.customerModified, (state, { customer }) =>
    adapter.updateOne({ id: customer.id, changes: customer }, { ...state, loading: false })
  ),
  on(CustomerActions.customerRemoved, (state, { customer }) =>
    adapter.removeOne(customer.id, { ...state, loading: false })
  )
);

export function reducer(state: CustomersState | undefined, action: Action) {
  return customerReducer(state, action);
}

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
};
