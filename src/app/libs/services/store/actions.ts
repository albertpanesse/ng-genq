import { createAction, props } from '@ngrx/store';
import { SetLoggedIn, SetLoggedOut } from "./action-types";

export const SetLoggedInAction = createAction(SetLoggedIn, props<{ accessToken: string; refreshToken: string }>());

export const SetLoggedOutAction = createAction(SetLoggedOut);
