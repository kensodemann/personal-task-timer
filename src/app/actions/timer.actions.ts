import { createAction, props } from '@ngrx/store';
import { Timer } from '@app/models/timer';

export enum TimerActionTypes {
  create = '[Timer Editor] add timer',
  update = '[Timer Editor] update timer',
  remove = '[Today Page] remove timer',
  load = '[Application] load timers',

  createSuccess = '[Timers API] create success',
  createFailure = '[Timers API] create failure',
  updateSuccess = '[Timers API] update success',
  updateFailure = '[Timers API] update failure',
  removeSuccess = '[Timers API] remove success',
  removeFailure = '[Timers API] remove failure',
  loadSuccess = '[Timers API] load success',
  loadFailure = '[Timers API] load failure'
}

export const create = createAction(TimerActionTypes.create, props<{ timer: Timer }>());
export const createSuccess = createAction(TimerActionTypes.createSuccess, props<{ timer: Timer }>());
export const createFailure = createAction(TimerActionTypes.createFailure, props<{ error: Error }>());

export const update = createAction(TimerActionTypes.update, props<{ timer: Timer }>());
export const updateSuccess = createAction(TimerActionTypes.updateSuccess, props<{ timer: Timer }>());
export const updateFailure = createAction(TimerActionTypes.updateFailure, props<{ error: Error }>());

export const remove = createAction(TimerActionTypes.remove, props<{ timer: Timer }>());
export const removeSuccess = createAction(TimerActionTypes.removeSuccess, props<{ timer: Timer }>());
export const removeFailure = createAction(TimerActionTypes.removeFailure, props<{ error: Error }>());

export const load = createAction(TimerActionTypes.load, props<{ throughDate: Date }>());
export const loadSuccess = createAction(TimerActionTypes.loadSuccess, props<{ timers: Array<Timer> }>());
export const loadFailure = createAction(TimerActionTypes.loadFailure, props<{ error: Error }>());
