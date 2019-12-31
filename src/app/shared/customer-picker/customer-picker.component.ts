import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { selectAllCustomers, State } from '@app/store';

@Component({
  selector: 'app-customer-picker',
  templateUrl: './customer-picker.component.html',
  styleUrls: ['./customer-picker.component.scss']
})
export class CustomerPickerComponent implements OnInit {
  private searchTextChanged: BehaviorSubject<void>;
  searchText: string;

  customers$: Observable<Array<string>>;

  constructor(private modalController: ModalController, private store: Store<State>) {
    this.searchTextChanged = new BehaviorSubject(undefined);
  }

  ngOnInit() {
    this.customers$ = this.searchTextChanged.pipe(
      flatMap(() =>
        this.store.pipe(
          select(selectAllCustomers),
          map(customers =>
            customers.filter(
              c => !this.searchText || c.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())
            )
          )
        )
      )
    );
  }

  dismiss() {
    this.modalController.dismiss(undefined, 'cancel');
  }

  select(customer: string) {
    this.modalController.dismiss(customer, 'select');
  }

  onSearchbarChange(value: string) {
    this.searchText = value;
    this.searchTextChanged.next();
  }
}
