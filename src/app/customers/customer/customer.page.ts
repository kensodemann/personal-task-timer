import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Customer, TaskType, taskTypes } from '@app/models';
import { selectCustomer, State } from '@app/store';
import { TimerEditorComponent } from '@app/timers/timer-editor/timer-editor.component';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomerEditorComponent } from '../customer-editor/customer-editor.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  customerId: string;
  customer$: Observable<Customer>;
  taskTypes: Array<TaskType>;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.customerId = this.route.snapshot.paramMap.get('id');
    this.customer$ = this.store.pipe(
      select(selectCustomer, { customerId: this.customerId }),
    );
    this.taskTypes = [...taskTypes];
  }

  async edit(customer: Customer) {
    const modal = await this.modalController.create({
      component: CustomerEditorComponent,
      componentProps: { customer },
      backdropDismiss: false,
    });
    modal.present();
  }

  async addTimer(customer: Customer) {
    const modal = await this.modalController.create({
      component: TimerEditorComponent,
      componentProps: { customerId: customer.id },
      backdropDismiss: false,
    });
    modal.present();
  }
}
