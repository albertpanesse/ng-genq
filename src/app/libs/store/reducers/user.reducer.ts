import { createReducer } from '@ngrx/store';
import { IUserState } from '../';

const initialUserState: IUserState = {
  fullName: '',
  email: '',
};

export const userReducer = createReducer(
  initialUserState,
);
