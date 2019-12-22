import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectors, TimersState } from '@app/store/reducers/timer/timer.reducer';
import { formatISO } from 'date-fns';

export const selectTimers = createFeatureSelector('timers');
export const selectTimerEntities = createSelector(selectTimers, selectors.selectEntities);
export const selectAllTimers = createSelector(selectTimers, selectors.selectAll);
export const selectTodayTimers = createSelector(selectAllTimers, timers => {
  const dt = formatISO(new Date(Date.now()), { representation: 'date' });
  return timers.filter(t => t.date === dt);
});
export const selectAllActiveTimers = createSelector(selectAllTimers, timers => timers.filter(t => !!t.startTime));
export const selectTimerCount = createSelector(selectTimers, selectors.selectTotal);
export const selectTimerIds = createSelector(selectTimers, selectors.selectIds);
export const selectTimerLoading = createSelector(selectTimers, (state: TimersState) => state.loading);
export const selectTimerError = createSelector(selectTimers, (state: TimersState) => state.error);
