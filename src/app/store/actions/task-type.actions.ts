import { createAction } from '@ngrx/store';

export enum TaskTypeActions {
  load = '[Application] Load Task Types'
}

export const load = createAction(TaskTypeActions.load);
