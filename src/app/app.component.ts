import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { State } from './reducers';
import { loginChanged } from './actions/auth.actions';

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
      }
    });
  }
}
