import * as AuthActions from '@app/store/actions';
import { Action, createReducer, on } from '@ngrx/store';

export interface AuthState {
  email: string;
  userId: string;
  loading: boolean;
  message?: string;
  error?: Error;
}

export const initialState: AuthState = {
  email: '',
  userId: '',
  loading: false,
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginChanged, (state, { email, userId }) => ({
    ...state,
    email,
    userId,
  })),
  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    message: undefined,
    error: undefined,
  })),
  on(AuthActions.loginSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.logout, state => ({
    ...state,
    loading: true,
    message: undefined,
    error: undefined,
  })),
  on(AuthActions.logoutSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(AuthActions.resetPassword, state => ({
    ...state,
    message: undefined,
    error: undefined,
  })),
  on(AuthActions.resetPasswordSuccess, (state, { email }) => ({
    ...state,
    message: `An e-mail has been sent to ${email} with password reset instructions.`,
  })),
  on(AuthActions.resetPasswordFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);

export const reducer = (state: AuthState | undefined, action: Action) =>
  authReducer(state, action);
