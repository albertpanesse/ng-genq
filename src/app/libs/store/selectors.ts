import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState, IFileRepoState } from '.';

export const appSelector = createFeatureSelector<IAppState>('app');
export const isUserLoggedInSelector = createSelector(
  appSelector,
  (app) => app.isUserLoggedIn
);
export const tokensSelector = createSelector(
  appSelector,
  (app) => ({
    accessToken: app.accessToken,
    refreshToken: app.refreshToken,
  })
);

export const fileRepoSelector = createFeatureSelector<IFileRepoState>('fileRepo');
export const fileDirListSelector = createSelector(
  fileRepoSelector,
  (app) => app.fileDirList
);
export const fileContentSelector = createSelector(
  fileRepoSelector,
  (app) => app.fileContent
);
