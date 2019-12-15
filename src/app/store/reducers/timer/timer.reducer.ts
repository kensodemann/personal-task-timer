import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

import * as TimerActions from '@app/store/actions/timer.actions';
import { Timer } from '@app/models/timer';

export interface TimersState extends EntityState<Timer> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Timer>();

export const initialState = adapter.getInitialState({ loading: false });

const timerReducer = createReducer(
  initialState,
  on(TimerActions.load, state => adapter.removeAll({ ...state, loading: true, error: undefined })),
  on(TimerActions.loadFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.create, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.createFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.update, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.updateFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.remove, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.removeFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.timerAdded, (state, { timer }) => adapter.addOne(timer, { ...state, loading: false })),
  on(TimerActions.timersAdded, (state, { timers }) => adapter.addMany(timers, { ...state, loading: false })),
  on(TimerActions.timerModified, (state, { timer }) =>
    adapter.updateOne({ id: timer.id, changes: timer }, { ...state, loading: false })
  ),
  on(TimerActions.timerRemoved, (state, { timer }) => adapter.removeOne(timer.id, { ...state, loading: false }))
);

export function reducer(state: TimersState | undefined, action: Action) {
  return timerReducer(state, action);
}

const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
};
