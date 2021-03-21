import { Component, OnInit } from '@angular/core';
import { Customer } from '@app/models';
import { selectAllCustomersSorted, State } from '@app/store';
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
  customers$: Observable<Array<Customer>>;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.customers$ = this.store.pipe(select(selectAllCustomersSorted));
  }

  async add() {
    const modal = await this.modalController.create({
      component: CustomerEditorComponent,
      backdropDismiss: false,
    });
    modal.present();
  }
}
