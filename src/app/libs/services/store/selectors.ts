import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from '.';

export const appSelector = createFeatureSelector<IAppState>('app');

export const isUserLoggedInSelector = createSelector(
  appSelector,
  (app) => app.isUserLoggedIn
);

export const accessTokenSelector = createSelector(
  appSelector,
  (app) => app.accessToken
);
