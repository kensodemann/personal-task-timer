import { createAction, props } from '@ngrx/store';
import { Timer } from '@app/models/timer';

export enum TimerActionTypes {
  create = '[Timer Editor] add timer',
  createSuccess = '[Timers API] create success',
  createFailure = '[Timers API] create failure',

  update = '[Timer Editor] update timer',
  updateSuccess = '[Timers API] update success',
  updateFailure = '[Timers API] update failure',

  remove = '[Today Page] remove timer',
  removeSuccess = '[Timers API] remove success',
  removeFailure = '[Timers API] remove failure',

  load = '[Application] load timers',
  loadSuccess = '[Timers API] load success',
  loadFailure = '[Timers API] load failure',

  timerAdded = '[Timer Load State Change] added',
  timersAdded = '[Timer Load State Change] added many',
  timerModified = '[Timer Load State Change] modified',
  timerRemoved = '[Timer Load State Change] removed'
}

export const create = createAction(TimerActionTypes.create, props<{ timer: Timer }>());
export const createSuccess = createAction(TimerActionTypes.createSuccess);
export const createFailure = createAction(TimerActionTypes.createFailure, props<{ error: Error }>());

export const update = createAction(TimerActionTypes.update, props<{ timer: Timer }>());
export const updateSuccess = createAction(TimerActionTypes.updateSuccess);
export const updateFailure = createAction(TimerActionTypes.updateFailure, props<{ error: Error }>());

export const remove = createAction(TimerActionTypes.remove, props<{ timer: Timer }>());
export const removeSuccess = createAction(TimerActionTypes.removeSuccess);
export const removeFailure = createAction(TimerActionTypes.removeFailure, props<{ error: Error }>());

export const load = createAction(TimerActionTypes.load);
export const loadSuccess = createAction(TimerActionTypes.loadSuccess);
export const loadFailure = createAction(TimerActionTypes.loadFailure, props<{ error: Error }>());

export const timerAdded = createAction(TimerActionTypes.timerAdded, props<{ timer: Timer }>());
export const timersAdded = createAction(TimerActionTypes.timersAdded, props<{ timers: Array<Timer> }>());
export const timerModified = createAction(TimerActionTypes.timerModified, props<{ timer: Timer }>());
export const timerRemoved = createAction(TimerActionTypes.timerRemoved, props<{ timer: Timer }>());
