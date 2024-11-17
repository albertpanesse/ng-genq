export const SetIsUserLoggedInAction = 'SetIsUserLoggedInAction';
export const ResetUserAction = 'ResetUserAction';

export interface IApiResponse {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface IAuthResponsePayload {
  accessToken: string;
  refreshToken: string;
}

export interface IErrorObject {
  code: EError;
  message: string;
}

export interface ICommonFunctionResult<T> {
  success: boolean;
  payload: T;
}

export enum EError {
  E_UNKNOWN,
  E_AUTH_ERROR,
}