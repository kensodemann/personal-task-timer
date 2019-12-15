import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { State } from './store/reducers';
import { loginChanged } from './store/actions/auth.actions';
import { load } from './store/actions/timer.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private afAuth: AngularFireAuth, private navController: NavController, private store: Store<State>) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(u => {
      this.store.dispatch(loginChanged({ email: u && u.email }));
      if (!u) {
        this.navController.navigateRoot(['login']);
      } else {
        this.store.dispatch(load());
      }
    });
  }
}
