import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Timer } from '@app/models';
import { TimersService } from '@app/core/firestore-data';
import {
  addTimer,
  addTimerFailure,
  addTimerSuccess,
  removeTimer,
  removeTimerFailure,
  removeTimerSuccess,
  startTimer,
  startTimerFailure,
  startTimerSuccess,
  startup,
  stopTimer,
  stopTimerFailure,
  stopTimerSuccess,
  timerAdded,
  timerModified,
  timerRemoved,
  timersAdded,
  updateTimer,
  updateTimerFailure,
  updateTimerSuccess,
} from '@app/store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

interface TimerChangeAction {
  type: string;
  timer?: Timer;
  timers?: Array<Timer>;
}

@Injectable()
export class TimerEffects {
  changes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startup),
      mergeMap(() =>
        this.timersService.observeChanges().pipe(
          mergeMap(actions => this.unpackActions(actions)),
          map(action => this.timerAction(action)),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addTimer),
      mergeMap(action =>
        from(this.timersService.add(action.timer)).pipe(
          map(() => addTimerSuccess()),
          catchError(error => of(addTimerFailure({ error }))),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTimer),
      mergeMap(action =>
        from(this.timersService.update(action.timer)).pipe(
          map(() => updateTimerSuccess()),
          catchError(error => of(updateTimerFailure({ error }))),
        ),
      ),
    ),
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeTimer),
      mergeMap(action =>
        from(this.timersService.delete(action.timer)).pipe(
          map(() => removeTimerSuccess()),
          catchError(error => of(removeTimerFailure({ error }))),
        ),
      ),
    ),
  );

  start$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startTimer),
      mergeMap(action =>
        from(this.timersService.start(action.timer.id)).pipe(
          map(() => startTimerSuccess()),
          catchError(error => of(startTimerFailure({ error }))),
        ),
      ),
    ),
  );

  stop$ = createEffect(() =>
    this.actions$.pipe(
      ofType(stopTimer),
      mergeMap(action =>
        from(this.timersService.stop(action.timer.id)).pipe(
          map(() => stopTimerSuccess()),
          catchError(error => of(stopTimerFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private timersService: TimersService,
  ) {}

  private unpackActions(
    actions: Array<DocumentChangeAction<Timer>>,
  ): Array<TimerChangeAction> {
    let mainActions: Array<DocumentChangeAction<Timer>>;
    let groupedActions: Array<DocumentChangeAction<Timer>>;
    if (actions.length > 1) {
      groupedActions = actions.filter(a => a.type === 'added');
      mainActions = actions.filter(a => a.type !== 'added');
    } else {
      groupedActions = [];
      mainActions = actions;
    }

    const changeActions: Array<TimerChangeAction> = mainActions.map(action => ({
      type: action.type,
      timer: this.docActionToTimer(action),
    }));

    if (groupedActions.length) {
      changeActions.push({
        type: 'added many',
        timers: groupedActions.map(action => this.docActionToTimer(action)),
      });
    }

    return changeActions;
  }

  private docActionToTimer(action: DocumentChangeAction<Timer>): Timer {
    return {
      id: action.payload.doc.id,
      ...(action.payload.doc.data() as Timer),
    };
  }

  private timerAction(action: TimerChangeAction): Action {
    switch (action.type) {
      case 'added many':
        return timersAdded({ timers: action.timers });

      case 'added':
        return timerAdded({ timer: action.timer });

      case 'modified':
        return timerModified({ timer: action.timer });

      case 'removed':
        return timerRemoved({ timer: action.timer });

      /* istanbul ignore next */
      default:
        console.error(`Unknown action type ${action.type}`);
        break;
    }
  }
}
