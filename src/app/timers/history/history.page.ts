import { Component, OnInit } from '@angular/core';
import { Timer } from '@app/models';
import { selectPeriodTimersSorted, State } from '@app/store';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
})
export class HistoryPage implements OnInit {
  timers$: Observable<Array<Timer>>;

  constructor(private store: Store<State>) {}

  ngOnInit() {
    this.timers$ = this.store.pipe(
      select(selectPeriodTimersSorted, { days: 30 }),
    );
  }
}
