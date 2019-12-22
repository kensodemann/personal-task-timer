import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectTimers, selectAllTimers } from './timer.selectors';
import { TimersState } from '../reducers/timer/timer.reducer';
import { Timer } from '@app/models';

export const selectAllCustomers = createSelector(selectAllTimers, (timers: Array<Timer>) =>
  Array.from(new Set(timers.map(t => t.customer))).sort()
);
