import { Component, OnInit } from '@angular/core';
import { Timer } from '@app/models/timer';
import { selectPeriodTimersSorted, selectTodayTimers, State } from '@app/store';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TimerEditorComponent } from '../timer-editor/timer-editor.component';

@Component({
  selector: 'app-timer-list',
  templateUrl: 'timer-list.page.html',
  styleUrls: ['timer-list.page.scss'],
})
export class TimerListPage implements OnInit {
  display: 'today' | 'history';

  todayTimers$: Observable<Array<Timer>>;
  historyTimers$: Observable<Array<Timer>>;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.display = 'today';
    this.todayTimers$ = this.store.pipe(select(selectTodayTimers));
    this.historyTimers$ = this.store.pipe(
      select(selectPeriodTimersSorted, { days: 30 }),
    );
  }

  async add() {
    const modal = await this.modalController.create({
      component: TimerEditorComponent,
      backdropDismiss: false,
    });
    modal.present();
  }
}
