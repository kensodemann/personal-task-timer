import { createSelector, createFeatureSelector } from '@ngrx/store';
import { TaskTypeState } from './reducer';

export const selectTaskTypes = createFeatureSelector('taskTypes');
export const selectAllTaskTypes = createSelector(
  selectTaskTypes,
  (state: TaskTypeState) => state.taskTypes,
);
