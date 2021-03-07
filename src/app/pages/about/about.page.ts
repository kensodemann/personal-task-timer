import { Component } from '@angular/core';
import { version } from '@app/default-data/version';
import { Version } from '@app/models/version';
import { State } from '@app/store';
import { logout } from '@app/store/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-tab3',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage {
  appVersion: Version = version;
  constructor(private store: Store<State>) {}

  logout() {
    this.store.dispatch(logout());
  }
}
