import * as TaskTypeActions from '@app/store/actions/task-type.actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface TaskTypeState {
  taskTypes: Array<string>;
}

export const initialState: TaskTypeState = {
  taskTypes: [],
};

const authReducer = createReducer(
  initialState,
  on(TaskTypeActions.load, state => ({
    ...state,
    taskTypes: [
      'Consulting',
      'Bug',
      'CSI Time',
      'Architecture Review',
      'Code Review',
      'Framework Training',
      'Working Session',
      'App Checkup',
      'Appflow Onboarding',
      'UI/UX Review',
    ],
  })),
);

export const reducer = (state: TaskTypeState | undefined, action: Action) =>
  authReducer(state, action);
