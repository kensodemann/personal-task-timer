import { createSelector, createFeatureSelector } from '@ngrx/store';
import {
  selectors,
  TimersState,
} from '@app/store/reducers/timer/timer.reducer';
import { formatISO, subDays } from 'date-fns';
import { byDate } from './sorters';

export const selectTimers = createFeatureSelector('timers');
export const selectTimerEntities = createSelector(
  selectTimers,
  selectors.selectEntities,
);
export const selectAllTimers = createSelector(
  selectTimers,
  selectors.selectAll,
);
export const selectPeriodTimers = createSelector(
  selectAllTimers,
  (timers, props) => {
    const dt = formatISO(subDays(new Date(Date.now()), props.days), {
      representation: 'date',
    });
    return timers.filter(t => t.date >= dt);
  },
);
export const selectPeriodTimersSorted = createSelector(
  selectPeriodTimers,
  timers => timers.sort(byDate),
);
export const selectTodayTimers = createSelector(selectAllTimers, timers => {
  const dt = formatISO(new Date(Date.now()), { representation: 'date' });
  return timers.filter(t => t.date === dt);
});
export const selectAllActiveTimers = createSelector(selectAllTimers, timers =>
  timers.filter(t => !!t.startTime),
);
export const selectTimerCount = createSelector(
  selectTimers,
  selectors.selectTotal,
);
export const selectTimerIds = createSelector(selectTimers, selectors.selectIds);
export const selectTimerLoading = createSelector(
  selectTimers,
  (state: TimersState) => state.loading,
);
export const selectTimerError = createSelector(
  selectTimers,
  (state: TimersState) => state.error,
);
