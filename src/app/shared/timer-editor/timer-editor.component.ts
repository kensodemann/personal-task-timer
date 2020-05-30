import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { formatISO } from 'date-fns';

import { create, update } from '@app/store/actions/timer.actions';
import { selectAllTaskTypes, State, selectAllCustomersSorted, selectCustomer } from '@app/store';
import { Customer, Timer } from '@app/models';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-timer-editor',
  templateUrl: './timer-editor.component.html',
  styleUrls: ['./timer-editor.component.scss']
})
export class TimerEditorComponent implements OnInit {
  @Input() timer: Timer;

  customers$: Observable<Array<Customer>>;
  taskTypes$: Observable<Array<string>>;
  editorTitle: string;
  disableMinutes: boolean;

  customerId: string;
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
    this.customers$ = this.store.pipe(select(selectAllCustomersSorted));
    this.taskTypes$ = this.store.pipe(select(selectAllTaskTypes));
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    this.createTimer().subscribe(timer => {
      if (this.timer) {
        this.store.dispatch(update({ timer }));
      } else {
        this.store.dispatch(create({ timer }));
      }
      this.modalController.dismiss();
    });
  }

  private initializeCreate() {
    this.editorTitle = 'Create Timer';
    this.minutes = 0;
    this.disableMinutes = false;
  }

  private initializeUpdate() {
    this.editorTitle = 'Update Timer';
    this.customerId = this.timer.customerId;
    this.title = this.timer.title;
    this.taskId = this.timer.task;
    this.taskType = this.timer.type;
    this.minutes = this.timer.minutes;
    this.disableMinutes = !!this.timer.startTime;
  }

  private createTimer(): Observable<Timer> {
    return this.store.pipe(
      select(selectCustomer, { customerId: this.customerId }),
      take(1),
      map(customer => {
        const timer: Timer = {
          customerName: customer.name,
          customerId: customer.id,
          title: this.title,
          type: this.taskType,
          minutes: this.minutes,
          date: this.timer ? this.timer.date : formatISO(new Date(Date.now()), { representation: 'date' }),
          startTime: (this.timer && this.timer.startTime) || null,
          task: this.taskId || null
        };
        if (this.timer && this.timer.id) {
          timer.id = this.timer.id;
        }

        return timer;
      })
    );
  }
}
