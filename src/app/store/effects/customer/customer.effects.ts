import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Action } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, from } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { CustomersService } from '@app/services/firestore-data';
import * as customerActions from '@app/store/actions/customer.actions';
import { Customer } from '@app/models';

interface CustomerChangeAction {
  type: string;
  customer?: Customer;
  customers?: Array<Customer>;
}

@Injectable()
export class CustomerEffects {
  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
  ) {}

  changes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerActions.load),
      mergeMap(() =>
        this.customersService.observeChanges().pipe(
          mergeMap(actions => this.unpackActions(actions)),
          map(action => this.customerAction(action)),
        ),
      ),
    ),
  );

  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerActions.create),
      mergeMap(action =>
        from(this.customersService.add(action.customer)).pipe(
          map(() => customerActions.createSuccess()),
          catchError(error => of(customerActions.createFailure({ error }))),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerActions.update),
      mergeMap(action =>
        from(this.customersService.update(action.customer)).pipe(
          map(() => customerActions.updateSuccess()),
          catchError(error => of(customerActions.updateFailure({ error }))),
        ),
      ),
    ),
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(customerActions.remove),
      mergeMap(action =>
        from(this.customersService.delete(action.customer)).pipe(
          map(() => customerActions.removeSuccess()),
          catchError(error => of(customerActions.removeFailure({ error }))),
        ),
      ),
    ),
  );

  private unpackActions(
    actions: Array<DocumentChangeAction<Customer>>,
  ): Array<CustomerChangeAction> {
    let mainActions: Array<DocumentChangeAction<Customer>>;
    let groupedActions: Array<DocumentChangeAction<Customer>>;
    if (actions.length > 1) {
      groupedActions = actions.filter(a => a.type === 'added');
      mainActions = actions.filter(a => a.type !== 'added');
    } else {
      groupedActions = [];
      mainActions = actions;
    }

    const changeActions: Array<CustomerChangeAction> = mainActions.map(
      action => ({
        type: action.type,
        customer: this.docActionToCustomer(action),
      }),
    );

    if (groupedActions.length) {
      changeActions.push({
        type: 'added many',
        customers: groupedActions.map(action =>
          this.docActionToCustomer(action),
        ),
      });
    }

    return changeActions;
  }

  private docActionToCustomer(
    action: DocumentChangeAction<Customer>,
  ): Customer {
    return {
      id: action.payload.doc.id,
      ...(action.payload.doc.data() as Customer),
    };
  }

  private customerAction(action: CustomerChangeAction): Action {
    switch (action.type) {
      case 'added many':
        return customerActions.customersAdded({ customers: action.customers });

      case 'added':
        return customerActions.customerAdded({ customer: action.customer });

      case 'modified':
        return customerActions.customerModified({ customer: action.customer });

      case 'removed':
        return customerActions.customerRemoved({ customer: action.customer });

      /* istanbul ignore next */
      default:
        console.error(`Unknown action type ${action.type}`);
        break;
    }
  }
}
