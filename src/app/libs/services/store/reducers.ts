import { createReducer, on } from '@ngrx/store';
import { IAppState, IUserState } from '.';
import { SetLoggedInAction, SetLoggedOutAction } from './actions';

const initialAppState: IAppState = {
  isUserLoggedIn: false,
  accessToken: '',
  refreshToken: '',
};

export const appReducer = createReducer(
  initialAppState,
  on(SetLoggedInAction, (state: IAppState, props: any) => {
    return {
      ...state,
      isUserLoggedIn: true,
      accessToken: props.accessToken,
      refreshToken: props.refreshToken,
    };
  }),
  on(SetLoggedOutAction, (state: IAppState) => {
    return {
      ...state,
      isUserLoggedIn: false,
      accessToken: '',
      refreshToken: '',
    };
  }),
);

const initialUserState: IUserState = {
  fullName: '',
  email: '',
};

export const userReducer = createReducer(
  initialUserState,
);
