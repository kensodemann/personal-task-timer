import { Timer } from '@app/models';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { formatISO, startOfWeek, subDays } from 'date-fns';
import { selectors, TimersState } from './reducer';

const byDate = (t1: Timer, t2: Timer) => {
  if (t1.date > t2.date) {
    return -1;
  }
  if (t1.date < t2.date) {
    return 1;
  }
  return 0;
};

export const selectTimers = createFeatureSelector('timers');
export const selectTimerEntities = createSelector(
  selectTimers,
  selectors.selectEntities,
);
export const selectAllTimers = createSelector(
  selectTimers,
  selectors.selectAll,
);
export const selectCustomerTimers = createSelector(
  selectAllTimers,
  (timers: Array<Timer>, props: any) =>
    timers.filter(
      t =>
        t.customerId === props.customerId &&
        (!props.taskType || t.type === props.taskType),
    ),
);
export const selectCustomerTimersSorted = createSelector(
  selectCustomerTimers,
  (timers: Array<Timer>) => timers.sort(byDate),
);
export const selectCustomerTimersCount = createSelector(
  selectCustomerTimers,
  (timers: Array<Timer>) => timers.length,
);
export const selectCustomerTimersMinutes = createSelector(
  selectCustomerTimers,
  (timers: Array<Timer>) =>
    timers.reduce((minutes, t) => (minutes += t.minutes), 0),
);
export const selectPeriodTimers = createSelector(
  selectAllTimers,
  (timers: Array<Timer>, props: { days: number }) => {
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
export const selectThisWeekTimers = createSelector(selectAllTimers, timers => {
  const startDt = startOfWeek(Date.now());
  const dt = formatISO(startDt, { representation: 'date' });
  return timers.filter(t => t.date >= dt);
});
export const selectThisWeekTimersSorted = createSelector(
  selectThisWeekTimers,
  timers => timers.sort(byDate),
);
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
