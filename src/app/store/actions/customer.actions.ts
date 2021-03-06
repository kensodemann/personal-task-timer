import { createAction, props } from '@ngrx/store';
import { Customer } from '@app/models';

export enum CustomerActionTypes {
  create = '[Customer Editor] add customer',
  createSuccess = '[Customers API] create success',
  createFailure = '[Customers API] create failure',

  update = '[Customer Editor] update customer',
  updateSuccess = '[Customers API] update success',
  updateFailure = '[Customers API] update failure',

  remove = '[Today Page] remove customer',
  removeSuccess = '[Customers API] remove success',
  removeFailure = '[Customers API] remove failure',

  load = '[Application] load customers',
  loadSuccess = '[Customers API] load success',
  loadFailure = '[Customers API] load failure',

  customerAdded = '[Customer Load State Change] added',
  customersAdded = '[Customer Load State Change] added many',
  customerModified = '[Customer Load State Change] modified',
  customerRemoved = '[Customer Load State Change] removed',
}

export const create = createAction(
  CustomerActionTypes.create,
  props<{ customer: Customer }>(),
);
export const createSuccess = createAction(CustomerActionTypes.createSuccess);
export const createFailure = createAction(
  CustomerActionTypes.createFailure,
  props<{ error: Error }>(),
);

export const update = createAction(
  CustomerActionTypes.update,
  props<{ customer: Customer }>(),
);
export const updateSuccess = createAction(CustomerActionTypes.updateSuccess);
export const updateFailure = createAction(
  CustomerActionTypes.updateFailure,
  props<{ error: Error }>(),
);

export const remove = createAction(
  CustomerActionTypes.remove,
  props<{ customer: Customer }>(),
);
export const removeSuccess = createAction(CustomerActionTypes.removeSuccess);
export const removeFailure = createAction(
  CustomerActionTypes.removeFailure,
  props<{ error: Error }>(),
);

export const load = createAction(CustomerActionTypes.load);
export const loadSuccess = createAction(CustomerActionTypes.loadSuccess);
export const loadFailure = createAction(
  CustomerActionTypes.loadFailure,
  props<{ error: Error }>(),
);

export const customerAdded = createAction(
  CustomerActionTypes.customerAdded,
  props<{ customer: Customer }>(),
);
export const customersAdded = createAction(
  CustomerActionTypes.customersAdded,
  props<{ customers: Array<Customer> }>(),
);
export const customerModified = createAction(
  CustomerActionTypes.customerModified,
  props<{ customer: Customer }>(),
);
export const customerRemoved = createAction(
  CustomerActionTypes.customerRemoved,
  props<{ customer: Customer }>(),
);
