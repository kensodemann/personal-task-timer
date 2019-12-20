import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import { TimersService } from '@app/services/firestore-data';
import * as timerActions from '@app/store/actions/timer.actions';
import * as customerActions from '@app/store/actions/customer.actions';
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
      ofType(timerActions.load),
      mergeMap(() =>
        this.timersService.observeChanges().pipe(
          mergeMap(actions => this.unpackActions(actions)),
          mergeMap(action => this.timerAction(action))
        )
      )
    )
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timerActions.create),
      mergeMap(action =>
        from(this.timersService.add(action.timer)).pipe(
          map(() => timerActions.createSuccess()),
          catchError(error => of(timerActions.createFailure({ error })))
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timerActions.update),
      mergeMap(action =>
        from(this.timersService.update(action.timer)).pipe(
          map(() => timerActions.updateSuccess()),
          catchError(error => of(timerActions.updateFailure({ error })))
        )
      )
    )
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(timerActions.remove),
      mergeMap(action =>
        from(this.timersService.delete(action.timer)).pipe(
          map(() => timerActions.removeSuccess()),
          catchError(error => of(timerActions.removeFailure({ error })))
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

  private timerAction(action: TimerChangeAction): Array<Action> {
    switch (action.type) {
      case 'added many':
        return [
          timerActions.timersAdded({ timers: action.timers }),
          customerActions.addMany({ customers: action.timers.map(t => t.customer) })
        ];

      case 'added':
        return [
          timerActions.timerAdded({ timer: action.timer }),
          customerActions.add({ customer: action.timer.customer })
        ];

      case 'modified':
        return [timerActions.timerModified({ timer: action.timer })];

      case 'removed':
        return [timerActions.timerRemoved({ timer: action.timer })];

      /* istanbul ignore next */
      default:
        console.error(`Unknown action type ${action.type}`);
        break;
    }
  }
}