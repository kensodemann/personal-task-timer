import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Timer } from '@app/models/timer';
import { selectAllActiveTimers, State } from '@app/store';
import { remove, start, stop } from '@app/store/actions/timer.actions';
import { AlertController, ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { differenceInMinutes } from 'date-fns';
import { take } from 'rxjs/operators';
import { TimerEditorComponent } from '../timer-editor/timer-editor.component';

@Component({
  selector: 'app-timer-list-item',
  templateUrl: './timer-list-item.component.html',
  styleUrls: ['./timer-list-item.component.scss'],
})
export class TimerListItemComponent implements OnInit, OnDestroy {
  @Input() timer: Timer;
  @Input() disableToggle: boolean;

  runningMinutes: number;

  private intervalID: any;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    if (this.timer.startTime) {
      this.initRecalcInterval();
    }
    this.calculateRunningMinutes();
  }

  ngOnDestroy() {
    this.clearRecalcInterval();
  }

  async delete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Remove Timer?',
      subHeader: this.timer.title,
      message:
        'This action cannot be undone. Are you sure you want to continue?',
      buttons: [
        { text: 'Yes', role: 'confirm' },
        { text: 'No', role: 'cancel' },
      ],
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
      componentProps: { timer: this.timer },
    });
    modal.present();
  }

  async toggle(): Promise<void> {
    if (!this.disableToggle) {
      if (this.timer.startTime) {
        this.store.dispatch(stop({ timer: this.timer }));
        this.clearRecalcInterval();
      } else {
        this.stopAllActiveTimers();
        this.store.dispatch(start({ timer: this.timer }));
        this.initRecalcInterval();
      }
    }
  }

  private initRecalcInterval() {
    this.intervalID = setInterval(() => this.calculateRunningMinutes(), 5000);
  }

  private calculateRunningMinutes() {
    this.runningMinutes = this.timer.startTime
      ? differenceInMinutes(Date.now(), this.timer.startTime)
      : 0;
  }

  private clearRecalcInterval() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      this.intervalID = undefined;
    }
  }

  private stopAllActiveTimers() {
    const activeTimers = this.store
      .pipe(select(selectAllActiveTimers), take(1))
      .subscribe(timers =>
        timers.forEach(timer => this.store.dispatch(stop({ timer }))),
      );
  }
}
