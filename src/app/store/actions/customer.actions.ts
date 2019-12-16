import { createAction, props } from '@ngrx/store';

export enum CustomerActions {
  add = '[Timer API] Add Customer',
  addMany = '[Timer API] Add Customers'
}

export const add = createAction(CustomerActions.add, props<{ customer: string }>());
export const addMany = createAction(CustomerActions.addMany, props<{ customers: Array<string> }>());
