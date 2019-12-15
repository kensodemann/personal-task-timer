import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

import * as fromTaskType from './task-type/task-type.reducer';
import * as fromTimer from './timer/timer.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
  auth: fromAuth.AuthState;
  taskTypes: fromTaskType.TaskTypeState;
  timers: fromTimer.TimersState;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  taskTypes: fromTaskType.reducer,
  timers: fromTimer.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
