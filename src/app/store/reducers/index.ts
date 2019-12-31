import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

import { AuthState, reducer as authReducer } from './auth/auth.reducer';
import { TaskTypeState, reducer as taskTypeReducer } from './task-type/task-type.reducer';
import { TimersState, reducer as timerReducer } from './timer/timer.reducer';

export interface State {
  auth: AuthState;
  taskTypes: TaskTypeState;
  timers: TimersState;
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  taskTypes: taskTypeReducer,
  timers: timerReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
