import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { Timer } from '@app/models/timer';
import { logout } from '@app/store/actions/auth.actions';
import { State } from '@app/store/reducers';

@Component({
  selector: 'app-tab1',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss']
})
export class TodayPage {
  timers: Array<Timer>;

  constructor(private store: Store<State>) {
    this.timers = [
      {
        title: 'Help someone do something',
        customer: 'Ace Hardware',
        type: 'Advisory',
        minutes: 0,
        date: '2019-12-07'
      },
      {
        title: 'Uhg, this is so ugly',
        customer: 'Ace Hardware',
        type: 'Code Review',
        task: '#22950',
        minutes: 27,
        date: '2019-12-07'
      },
      {
        title: 'I feel them crawling under my skin',
        customer: 'Wal-Mart',
        type: 'General',
        task: '#22953',
        bugFound: true,
        startTime: 188359,
        minutes: 42,
        date: '2019-12-07'
      },
      {
        title: 'Help someone do something',
        customer: 'Mc Donalds',
        type: 'Advisory',
        minutes: 93,
        date: '2019-12-07'
      }
    ];
  }

  logout() {
    this.store.dispatch(logout());
  }
}
