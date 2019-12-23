import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { Timer } from '@app/models/timer';
import { Store } from '@ngrx/store';
import { State } from '@app/store/reducers';
import { remove } from '@app/store/actions/timer.actions';

@Component({
  selector: 'app-timer-list-item',
  templateUrl: './timer-list-item.component.html',
  styleUrls: ['./timer-list-item.component.scss']
})
export class TimerListItemComponent {
  @Input() timer: Timer;
  @Input() disableToggle: boolean;

  constructor(private alertController: AlertController, private store: Store<State>) {}

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

  async edit(): Promise<void> {}

  async toggle(): Promise<void> {}
}
