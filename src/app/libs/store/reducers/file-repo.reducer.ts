import { createReducer, on } from '@ngrx/store';
import { IFileDirList, IFileRepoState } from '../';
import { setFileContentAction, setFileDirListAction } from '../actions';

const initialFileRepoState: IFileRepoState = {
  fileDirList: {} as IFileDirList,
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
