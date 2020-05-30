import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { State, selectAllTaskTypes, selectCustomer } from '@app/store';
import { Observable } from 'rxjs';
import { Customer } from '@app/models';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss']
})
export class CustomerPage implements OnInit {
  customerId: string;
  customer$: Observable<Customer>;
  taskTypes$: Observable<Array<string>>;

  constructor(private route: ActivatedRoute, private store: Store<State>) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.customer$ = this.store.pipe(select(selectCustomer, { customerId: this.customerId }));
    this.taskTypes$ = this.store.pipe(select(selectAllTaskTypes));
  }

  edit() {}
}
