import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';
import { AuthState, reducer as authReducer } from './auth/reducer';
import { CustomersState, reducer as customerReducer } from './customer/reducer';
import { ProjectsState, reducer as projectReducer } from './project/reducer';
import { TimersState, reducer as timerReducer } from './timer/reducer';

export interface State {
  auth: AuthState;
  customers: CustomersState;
  projects: ProjectsState;
  timers: TimersState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  customers: customerReducer,
  projects: projectReducer,
  timers: timerReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

export * from './actions';

export * from './auth/effects';
export * from './customer/effects';
export * from './project/effects';
export * from './timer/effects';

export * from './auth/selectors';
export * from './customer/selectors';
export * from './project/selectors';
export * from './timer/selectors';
