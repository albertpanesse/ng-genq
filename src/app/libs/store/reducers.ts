import { createReducer, on } from '@ngrx/store';
import { IAppState, IUserState } from '.';

const initialAppState: IAppState = {
  isUserLoggedIn: false,
};

export const appReducer = createReducer(
  initialAppState,
);

const initialUserState: IUserState = {
  uname: '',
  email: '',
  accessToken: '',
  refreshToken: '',
};

export const userReducer = createReducer(
  initialUserState,
);
