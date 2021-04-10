import { Component } from '@angular/core';
import { author, date, tag, version } from '@app/default-data/version.json';
import { State } from '@app/store';
import { logout } from '@app/store/actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-tab3',
  templateUrl: 'about.page.html',
  styleUrls: ['about.page.scss'],
})
export class AboutPage {
  tag = tag;
  author = author;
  version = version;
  date = date;

  constructor(private store: Store<State>) {}

  logout() {
    this.store.dispatch(logout());
  }
}
