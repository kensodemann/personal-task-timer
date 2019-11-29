import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '@env/environment';

import * as fromTimer from './timer/timer.reducer';
import * as fromAuth from './auth/auth.reducer';

export interface State {
  auth: fromAuth.AuthState;
  timers: fromTimer.TimersState;
}

export const reducers: ActionReducerMap<State> = {
  auth: fromAuth.reducer,
  timers: fromTimer.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
