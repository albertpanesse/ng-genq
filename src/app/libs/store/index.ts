export interface IAppState {
  isUserLoggedIn: boolean;
}

export interface IUserState {
  uname: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface IGlobalState {
  app: IAppState;
  user: IUserState;
}
