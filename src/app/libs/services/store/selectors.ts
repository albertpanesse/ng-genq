import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAppState } from '.';

const appSelector = createFeatureSelector<IAppState>('app');
export const isUserLoggedInSelector = createSelector(
  appSelector,
  (app) => app.isUserLoggedIn
);
