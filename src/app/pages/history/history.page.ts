import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { State } from '@app/store/reducers';
import { logout } from '@app/store/actions/auth.actions';

@Component({
  selector: 'app-tab2',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss']
})
export class HistoryPage {
  constructor(private store: Store<State>) {}

  logout() {
    this.store.dispatch(logout());
  }
}
