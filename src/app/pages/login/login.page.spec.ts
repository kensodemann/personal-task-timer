import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, LoadingController, NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AuthenticationService } from '@app/services';
import { createAuthenticationServiceMock } from '@app/services/mocks';
import { createNavControllerMock, createOverlayControllerMock, createOverlayElementMock } from '@test/mocks';
import { LoginPage } from './login.page';
import { login } from '@app/store/actions/auth.actions';
import { AuthState } from '@app/store/reducers/auth/auth.reducer';
import { selectAuthLoading, selectAuthEmail, selectAuthError } from '@app/store/selectors';
import { State } from '@app/store/reducers';

describe('LoginPage', () => {
  let alert;
  let loading;
  let page: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    alert = createOverlayElementMock();
    loading = createOverlayElementMock();
    TestBed.configureTestingModule({
      imports: [FormsModule, IonicModule],
      declarations: [LoginPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AlertController,
          useFactory: () => createOverlayControllerMock(alert)
        },
        {
          provide: AuthenticationService,
          useFactory: createAuthenticationServiceMock
        },
        {
          provide: LoadingController,
          useFactory: () => createOverlayControllerMock(loading)
        },
        { provide: NavController, useFactory: createNavControllerMock },
        provideMockStore<{ auth: AuthState }>({ initialState: { auth: { email: '', loading: false } } })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(page).toBeTruthy();
  });

  describe('login', () => {
    beforeEach(() => {
      page.email = 'test@mctesty.com';
      page.password = 'something secret';
    });

    it('dispatches the login action', () => {
      const store = TestBed.get(Store);
      store.dispatch = jest.fn();
      page.login();
      expect(store.dispatch).toHaveBeenCalledTimes(1);
      expect(store.dispatch).toHaveBeenCalledWith(login({ email: 'test@mctesty.com', password: 'something secret' }));
    });
  });

  describe('on loading changed', () => {
    let store: MockStore<State>;
    let mockAuthLoadingSelector;
    beforeEach(() => {
      store = TestBed.get(Store);
      mockAuthLoadingSelector = store.overrideSelector(selectAuthLoading, false);
      fixture.detectChanges();
      loading.dismiss.mockClear();
    });

    it('presents and dismisses the loading indicator', () => {
      mockAuthLoadingSelector.setResult(true);
      store.refreshState();
      fixture.detectChanges();
      expect(loading.present).toHaveBeenCalledTimes(1);
      expect(loading.dismiss).not.toHaveBeenCalled();
      loading.present.mockClear();
      mockAuthLoadingSelector.setResult(false);
      store.refreshState();
      fixture.detectChanges();
      expect(loading.present).not.toHaveBeenCalled();
      expect(loading.dismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('on email changed', () => {
    let store: MockStore<State>;
    let mockAuthEmailSelector;
    beforeEach(() => {
      store = TestBed.get(Store);
      mockAuthEmailSelector = store.overrideSelector(selectAuthEmail, undefined);
      fixture.detectChanges();
    });

    it('navigates to the app when the email is set', () => {
      const navController = TestBed.get(NavController);
      mockAuthEmailSelector.setResult(null);
      store.refreshState();
      fixture.detectChanges();
      expect(navController.navigateRoot).not.toHaveBeenCalled();
      mockAuthEmailSelector.setResult('test@mctesterson.org');
      store.refreshState();
      fixture.detectChanges();
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith('');
    });
  });

  describe('on error changed', () => {
    let store: MockStore<State>;
    let mockAuthErrorSelector;
    beforeEach(() => {
      store = TestBed.get(Store);
      mockAuthErrorSelector = store.overrideSelector(selectAuthError, undefined);
      fixture.detectChanges();
    });

    it('presents and dismisses the loading indicator', () => {
      mockAuthErrorSelector.setResult(new Error('This is an error logging in'));
      store.refreshState();
      fixture.detectChanges();
      expect(page.errorMessage).toEqual('This is an error logging in');
      mockAuthErrorSelector.setResult(undefined);
      store.refreshState();
      fixture.detectChanges();
      expect(page.errorMessage).toEqual(undefined);
    });
  });

  describe('password reset', () => {
    it('creates an alert', () => {
      const alertController = TestBed.get(AlertController);
      page.handlePasswordReset();
      expect(alertController.create).toHaveBeenCalledTimes(1);
    });

    describe('the alert', () => {
      let params;
      beforeEach(async () => {
        const alertController = TestBed.get(AlertController);
        await page.handlePasswordReset();
        params = alertController.create.mock.calls[0][0];
      });

      it('asks for the user e-mail', () => {
        expect(params.header).toEqual('Password Reset');
        expect(params.subHeader).toEqual('Enter your e-mail address');
      });

      it('describes the process', () => {
        expect(params.message).toContain('link that will allow you to reset your password');
      });

      it('has an input for the e-mail address', () => {
        expect(params.inputs.length).toEqual(1);
        expect(params.inputs[0]).toEqual({
          name: 'emailAddress',
          type: 'email',
          placeholder: 'your.email@address.com'
        });
      });

      it('provides "Cancel" and "Send" buttons', () => {
        expect(params.buttons[0]).toEqual({ text: 'Cancel', role: 'cancel' });
        expect(params.buttons[1]).toEqual({
          text: 'Send e-mail',
          role: 'send'
        });
      });

      it('is presented', () => {
        expect(alert.present).toHaveBeenCalledTimes(1);
      });
    });

    describe('on alert dismiss', () => {
      it('sends the reset e-mail if entered and send is pressed', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'send'
        });
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
        expect(authentication.sendPasswordResetEmail).toHaveBeenCalledWith('test@testy.com');
      });

      it('displays an info message', async () => {
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'send'
        });
        await page.handlePasswordReset();
        expect(page.infoMessage).toEqual('An e-mail has been sent to test@testy.com with password reset instructions.');
        expect(page.errorMessage).toBeFalsy();
      });

      it('displays an error message if the send fails', async () => {
        const authentication = TestBed.get(AuthenticationService);
        authentication.sendPasswordResetEmail.mockRejectedValue({ message: 'welp, this sucks' });
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'send'
        });
        await page.handlePasswordReset();
        expect(page.infoMessage).toBeFalsy();
        expect(page.errorMessage).toEqual('welp, this sucks');
      });

      it('does not send the reset e-mail if no email address is entered', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.mockResolvedValue({
          data: { values: {} },
          role: 'send'
        });
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).not.toHaveBeenCalled();
      });

      it('does not send the reset e-mail if cancel is pressed', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'cancel'
        });
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).not.toHaveBeenCalled();
      });

      it('does not send the reset e-mail if background is pressed', async () => {
        const authentication = TestBed.get(AuthenticationService);
        alert.onDidDismiss.mockResolvedValue({
          data: { values: { emailAddress: 'test@testy.com' } },
          role: 'background'
        });
        await page.handlePasswordReset();
        expect(authentication.sendPasswordResetEmail).not.toHaveBeenCalled();
      });
    });
  });
});
