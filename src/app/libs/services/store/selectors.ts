import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from '.';

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
