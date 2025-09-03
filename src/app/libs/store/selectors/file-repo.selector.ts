import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IFileRepoState } from '../';

export const fileRepoSelector = createFeatureSelector<IFileRepoState>('fileRepo');
export const fileDirListSelector = createSelector(
  fileRepoSelector,
  (app) => app.fileDirList
);
export const fileContentSelector = createSelector(
  fileRepoSelector,
  (app) => app.fileContent
);
