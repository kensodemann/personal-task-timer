import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromTimer from './timer.reducer';

export interface State {
  timers: fromTimer.TimersState;
}

export const reducers: ActionReducerMap<State> = {
  timers: fromTimer.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
