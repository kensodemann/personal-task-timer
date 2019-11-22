import { Component } from '@angular/core';
import { Timer } from '@app/models/timer';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  timers: Array<Timer>;

  constructor() {
    this.timers = [
      {
        title: 'Help someone do something',
        customer: 'Ace Hardware',
        type: 'Advisory',
        minutes: 0
      },
      {
        title: 'Uhg, this is so ugly',
        customer: 'Ace Hardware',
        type: 'Code Review',
        task: '#22950',
        minutes: 27
      },
      {
        title: 'I feel them crawling under my skin',
        customer: 'Wal-Mart',
        type: 'General',
        task: '#22953',
        bugFound: true,
        startTime: 188359,
        minutes: 42
      },
      {
        title: 'Help someone do something',
        customer: 'Mc Donalds',
        type: 'Advisory',
        minutes: 93
      }
    ];
  }
}
