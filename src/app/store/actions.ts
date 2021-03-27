import { createAction, props } from '@ngrx/store';
import { Customer, Timer } from '@app/models';

export const startup = createAction('[Application] startup');

export const loginChanged = createAction(
  '[Application] login changed',
  props<{ email: string; userId: string }>(),
);

export const login = createAction(
  '[LoginPage] login',
  props<{ email: string; password: string }>(),
);
export const loginSuccess = createAction('[Auth API] login success');
export const loginFailure = createAction(
  '[Auth API] login failure',
  props<{ error: Error }>(),
);

export const logout = createAction('[Application] logout');
export const logoutSuccess = createAction('[Auth API] logout success');
export const logoutFailure = createAction(
  '[Auth API] logout failure',
  props<{ error: Error }>(),
);

export const resetPassword = createAction(
  '[LoginPage] reset password',
  props<{ email: string }>(),
);
export const resetPasswordSuccess = createAction(
  '[Auth API] reset password success',
  props<{ email: string }>(),
);
export const resetPasswordFailure = createAction(
  '[Auth API] reset password failure',
  props<{ error: Error }>(),
);

export const addCustomer = createAction(
  '[Customer Editor] add customer',
  props<{ customer: Customer }>(),
);
export const addCustomerSuccess = createAction(
  '[Customers API] add customer success',
);
export const addCustomerFailure = createAction(
  '[Customers API] add customer failure',
  props<{ error: Error }>(),
);

export const updateCustomer = createAction(
  '[Customer Editor] update customer',
  props<{ customer: Customer }>(),
);
export const updateCustomerSuccess = createAction(
  '[Customers API] update customer success',
);
export const updateCustomerFailure = createAction(
  '[Customers API] update customer failure',
  props<{ error: Error }>(),
);

export const removeCustomer = createAction(
  '[Timer List Page] remove customer',
  props<{ customer: Customer }>(),
);
export const removeCustomerSuccess = createAction(
  '[Customers API] remove customer success',
);
export const removeCustomerFailure = createAction(
  '[Customers API] remove customer failure',
  props<{ error: Error }>(),
);

export const loadCustomersSuccess = createAction(
  '[Customers API] load customers success',
);
export const loadCustomersFailure = createAction(
  '[Customers API] load customers failure',
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

export const addTimer = createAction(
  '[Timer Editor] add timer',
  props<{ timer: Timer }>(),
);
export const addTimerSuccess = createAction('[Timers API] add timer success');
export const addTimerFailure = createAction(
  '[Timers API] add timer failure',
  props<{ error: Error }>(),
);

export const updateTimer = createAction(
  '[Timer Editor] update timer',
  props<{ timer: Timer }>(),
);
export const updateTimerSuccess = createAction(
  '[Timers API] update timer success',
);
export const updateTimerFailure = createAction(
  '[Timers API] update timer failure',
  props<{ error: Error }>(),
);

export const removeTimer = createAction(
  '[Timer List Page] remove timer',
  props<{ timer: Timer }>(),
);
export const removeTimerSuccess = createAction(
  '[Timers API] remove timer success',
);
export const removeTimerFailure = createAction(
  '[Timers API] remove timer failure',
  props<{ error: Error }>(),
);

export const loadTimersSuccess = createAction(
  '[Timers API] load timers success',
);
export const loadTimersFailure = createAction(
  '[Timers API] load timers failure',
  props<{ error: Error }>(),
);

export const timerAdded = createAction(
  '[Timer Load State Change] added',
  props<{ timer: Timer }>(),
);
export const timersAdded = createAction(
  '[Timer Load State Change] added many',
  props<{ timers: Array<Timer> }>(),
);
export const timerModified = createAction(
  '[Timer Load State Change] modified',
  props<{ timer: Timer }>(),
);
export const timerRemoved = createAction(
  '[Timer Load State Change] removed',
  props<{ timer: Timer }>(),
);

export const startTimer = createAction(
  '[Timer List Page] timer start',
  props<{ timer: Timer }>(),
);
export const startTimerSuccess = createAction(
  '[Timers API] timer start success',
);
export const startTimerFailure = createAction(
  '[Timers API] timer start failure',
  props<{ error: Error }>(),
);

export const stopTimer = createAction(
  '[Timer List Page] timer stopped',
  props<{ timer: Timer }>(),
);
export const stopTimerSuccess = createAction('[Timers API] timer stop success');
export const stopTimerFailure = createAction(
  '[Timers API] timer stop failure',
  props<{ error: Error }>(),
);
