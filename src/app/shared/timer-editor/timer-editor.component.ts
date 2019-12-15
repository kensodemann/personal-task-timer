import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { formatISO } from 'date-fns';

import { State } from '@app/store/reducers';
import { create } from '@app/store/actions/timer.actions';
import { selectAllTaskTypes } from '@app/store/selectors';

@Component({
  selector: 'app-timer-editor',
  templateUrl: './timer-editor.component.html',
  styleUrls: ['./timer-editor.component.scss']
})
export class TimerEditorComponent implements OnInit {
  taskTypes$: Observable<Array<string>>;

  customer: string;
  title: string;
  taskId: string;
  taskType: string;
  minutes: number;

  constructor(private modalController: ModalController, private store: Store<State>) {}

  ngOnInit() {
    this.minutes = 0;
    this.taskTypes$ = this.store.pipe(select(selectAllTaskTypes));
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
