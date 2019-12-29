import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { formatISO } from 'date-fns';

import { State } from '@app/store/reducers';
import { create, update } from '@app/store/actions/timer.actions';
import { selectAllTaskTypes } from '@app/store/selectors';
import { CustomerPickerComponent } from '../customer-picker/customer-picker.component';
import { Timer } from '@app/models';

@Component({
  selector: 'app-timer-editor',
  templateUrl: './timer-editor.component.html',
  styleUrls: ['./timer-editor.component.scss']
})
export class TimerEditorComponent implements OnInit {
  @Input() timer: Timer;

  taskTypes$: Observable<Array<string>>;
  editorTitle: string;
  disableMinutes: boolean;

  customer: string;
  title: string;
  taskId: string;
  taskType: string;
  minutes: number;

  constructor(private modalController: ModalController, private store: Store<State>) {}

  ngOnInit() {
    if (this.timer) {
      this.initializeUpdate();
    } else {
      this.initializeCreate();
    }
    this.taskTypes$ = this.store.pipe(select(selectAllTaskTypes));
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    const timer = this.createTimer();
    if (this.timer) {
      this.store.dispatch(update({ timer }));
    } else {
      this.store.dispatch(create({ timer }));
    }
    this.modalController.dismiss();
  }

  async findCustomer() {
    const modal = await this.modalController.create({ component: CustomerPickerComponent, backdropDismiss: false });
    await modal.present();
    const result = await modal.onDidDismiss();
    if (result.role === 'select') {
      this.customer = result.data;
    }
  }

  private initializeCreate() {
    this.editorTitle = 'Create Timer';
    this.minutes = 0;
    this.disableMinutes = false;
  }

  private initializeUpdate() {
    this.editorTitle = 'Update Timer';
    this.customer = this.timer.customer;
    this.title = this.timer.title;
    this.taskId = this.timer.task;
    this.taskType = this.timer.type;
    this.minutes = this.timer.minutes;
    this.disableMinutes = !!this.timer.startTime;
  }

  private createTimer(): Timer {
    const timer: Timer = {
      customer: this.customer,
      title: this.title,
      task: this.taskId,
      type: this.taskType,
      minutes: this.minutes,
      date: this.timer ? this.timer.date : formatISO(new Date(Date.now()), { representation: 'date' })
    };
    if (this.timer && this.timer.startTime) {
      timer.startTime = this.timer.startTime;
    }
    if (this.timer && this.timer.id) {
      timer.id = this.timer.id;
    }

    return timer;
  }
}
