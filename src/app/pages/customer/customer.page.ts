import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { State, selectAllTaskTypes, selectCustomer } from '@app/store';
import { Customer } from '@app/models';
import { CustomerEditorComponent } from '@app/shared/customer-editor/customer-editor.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  customerId: string;
  customer$: Observable<Customer>;
  taskTypes$: Observable<Array<string>>;

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
    this.taskTypes$ = this.store.pipe(select(selectAllTaskTypes));
  }

  async edit(customer: Customer) {
    const modal = await this.modalController.create({
      component: CustomerEditorComponent,
      componentProps: { customer },
      backdropDismiss: false,
    });
    modal.present();
  }
}
