import { ActionReducer, ActionReducerMap, MetaReducer, INIT, UPDATE } from '@ngrx/store';
import { appReducer, userReducer } from './reducers';
import { IUser } from '../../models';

export interface IAppState {
  isUserLoggedIn: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface IUserState extends IUser {}

export interface IGlobalState {
  app: IAppState;
  user: IUserState;
}

export const reducers: ActionReducerMap<IGlobalState> = {
  app: appReducer,
  user: userReducer,
};

export function storageMetaReducer(reducer: ActionReducer<IGlobalState>): ActionReducer<IGlobalState> {
  return function (state, action) {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('__GENQ__');
      
      if (storageValue) {
        try {
          return JSON.parse(storageValue);
        } catch {
          localStorage.removeItem('__GENQ__');
        }
      }
    }

    const nextState = reducer(state, action);

    localStorage.setItem('__GENQ__', JSON.stringify(nextState));

    return nextState;
  };
}

export const metaReducers: MetaReducer<IGlobalState>[] = [storageMetaReducer];
