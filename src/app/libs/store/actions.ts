import { createAction, props } from '@ngrx/store';
import { SetFileContent, SetFileDirList, SetIsUserLoggedIn, SetTokens, SetUserFile } from "./action-types";
import { IFileDirList } from '.';
import { IUserFile } from '../types';

export const setIsUserLoggedInAction = createAction(SetIsUserLoggedIn, props<{ isUserLoggedIn: boolean }>());
export const setTokensAction = createAction(SetTokens, props<{ accessToken: string; refreshToken: string }>());

export const setFileDirListAction = createAction(SetFileDirList, props<{ fileDirList: IFileDirList }>());
export const setUserFileAction = createAction(SetUserFile, props<{ userFile: IUserFile }>());
export const setFileContentAction = createAction(SetFileContent, props<{ fileContent: string }>());
