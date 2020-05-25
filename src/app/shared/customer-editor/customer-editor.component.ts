import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { Customer } from '@app/models';
import { State } from '@app/store';
import { create, update } from '@app/store/actions/customer.actions';

@Component({
  selector: 'app-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss']
})
export class CustomerEditorComponent implements OnInit {
  @Input() customer: Customer;

  editorTitle: string;

  name: string;

  constructor(private modalController: ModalController, private store: Store<State>) {}

  ngOnInit() {
    if (this.customer) {
      this.initializeUpdate();
    } else {
      this.initializeCreate();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  save() {
    const customer = this.createCustomer();
    if (this.customer) {
      this.store.dispatch(update({ customer }));
    } else {
      this.store.dispatch(create({ customer }));
    }
    this.modalController.dismiss();
  }

  private createCustomer(): Customer {
    const customer: Customer = {
      name: this.name
    };
    if (this.customer && this.customer.id) {
      customer.id = this.customer.id;
    }

    return customer;
  }

  private initializeCreate() {
    this.editorTitle = 'Create Customer';
    this.name = '';
  }

  private initializeUpdate() {
    this.editorTitle = 'Update Customer';
    this.name = this.customer.name;
  }
}
