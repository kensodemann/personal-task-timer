import { Action, createReducer, on } from '@ngrx/store';
import * as TaskTypeActions from '@app/store/actions/task-type.actions';

export interface TaskTypeState {
  taskTypes: Array<string>;
}

export const initialState: TaskTypeState = {
  taskTypes: []
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
      'UI/UX Review'
    ]
  }))
);

export function reducer(state: TaskTypeState | undefined, action: Action) {
  return authReducer(state, action);
}
