import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State, selectCustomerTimersMinutes, selectCustomerTimersCount } from '@app/store';

@Component({
  selector: 'app-customer-task-summary',
  templateUrl: './customer-task-summary.component.html',
  styleUrls: ['./customer-task-summary.component.scss']
})
export class CustomerTaskSummaryComponent implements OnInit {
  @Input() customerId: string;
  @Input() taskType: string;

  count$: Observable<number>;
  minutes$: Observable<number>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.count$ = this.store.pipe(
      select(selectCustomerTimersCount, { customerId: this.customerId, taskType: this.taskType })
    );
    this.minutes$ = this.store.pipe(
      select(selectCustomerTimersMinutes, { customerId: this.customerId, taskType: this.taskType })
    );
  }
}
