import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';

import { State } from './store/reducers';
import { loginChanged } from './store/actions/auth.actions';
import { load as loadTaskTypes } from './store/actions/task-type.actions';
import { load as loadTimers } from './store/actions/timer.actions';
import { ApplicationService } from '@app/services';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private application: ApplicationService,
    private navController: NavController,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.application.registerForUpdates();
    this.store.dispatch(loadTaskTypes());
    this.afAuth.authState.subscribe(u => {
      this.store.dispatch(loginChanged({ email: u && u.email }));
      if (!u) {
        this.navController.navigateRoot(['login']);
      } else {
        this.store.dispatch(loadTimers());
      }
    });
  }
}
