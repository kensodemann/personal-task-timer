import { Injectable } from '@angular/core';
import { AuthenticationService } from '@app/services';
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
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      exhaustMap(action =>
        from(
          this.authenticationService.login(action.email, action.password),
        ).pipe(
          map(() => loginSuccess()),
          catchError(error => of(loginFailure({ error }))),
        ),
      ),
    ),
  );

  loginChanged$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginChanged),
        tap(user => {
          const route = ['/'];
          if (!(user && user.userId)) {
            route.push('login');
          }
          this.navController.navigateRoot(route);
        }),
      ),
    {
      dispatch: false,
    },
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logout),
      exhaustMap(() =>
        from(this.authenticationService.logout()).pipe(
          map(() => logoutSuccess()),
          catchError(error => of(logoutFailure({ error }))),
        ),
      ),
    ),
  );

  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetPassword),
      exhaustMap(action =>
        from(
          this.authenticationService.sendPasswordResetEmail(action.email),
        ).pipe(
          map(() => resetPasswordSuccess({ email: action.email })),
          catchError(error => of(resetPasswordFailure({ error }))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private authenticationService: AuthenticationService,
    private navController: NavController,
  ) {}
}
