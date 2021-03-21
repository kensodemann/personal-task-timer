import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';
import { AuthState, reducer as authReducer } from './auth/reducer';
import {
  CustomersState,
  reducer as customerReducer,
} from './customer/reducer';
import {
  TaskTypeState,
  reducer as taskTypeReducer,
} from './task-type/reducer';
import { TimersState, reducer as timerReducer } from './timer/reducer';

export interface State {
  auth: AuthState;
  customers: CustomersState;
  taskTypes: TaskTypeState;
  timers: TimersState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  customers: customerReducer,
  taskTypes: taskTypeReducer,
  timers: timerReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export * from './actions';

export * from './auth/effects';
export * from './customer/effects';
export * from './timer/effects';

export * from './auth/selectors';
export * from './customer/selectors';
export * from './task-type/selectors';
export * from './timer/selectors';

