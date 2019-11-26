import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AuthenticationService } from '@app/services';
import { State } from '@app/reducers';
import { selectAuthEmail, selectAuthError, selectAuthLoading } from '@app/selectors';
import { login } from '@app/actions/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private loading: HTMLIonLoadingElement;

  email: string;
  password: string;
  errorMessage: string;
  infoMessage: string;

  constructor(
    private alert: AlertController,
    private loadingController: LoadingController,
    private auth: AuthenticationService,
    private navController: NavController,
    private store: Store<State>
  ) {}

  async ngOnInit() {
    this.loading = await this.loadingController.create({ message: 'Verifying...' });
    this.store.pipe(select(selectAuthLoading), takeUntil(this.destroy$)).subscribe(l => {
      this.showLoading(l);
    });
    this.store.pipe(select(selectAuthError), takeUntil(this.destroy$)).subscribe(e => {
      this.setErrorMessage(e);
    });
    this.store.pipe(select(selectAuthEmail), takeUntil(this.destroy$)).subscribe(e => {
      this.goToApp(!!e);
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private showLoading(show: boolean) {
    if (show) {
      this.loading.present();
    } else {
      this.loading.dismiss();
    }
  }

  private setErrorMessage(error: Error) {
    this.errorMessage = error && error.message;
  }

  private goToApp(doNav: boolean) {
    if (doNav) {
      this.navController.navigateRoot('');
    }
  }

  clearMessages() {
    this.errorMessage = '';
    this.infoMessage = '';
  }

  login() {
    this.store.dispatch(login({ email: this.email, password: this.password }));
    this.password = '';
  }

  async handlePasswordReset() {
    this.clearMessages();
    const a = await this.alert.create({
      header: 'Password Reset',
      subHeader: 'Enter your e-mail address',
      message:
        'An e-mail will be sent to the specified e-mail address with a link that will allow you to reset your password.',
      inputs: [
        {
          name: 'emailAddress',
          type: 'email',
          placeholder: 'your.email@address.com'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send e-mail',
          role: 'send'
        }
      ]
    });
    await a.present();
    const response = await a.onDidDismiss();
    await this.sendPasswordResetEmail(response);
  }

  private async sendPasswordResetEmail(response: any) {
    if (response && response.data.values.emailAddress && response.role === 'send') {
      try {
        await this.auth.sendPasswordResetEmail(response.data.values.emailAddress);
        this.infoMessage = `An e-mail has been sent to ${response.data.values.emailAddress} with password reset instructions.`;
      } catch (err) {
        this.errorMessage = err.message;
      }
    }
  }
}
