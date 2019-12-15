import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { formatISO } from 'date-fns';

import { State } from '@app/store/reducers';
import { create } from '@app/store/actions/timer.actions';

@Component({
  selector: 'app-timer-editor',
  templateUrl: './timer-editor.component.html',
  styleUrls: ['./timer-editor.component.scss']
})
export class TimerEditorComponent implements OnInit {
  customer: string;
  title: string;
  taskId: string;
  taskType: string;
  minutes: number;

  constructor(private modalController: ModalController, private store: Store<State>) {}

  ngOnInit() {
    this.minutes = 0;
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    this.store.dispatch(
      create({
        timer: {
          customer: this.customer,
          title: this.title,
          task: this.taskId,
          type: this.taskType,
          date: formatISO(new Date(Date.now()), { representation: 'date' }),
          minutes: this.minutes
        }
      })
    );
    this.modalController.dismiss();
  }
}
