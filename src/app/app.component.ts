import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApplicationService } from '@app/services';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { loginChanged, startup } from './store/actions';
import { State } from './store/reducers';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private application: ApplicationService,
    private store: Store<State>,
  ) {}

  ngOnInit() {
    this.application.registerForUpdates();
    this.store.dispatch(startup());
    this.afAuth.authState.subscribe(u => {
      this.store.dispatch(
        loginChanged({ email: u && u.email, userId: u && u.uid }),
      );
    });
  }
}
