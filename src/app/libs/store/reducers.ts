import { createReducer, on } from '@ngrx/store';
import { IAppState, IUserState } from '.';
import { ResetUser, SetIsUserLoggedIn } from './actions';

const initialAppState: IAppState = {
  isUserLoggedIn: false,
};

export const appReducer = createReducer(
  initialAppState,
  on(SetIsUserLoggedIn, (state: IAppState, props: any) => {
    return {
      ...state,
      isUserLoggedIn: props.isUserLoggedIn,
    };
  }),
);

const initialUserState: IUserState = {
  uname: '',
  email: '',
  accessToken: '',
  refreshToken: '',
};

export const userReducer = createReducer(
  initialUserState,
  on(ResetUser, (state: IUserState) => {
    return {
      ...state,
      user: {
        uname: '',
        email: '',
        accessToken: '',
        refreshToken: '',      
      }
    };
  }),
);
