import { Component, OnInit } from '@angular/core';
import { Timer } from '@app/models/timer';
import { selectTodayTimers, State } from '@app/store';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TimerEditorComponent } from '../timer-editor/timer-editor.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss'],
})
export class TodayPage implements OnInit {
  timers$: Observable<Array<Timer>>;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.timers$ = this.store.pipe(select(selectTodayTimers));
  }

  async add() {
    const modal = await this.modalController.create({
      component: TimerEditorComponent,
      backdropDismiss: false,
    });
    modal.present();
  }
}
