import { createAction, props } from '@ngrx/store';
import { SetIsUserLoggedInAction, ResetUserAction } from '../types';
import { IUserState } from '.';

export const SetIsUserLoggedIn = createAction(SetIsUserLoggedInAction, props<{ isUserLoggedIn: boolean }>());

export const ResetUser = createAction(ResetUserAction);
