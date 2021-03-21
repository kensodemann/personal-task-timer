import { Injectable } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { CustomersService } from '@app/core/firestore-data';
import { Customer } from '@app/models';
import {
  addCustomer,
  addCustomerFailure,
  addCustomerSuccess,
  customerAdded,
  customerModified,
  customerRemoved,
  customersAdded,
  loginChanged,
  removeCustomer,
  removeCustomerFailure,
  removeCustomerSuccess,
  startup,
  updateCustomer,
  updateCustomerFailure,
  updateCustomerSuccess,
} from '@app/store/actions';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

interface CustomerChangeAction {
  type: string;
  customer?: Customer;
  customers?: Array<Customer>;
}

@Injectable()
export class CustomerEffects {
  changes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startup),
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
      ofType(addCustomer),
      mergeMap(action =>
        from(this.customersService.add(action.customer)).pipe(
          map(() => addCustomerSuccess()),
          catchError(error => of(addCustomerFailure({ error }))),
        ),
      ),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomer),
      mergeMap(action =>
        from(this.customersService.update(action.customer)).pipe(
          map(() => updateCustomerSuccess()),
          catchError(error => of(updateCustomerFailure({ error }))),
        ),
      ),
    ),
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCustomer),
      mergeMap(action =>
        from(this.customersService.delete(action.customer)).pipe(
          map(() => removeCustomerSuccess()),
          catchError(error => of(removeCustomerFailure({ error }))),
        ),
      ),
    ),
  );

  convert$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginChanged),
        tap(() => this.customersService.convertCustomers()),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private customersService: CustomersService,
  ) {}

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
        return customersAdded({ customers: action.customers });

      case 'added':
        return customerAdded({ customer: action.customer });

      case 'modified':
        return customerModified({ customer: action.customer });

      case 'removed':
        return customerRemoved({ customer: action.customer });

      /* istanbul ignore next */
      default:
        console.error(`Unknown action type ${action.type}`);
        break;
    }
  }
}
