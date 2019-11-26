import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from '@app/actions/auth.actions';

export interface AuthState {
  email: string;
  loading: boolean;
  error?: Error;
}

export const initialState: AuthState = {
  email: '',
  loading: false
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginChanged, (state, { email }) => ({ ...state, email })),
  on(AuthActions.login, state => ({ ...state, loading: true, error: undefined })),
  on(AuthActions.loginSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(AuthActions.logout, state => ({ ...state, loading: true, error: undefined })),
  on(AuthActions.logoutSuccess, state => ({ ...state, loading: false })),
  on(AuthActions.logoutFailure, (state, { error }) => ({ ...state, loading: false, error }))
);

export function reducer(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}
