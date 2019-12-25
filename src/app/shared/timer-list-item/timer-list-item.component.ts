import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';

import { Timer } from '@app/models/timer';
import { Store, select } from '@ngrx/store';
import { State } from '@app/store/reducers';
import { remove, stop, start } from '@app/store/actions/timer.actions';
import { selectAllActiveTimers } from '@app/store/selectors';
import { take } from 'rxjs/operators';
import { TimerEditorComponent } from '../timer-editor/timer-editor.component';

@Component({
  selector: 'app-timer-list-item',
  templateUrl: './timer-list-item.component.html',
  styleUrls: ['./timer-list-item.component.scss']
})
export class TimerListItemComponent {
  @Input() timer: Timer;
  @Input() disableToggle: boolean;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private store: Store<State>
  ) {}

  async delete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remove Timer?',
      subHeader: this.timer.title,
      message: 'This action cannot be undone. Are you sure you want to continue?',
      buttons: [
        { text: 'Yes', role: 'confirm' },
        { text: 'No', role: 'cancel' }
      ]
    });
    await alert.present();
    const resp = await alert.onDidDismiss();
    if (resp.role === 'confirm') {
      this.store.dispatch(remove({ timer: this.timer }));
    }
  }

  async edit(): Promise<void> {
    const modal = await this.modalController.create({
      component: TimerEditorComponent,
      componentProps: { timer: this.timer }
    });
    modal.present();
  }

  async toggle(): Promise<void> {
    if (!this.disableToggle) {
      if (this.timer.startTime) {
        this.store.dispatch(stop({ timer: this.timer }));
      } else {
        this.stopAllActiveTimers();
        this.store.dispatch(start({ timer: this.timer }));
      }
    }
  }

  private stopAllActiveTimers() {
    const activeTimers = this.store
      .pipe(select(selectAllActiveTimers), take(1))
      .subscribe(timers => timers.forEach(timer => this.store.dispatch(stop({ timer }))));
  }
}
