import { createAction, props } from '@ngrx/store';
import { Timer } from '@app/models';

export const create = createAction(
  '[Timer Editor] add timer',
  props<{ timer: Timer }>(),
);
export const createSuccess = createAction('[Timers API] create success');
export const createFailure = createAction(
  '[Timers API] create failure',
  props<{ error: Error }>(),
);

export const update = createAction(
  '[Timer Editor] update timer',
  props<{ timer: Timer }>(),
);
export const updateSuccess = createAction('[Timers API] update success');
export const updateFailure = createAction(
  '[Timers API] update failure',
  props<{ error: Error }>(),
);

export const remove = createAction(
  '[Today Page] remove timer',
  props<{ timer: Timer }>(),
);
export const removeSuccess = createAction('[Timers API] remove success');
export const removeFailure = createAction(
  '[Timers API] remove failure',
  props<{ error: Error }>(),
);

export const load = createAction('[Application] load timers');
export const loadSuccess = createAction('[Timers API] load success');
export const loadFailure = createAction(
  '[Timers API] load failure',
  props<{ error: Error }>(),
);

export const timerAdded = createAction(
  '[Timer Load State Change] added',
  props<{ timer: Timer }>(),
);
export const timersAdded = createAction(
  '[Timer Load State Change] added many',
  props<{ timers: Array<Timer> }>(),
);
export const timerModified = createAction(
  '[Timer Load State Change] modified',
  props<{ timer: Timer }>(),
);
export const timerRemoved = createAction(
  '[Timer Load State Change] removed',
  props<{ timer: Timer }>(),
);

export const start = createAction(
  '[Today Page] timer start',
  props<{ timer: Timer }>(),
);
export const startSuccess = createAction('[Timers API] timer start success');
export const startFailure = createAction(
  '[Timers API] timer start failure',
  props<{ error: Error }>(),
);

export const stop = createAction(
  '[Today Page] timer stopped',
  props<{ timer: Timer }>(),
);
export const stopSuccess = createAction('[Timers API] timer stop success');
export const stopFailure = createAction(
  '[Timers API] timer stop failure',
  props<{ error: Error }>(),
);
