import { createAction, props } from '@ngrx/store';
import { SetIsUserLoggedIn, SetTokens } from "./action-types";

export const setIsUserLoggedInAction = createAction(SetIsUserLoggedIn, props<{ isUserLoggedIn: boolean }>());
export const setTokensAction = createAction(SetTokens, props<{ accessToken: string; refreshToken: string }>());
