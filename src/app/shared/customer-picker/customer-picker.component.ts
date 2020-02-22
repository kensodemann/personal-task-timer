import { AfterContentInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar, ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { selectAllCustomers, State } from '@app/store';

@Component({
  selector: 'app-customer-picker',
  templateUrl: './customer-picker.component.html',
  styleUrls: ['./customer-picker.component.scss']
})
export class CustomerPickerComponent implements AfterContentInit, OnInit {
  private searchTextChanged: BehaviorSubject<void>;
  @ViewChild(IonSearchbar, { static: true }) searchBar: IonSearchbar;
  searchText: string;

  customers$: Observable<Array<string>>;

  constructor(private modalController: ModalController, private store: Store<State>) {
    this.searchTextChanged = new BehaviorSubject(undefined);
  }

  async ngAfterContentInit() {
    const el = await this.searchBar.getInputElement();
    setTimeout(() => el.focus());
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

  create() {
    this.modalController.dismiss(this.searchText, 'create');
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
