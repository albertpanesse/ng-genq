export const SetIsUserLoggedInAction = 'SetIsUserLoggedInAction';
export const ResetUserAction = 'ResetUserAction';

export interface IApiResponse {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface IAuthSigningInResponsePayload {
  accessToken: string;
  refreshToken: string;
}

export interface IFileManagerUploadingResponsePayload {}

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