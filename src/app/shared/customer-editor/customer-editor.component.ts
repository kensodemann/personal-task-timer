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
  hasAdvisory: boolean;
  primaryAdvisor: string;
  supportHours: number;
  hasStencil: boolean;
  hasCapacitor: boolean;
  hasIdentityVault: boolean;
  hasAuthConnect: boolean;
  hasOfflineStorage: boolean;

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
      name: this.name,
      hasAdvisory: this.hasAdvisory || false,
      primaryAdvisor: this.hasAdvisory ? this.primaryAdvisor : null,
      supportHours: this.supportHours,
      hasStencil: this.hasStencil || false,
      hasCapacitor: this.hasCapacitor || false,
      hasAuthConnect: this.hasAuthConnect || false,
      hasIdentityVault: this.hasIdentityVault || false,
      hasOfflineStorage: this.hasOfflineStorage || false
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
    this.hasStencil = false;
    this.hasCapacitor = false;
    this.hasIdentityVault = false;
    this.hasAuthConnect = false;
    this.hasOfflineStorage = false;
  }

  private initializeUpdate() {
    this.editorTitle = 'Update Customer';
    this.name = this.customer.name;
    this.hasStencil = this.customer.hasStencil;
    this.hasAdvisory = this.customer.hasAdvisory;
    this.primaryAdvisor = this.customer.primaryAdvisor;
    this.supportHours = this.customer.supportHours;
    this.hasCapacitor = this.customer.hasCapacitor;
    this.hasIdentityVault = this.customer.hasIdentityVault;
    this.hasAuthConnect = this.customer.hasAuthConnect;
    this.hasOfflineStorage = this.customer.hasOfflineStorage;
  }
}
