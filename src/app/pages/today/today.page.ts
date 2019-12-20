import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Timer } from '@app/models/timer';
import { logout } from '@app/store/actions/auth.actions';
import { State } from '@app/store/reducers';
import { TimerEditorComponent } from '@app/shared/timer-editor/timer-editor.component';
import { selectTodayTimers } from '@app/store/selectors';

@Component({
  selector: 'app-tab1',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss']
})
export class TodayPage implements OnInit {
  timers$: Observable<Array<Timer>>;

  constructor(private modalController: ModalController, private store: Store<State>) {}

  ngOnInit() {
    this.timers$ = this.store.pipe(select(selectTodayTimers));
  }

  async add() {
    const modal = await this.modalController.create({ component: TimerEditorComponent, backdropDismiss: false });
    modal.present();
  }

  logout() {
    this.store.dispatch(logout());
  }
}
