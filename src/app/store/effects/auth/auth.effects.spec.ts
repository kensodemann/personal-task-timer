import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '@app/services';
import { createAuthenticationServiceMock } from '@app/services/mocks';
import {
  login,
  loginChanged,
  loginFailure,
  loginSuccess,
  logout,
  logoutFailure,
  logoutSuccess,
  resetPassword,
  resetPasswordFailure,
  resetPasswordSuccess,
} from '@app/store/actions';
import { NavController } from '@ionic/angular';
import { provideMockActions } from '@ngrx/effects/testing';
import { createNavControllerMock } from '@test/mocks';
import { Observable, of } from 'rxjs';
import { AuthEffects } from './auth.effects';

let actions$: Observable<any>;
let effects: AuthEffects;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      AuthEffects,
      {
        provide: AuthenticationService,
        useFactory: createAuthenticationServiceMock,
      },
      {
        provide: NavController,
        useFactory: createNavControllerMock,
      },
      provideMockActions(() => actions$),
    ],
  });

  effects = TestBed.inject<AuthEffects>(AuthEffects);
});

it('exists', () => {
  expect(effects).toBeTruthy();
});

describe('login$', () => {
  it('calls the login', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(() => {});
    expect(authenticationService.login).toHaveBeenCalledTimes(1);
  });

  it('passes the email and password', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(() => {});
    expect(authenticationService.login).toHaveBeenCalledWith(
      'test@testty.com',
      'mysecret',
    );
  });

  it('dispatches login success', done => {
    const dispatched = loginSuccess();
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches login errors', done => {
    const authenticationService = TestBed.inject(AuthenticationService);
    const dispatched = loginFailure({
      error: new Error('The login failed'),
    });
    (authenticationService.login as any).mockRejectedValue(
      new Error('The login failed'),
    );
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.login$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(logout());
    effects.login$.subscribe(() => {});
    expect(authenticationService.login).not.toHaveBeenCalled();
  });
});

describe('loginChanged$', () => {
  it('navigates to root with a user', done => {
    const navController = TestBed.inject(NavController);
    actions$ = of(
      loginChanged({ email: 'test@testty.com', userId: '29940593034' }),
    );
    effects.loginChanged$.subscribe(() => {
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith(['/']);
      done();
    });
  });

  it('navigates to login without a user', done => {
    const navController = TestBed.inject(NavController);
    actions$ = of(loginChanged({ email: undefined, userId: undefined }));
    effects.loginChanged$.subscribe(() => {
      expect(navController.navigateRoot).toHaveBeenCalledTimes(1);
      expect(navController.navigateRoot).toHaveBeenCalledWith(['/', 'login']);
      done();
    });
  });
});

describe('logout$', () => {
  it('calls the logout', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(logout());
    effects.logout$.subscribe(() => {});
    expect(authenticationService.logout).toHaveBeenCalledTimes(1);
  });

  it('dispatches logout success', done => {
    const dispatched = logoutSuccess();
    actions$ = of(logout());
    effects.logout$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('dispatches login errors', done => {
    const authenticationService = TestBed.inject(AuthenticationService);
    const dispatched = logoutFailure({ error: new Error('The logout failed') });
    (authenticationService.logout as any).mockRejectedValue(
      new Error('The logout failed'),
    );
    actions$ = of(logout());
    effects.logout$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
    effects.logout$.subscribe(() => {});
    expect(authenticationService.logout).not.toHaveBeenCalled();
  });
});

describe('resetPassword$', () => {
  it('calls resetPassword', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(() => {});
    expect(authenticationService.sendPasswordResetEmail).toHaveBeenCalledTimes(
      1,
    );
  });

  it('passes the email', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(() => {});
    expect(authenticationService.sendPasswordResetEmail).toHaveBeenCalledWith(
      'test@testty.com',
    );
  });

  it('dispatches reset password success', done => {
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(action => {
      expect(action).toEqual(
        resetPasswordSuccess({ email: 'test@testty.com' }),
      );
      done();
    });
  });

  it('dispatches errors', done => {
    const authenticationService = TestBed.inject(AuthenticationService);
    const dispatched = resetPasswordFailure({
      error: new Error('The reset failed'),
    });
    (authenticationService.sendPasswordResetEmail as any).mockRejectedValue(
      new Error('The reset failed'),
    );
    actions$ = of(resetPassword({ email: 'test@testty.com' }));
    effects.resetPassword$.subscribe(action => {
      expect(action).toEqual(dispatched);
      done();
    });
  });

  it('does nothing for other actions', () => {
    const authenticationService = TestBed.inject(AuthenticationService);
    actions$ = of(logout());
    effects.resetPassword$.subscribe(() => {});
    expect(authenticationService.sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});
