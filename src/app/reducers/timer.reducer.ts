import { Action, createReducer, on } from '@ngrx/store';
import * as TimerActions from '@app/actions/timer.actions';
import { Timer } from '@app/models/timer';

export interface TimersState {
  data: Array<Timer>;
  loading: boolean;
  error?: Error;
}

export const initialState = { data: [], loading: false };

const scoreboardReducer = createReducer(
  initialState,
  on(TimerActions.load, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.loadSuccess, (state, { timers }) => ({ ...state, data: timers, loading: false })),
  on(TimerActions.loadFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.create, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.createSuccess, (state, { timer }) => ({ ...state, data: [...state.data, timer], loading: false })),
  on(TimerActions.createFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.update, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.updateSuccess, (state, { timer }) => {
    const data = [...state.data];
    const i = data.findIndex(t => t.id === timer.id);
    if (i > -1) {
      data[i] = timer;
    }
    return { ...state, data, loading: false };
  }),
  on(TimerActions.updateFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(TimerActions.remove, state => ({ ...state, loading: true, error: undefined })),
  on(TimerActions.removeSuccess, (state, { timer }) => {
    const i = state.data.indexOf(timer);
    const data = [...state.data];
    data.splice(i, 1);
    return { ...state, data, loading: false };
  }),
  on(TimerActions.removeFailure, (state, { error }) => ({ ...state, error, loading: false }))
);

export function reducer(state: TimersState | undefined, action: Action) {
  return scoreboardReducer(state, action);
}
