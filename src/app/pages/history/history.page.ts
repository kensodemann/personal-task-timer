import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { logout } from '@app/store/actions/auth.actions';
import { State, selectPeriodTimersSorted } from '@app/store';
import { Timer } from '@app/models';

@Component({
  selector: 'app-tab2',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage implements OnInit {
  timers$: Observable<Array<Timer>>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.timers$ = this.store.pipe(select(selectPeriodTimersSorted, { days: 30 }));
  }

  logout() {
    this.store.dispatch(logout());
  }
}
