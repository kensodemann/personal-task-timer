import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { AuthEffects } from './auth.effects';
import { AuthenticationService } from '@app/services';
import { createAuthenticationServiceMock } from '@app/services/mocks';
import { login, logout, AuthActionTypes } from '@app/actions/auth.actions';

describe('AppEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        { provide: AuthenticationService, useFactory: createAuthenticationServiceMock },
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get<AuthEffects>(AuthEffects);
  });

  it('exists', () => {
    expect(effects).toBeTruthy();
  });

  describe('login$', () => {
    it('calls the login', () => {
      const authenticationService = TestBed.get(AuthenticationService);
      actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
      effects.login$.subscribe(() => {});
      expect(authenticationService.login).toHaveBeenCalledTimes(1);
    });

    it('passes the email and password', () => {
      const authenticationService = TestBed.get(AuthenticationService);
      actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
      effects.login$.subscribe(() => {});
      expect(authenticationService.login).toHaveBeenCalledWith('test@testty.com', 'mysecret');
    });

    it('dispatches login success', done => {
      actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
      effects.login$.subscribe(action => {
        expect(action).toEqual({ type: AuthActionTypes.LoginSuccess });
        done();
      });
    });

    it('dispatches login errors', done => {
      const authenticationService = TestBed.get(AuthenticationService);
      authenticationService.login.mockRejectedValue(new Error('The login failed'));
      actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
      effects.login$.subscribe(action => {
        expect(action).toEqual({ type: AuthActionTypes.LoginFailure, error: new Error('The login failed') });
        done();
      });
    });

    it('does nothing for other actions', () => {
      const authenticationService = TestBed.get(AuthenticationService);
      actions$ = of(logout());
      effects.login$.subscribe(() => {});
      expect(authenticationService.login).not.toHaveBeenCalled();
    });
  });

  describe('logout$', () => {
    it('calls the logout', () => {
      const authenticationService = TestBed.get(AuthenticationService);
      actions$ = of(logout());
      effects.logout$.subscribe(() => {});
      expect(authenticationService.logout).toHaveBeenCalledTimes(1);
    });

    it('dispatches logout success', done => {
      actions$ = of(logout());
      effects.logout$.subscribe(action => {
        expect(action).toEqual({ type: AuthActionTypes.LogoutSuccess });
        done();
      });
    });

    it('dispatches login errors', done => {
      const authenticationService = TestBed.get(AuthenticationService);
      authenticationService.logout.mockRejectedValue(new Error('The logout failed'));
      actions$ = of(logout());
      effects.logout$.subscribe(action => {
        expect(action).toEqual({ type: AuthActionTypes.LogoutFailure, error: new Error('The logout failed') });
        done();
      });
    });

    it('does nothing for other actions', () => {
      const authenticationService = TestBed.get(AuthenticationService);
      actions$ = of(login({ email: 'test@testty.com', password: 'mysecret' }));
      effects.logout$.subscribe(() => {});
      expect(authenticationService.logout).not.toHaveBeenCalled();
    });
  });
});
