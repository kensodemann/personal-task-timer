import { Component, Input, OnInit } from '@angular/core';
import { Customer } from '@app/models';
import { State } from '@app/store';
import { addCustomer, updateCustomer } from '@app/store/actions';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss'],
})
export class CustomerEditorComponent implements OnInit {
  @Input() customer: Customer;

  editorTitle: string;

  name: string;
  hasAdvisory: boolean;
  primaryAdvisor: string;
  supportHours: number;

  constructor(
    private modalController: ModalController,
    private store: Store<State>,
  ) {}

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
      this.store.dispatch(updateCustomer({ customer }));
    } else {
      this.store.dispatch(addCustomer({ customer }));
    }
    this.modalController.dismiss();
  }

  private createCustomer(): Customer {
    const customer: Customer = {
      name: this.name,
      hasAdvisory: this.hasAdvisory || false,
      primaryAdvisor: this.hasAdvisory ? this.primaryAdvisor : null,
      supportHours: this.supportHours,
    };
    if (this.customer && this.customer.id) {
      customer.id = this.customer.id;
    }

    return customer;
  }

  private initializeCreate() {
    this.editorTitle = 'Create Customer';
    this.name = '';
    this.hasAdvisory = true;
    this.primaryAdvisor = '';
    this.supportHours = 0;
  }

  private initializeUpdate() {
    this.editorTitle = 'Update Customer';
    this.name = this.customer.name;
    this.hasAdvisory = this.customer.hasAdvisory;
    this.primaryAdvisor = this.customer.primaryAdvisor;
    this.supportHours = this.customer.supportHours;
  }
}
