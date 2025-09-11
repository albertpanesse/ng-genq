import { ActionReducer, ActionReducerMap, MetaReducer, INIT, UPDATE } from '@ngrx/store';
import { appReducer, fileRepoReducer, userReducer } from './reducers';
import { IUser } from '../models';
import { IUserFile } from '../types';

export interface IAppState {
  isUserLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface IUserState extends IUser {}

export interface IFileDirList {
  parentId: number;
  userFiles: IUserFile[];
}

export interface IFileRepoState {
  fileDirList: IFileDirList;
  userFile: IUserFile;
  fileContent: string;
}

export interface IGlobalState {
  app: IAppState;
  user: IUserState;
  fileRepo: IFileRepoState;
}

export const reducers: ActionReducerMap<IGlobalState> = {
  app: appReducer,
  user: userReducer,
  fileRepo: fileRepoReducer,
};

export function storageMetaReducer(reducer: ActionReducer<IGlobalState>): ActionReducer<IGlobalState> {
  return function (state, action) {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = sessionStorage.getItem('__GENQ__');

      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          sessionStorage.removeItem('__GENQ__');
        }
      }
    }

    const nextState = reducer(state, action);

    sessionStorage.setItem('__GENQ__', JSON.stringify(nextState));

    return nextState;
  };
}

export const metaReducers: MetaReducer<IGlobalState>[] = [storageMetaReducer];
