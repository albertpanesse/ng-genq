import { createReducer, on } from '@ngrx/store';
import { IFileDirList, IFileRepoState } from '../';
import { setFileContentAction, setFileDirListAction } from '../actions';
import { IUserFile } from '../../types';

const initialFileRepoState: IFileRepoState = {
  fileDirList: {} as IFileDirList,
  userFile: {} as IUserFile,
  fileContent: '',
};

export const fileRepoReducer = createReducer(
  initialFileRepoState,
  on(setFileDirListAction, (state: IFileRepoState, props: any) => ({
    ...state,
    fileDirList: props.fileDirList,
  })),
  on(setFileDirListAction, (state: IFileRepoState, props: any) => ({
    ...state,
    fileDirList: props.fileDirList,
  })),
  on(setFileContentAction, (state: IFileRepoState, props: any) => ({
    ...state,
    fileContent: props.fileContent,
  })),
);
