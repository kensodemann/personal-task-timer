import { Component, Input, OnInit } from '@angular/core';
import { Customer, TaskType, taskTypes, Timer } from '@app/models';
import { selectActiveCustomersSorted, selectCustomer, State } from '@app/store';
import { addTimer, updateTimer } from '@app/store/actions';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { formatISO } from 'date-fns';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-timer-editor',
  templateUrl: './timer-editor.component.html',
  styleUrls: ['./timer-editor.component.scss'],
})
export class TimerEditorComponent implements OnInit {
  @Input() customerId: string;
  @Input() timer: Timer;
  @Input() title: string;
  @Input() taskType: string;

  customers$: Observable<Array<Customer>>;
  taskTypes: Array<TaskType>;
  editorTitle: string;
  disableMinutes: boolean;

  taskId: string;
  minutes: number;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    if (this.timer) {
      this.initializeUpdate();
    } else {
      this.initializeCreate();
    }
    this.customers$ = this.store.pipe(select(selectActiveCustomersSorted));
    this.taskTypes = [...taskTypes];
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    this.createTimer().subscribe(timer => {
      if (this.timer) {
        this.store.dispatch(updateTimer({ timer }));
      } else {
        this.store.dispatch(addTimer({ timer }));
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
          date: this.timer
            ? this.timer.date
            : formatISO(new Date(Date.now()), { representation: 'date' }),
          startTime: (this.timer && this.timer.startTime) || null,
          task: this.taskId || null,
        };
        if (this.timer && this.timer.id) {
          timer.id = this.timer.id;
        }

        return timer;
      }),
    );
  }
}
