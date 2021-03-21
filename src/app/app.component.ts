import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ApplicationService } from '@app/core';
import { Store } from '@ngrx/store';
import { loginChanged, startup } from './store/actions';
import { State } from './store';

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
    this.afAuth.authState.subscribe(user => {
      this.store.dispatch(
        loginChanged({ email: user && user.email, userId: user && user.uid }),
      );
    });
  }
}
