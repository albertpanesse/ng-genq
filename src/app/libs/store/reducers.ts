import { createReducer, on } from '@ngrx/store';
import { IAppState, IFileRepoState, IUserState } from '.';
import { setFileContentAction, setFileDirListAction, setIsUserLoggedInAction, setTokensAction } from './actions';

const initialAppState: IAppState = {
  isUserLoggedIn: false,
  accessToken: '',
  refreshToken: '',
};

export const appReducer = createReducer(
  initialAppState,
  on(setIsUserLoggedInAction, (state: IAppState, props: any) => {
    return {
      ...state,
      isUserLoggedIn: props.isUserLoggedIn,
    };
  }),
  on(setTokensAction, (state: IAppState, props: any) => {
    return {
      ...state,
      accessToken: props.accessToken,
      refreshToken: props.refreshToken,
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

const initialFileRepoState: IFileRepoState = {
  fileDirList: [],
  fileContent: '',
};

export const fileRepoReducer = createReducer(
  initialFileRepoState,
  on(setFileDirListAction, (state: IFileRepoState, props: any) => ({
    ...state,
    fileDirList: props.fileDirList,
  })),
  on(setFileContentAction, (state: IFileRepoState, props: any) => ({
    ...state,
    fileContent: props.fileContent,
  })),
);
