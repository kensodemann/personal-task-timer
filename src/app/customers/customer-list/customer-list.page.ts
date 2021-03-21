import { Component, OnInit } from '@angular/core';
import { Customer } from '@app/models';
import {
  selectActiveCustomersSorted,
  selectAllCustomersSorted,
  State,
} from '@app/store';
import { ModalController } from '@ionic/angular';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CustomerEditorComponent } from '../customer-editor/customer-editor.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.page.html',
  styleUrls: ['./customer-list.page.scss'],
})
export class CustomerListPage implements OnInit {
  display: 'active' | 'all' = 'active';
  allCustomers$: Observable<Array<Customer>>;
  activeCustomers$: Observable<Array<Customer>>;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.allCustomers$ = this.store.pipe(select(selectAllCustomersSorted));
    this.activeCustomers$ = this.store.pipe(
      select(selectActiveCustomersSorted),
    );
  }

  async add() {
    const modal = await this.modalController.create({
      component: CustomerEditorComponent,
      backdropDismiss: false,
    });
    modal.present();
  }
}
