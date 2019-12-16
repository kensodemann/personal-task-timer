import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

import * as fromAuth from './auth/auth.reducer';
import * as fromCustomer from './customer/customer.reducer';
import * as fromTaskType from './task-type/task-type.reducer';
import * as fromTimer from './timer/timer.reducer';

export interface State {
  auth: fromAuth.AuthState;
  customers: fromCustomer.CustomerState;
  taskTypes: fromTaskType.TaskTypeState;
  timers: fromTimer.TimersState;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  customers: fromCustomer.reducer,
  taskTypes: fromTaskType.reducer,
  timers: fromTimer.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
