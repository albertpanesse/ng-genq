import { createAction, props } from '@ngrx/store';
import { SetFileDirList, SetIsUserLoggedIn, SetTokens } from "./action-types";
import { IUserFile } from '../../types';

export const setIsUserLoggedInAction = createAction(SetIsUserLoggedIn, props<{ isUserLoggedIn: boolean }>());
export const setTokensAction = createAction(SetTokens, props<{ accessToken: string; refreshToken: string }>());

export const setFileDirListAction = createAction(SetFileDirList, props<{ fileDirList: IUserFile[] }>());
