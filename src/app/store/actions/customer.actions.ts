import { createAction, props } from '@ngrx/store';
import { Customer } from '@app/models';

export const create = createAction(
  '[Customer Editor] add customer',
  props<{ customer: Customer }>(),
);
export const createSuccess = createAction('[Customers API] create success');
export const createFailure = createAction(
  '[Customers API] create failure',
  props<{ error: Error }>(),
);

export const update = createAction(
  '[Customer Editor] update customer',
  props<{ customer: Customer }>(),
);
export const updateSuccess = createAction('[Customers API] update success');
export const updateFailure = createAction(
  '[Customers API] update failure',
  props<{ error: Error }>(),
);

export const remove = createAction(
  '[Today Page] remove customer',
  props<{ customer: Customer }>(),
);
export const removeSuccess = createAction('[Customers API] remove success');
export const removeFailure = createAction(
  '[Customers API] remove failure',
  props<{ error: Error }>(),
);

export const load = createAction('[Application] load customers');
export const loadSuccess = createAction('[Customers API] load success');
export const loadFailure = createAction(
  '[Customers API] load failure',
  props<{ error: Error }>(),
);

export const customerAdded = createAction(
  '[Customer Load State Change] added',
  props<{ customer: Customer }>(),
);
export const customersAdded = createAction(
  '[Customer Load State Change] added many',
  props<{ customers: Array<Customer> }>(),
);
export const customerModified = createAction(
  '[Customer Load State Change] modified',
  props<{ customer: Customer }>(),
);
export const customerRemoved = createAction(
  '[Customer Load State Change] removed',
  props<{ customer: Customer }>(),
);
