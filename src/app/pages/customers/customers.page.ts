import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { logout } from '@app/store/actions/auth.actions';
import { State, selectAllCustomersSorted } from '@app/store';
import { Customer } from '@app/models';
import { CustomerEditorComponent } from '@app/shared/customer-editor/customer-editor.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.page.html',
  styleUrls: ['./customers.page.scss']
})
export class CustomersPage implements OnInit {
  customers$: Observable<Array<Customer>>;

  constructor(private modalController: ModalController, private store: Store<State>) {}

  ngOnInit() {
    this.customers$ = this.store.pipe(select(selectAllCustomersSorted));
  }

  async add() {
    const modal = await this.modalController.create({ component: CustomerEditorComponent, backdropDismiss: false });
    modal.present();
  }

  logout() {
    this.store.dispatch(logout());
  }
}
