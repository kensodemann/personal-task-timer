import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { TimersService } from '@app/services/firestore-data';
import {
  create,
  createFailure,
  createSuccess,
  load,
  loadFailure,
  remove,
  removeFailure,
  removeSuccess,
  timerAdded,
  timerModified,
  timerRemoved,
  timersAdded,
  update,
  updateFailure,
  updateSuccess
} from '@app/store/actions/timer.actions';
import { Timer } from '@app/models';

interface TimerChangeAction {
  type: string;
  timer?: Timer;
  timers?: Array<Timer>;
}

@Injectable()
export class TimerEffects {
  constructor(private actions$: Actions, private timersService: TimersService) {}

  changes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(load),
      mergeMap(() =>
        this.timersService.observeChanges().pipe(
          mergeMap(actions => this.unpackActions(actions)),
          map(action => this.timerAction(action))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(create),
      mergeMap(action =>
        from(this.timersService.add(action.timer)).pipe(
          map(() => createSuccess()),
          catchError(error => of(createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(update),
      mergeMap(action =>
        from(this.timersService.update(action.timer)).pipe(
          map(() => updateSuccess()),
          catchError(error => of(updateFailure({ error })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(remove),
      mergeMap(action =>
        from(this.timersService.delete(action.timer)).pipe(
          map(() => removeSuccess()),
          catchError(error => of(removeFailure({ error })))
        )
      )
    )
  );

  private unpackActions(actions: Array<DocumentChangeAction<Timer>>): Array<TimerChangeAction> {
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
      timer: this.docActionToTimer(action)
    }));

    if (groupedActions.length) {
      changeActions.push({
        type: 'added many',
        timers: groupedActions.map(action => this.docActionToTimer(action))
      });
    }

    return changeActions;
  }

  private docActionToTimer(action: DocumentChangeAction<Timer>): Timer {
    return {
      id: action.payload.doc.id,
      ...(action.payload.doc.data() as Timer)
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
