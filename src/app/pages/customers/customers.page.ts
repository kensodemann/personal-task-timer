import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { logout } from '@app/store/actions/auth.actions';
import { State, selectAllCustomersSortedByName } from '@app/store';
import { Customer } from '@app/models';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss']
})
export class CustomersPage implements OnInit {
  customers$: Observable<Array<Customer>>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.customers$ = this.store.pipe(select(selectAllCustomersSortedByName));
  }

  logout() {
    this.store.dispatch(logout());
  }
}
