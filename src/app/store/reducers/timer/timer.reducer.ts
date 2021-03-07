import { Timer } from '@app/models';
import {
  addTimer,
  addTimerFailure,
  loadTimersFailure,
  loginChanged,
  removeTimer,
  removeTimerFailure,
  timerAdded,
  timerModified,
  timerRemoved,
  timersAdded,
  updateTimer,
  updateTimerFailure,
} from '@app/store/actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

export interface TimersState extends EntityState<Timer> {
  loading: boolean;
  error?: Error;
}

const adapter = createEntityAdapter<Timer>();

export const initialState = adapter.getInitialState({ loading: false });

const timerReducer = createReducer(
  initialState,
  on(loginChanged, state =>
    adapter.removeAll({ ...state, loading: true, error: undefined }),
  ),
  on(loadTimersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(addTimer, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(addTimerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(updateTimer, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(updateTimerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(removeTimer, state => ({
    ...state,
    loading: true,
    error: undefined,
  })),
  on(removeTimerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(timerAdded, (state, { timer }) =>
    adapter.addOne(timer, { ...state, loading: false }),
  ),
  on(timersAdded, (state, { timers }) =>
    adapter.addMany(timers, { ...state, loading: false }),
  ),
  on(timerModified, (state, { timer }) =>
    adapter.updateOne(
      { id: timer.id, changes: timer },
      { ...state, loading: false },
    ),
  ),
  on(timerRemoved, (state, { timer }) =>
    adapter.removeOne(timer.id, { ...state, loading: false }),
  ),
);

export const reducer = (state: TimersState | undefined, action: Action) =>
  timerReducer(state, action);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
export const selectors = {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
};
