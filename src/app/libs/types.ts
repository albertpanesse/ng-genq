export interface IApiResponse {
  success: boolean;
  payload: any;
}

export interface IAuthSigningInResponsePayload {
  accessToken: string;
  refreshToken: string;
}

export interface IUserFile {
  id: number;
  userId: number;
  title: string;
  isDir: boolean;
  parentId: number;
  fileName: string;
}

export type TFileManagerListingResponsePayload = IUserFile[];

export interface IFileManagerCreatingResponsePayload {}

export interface IErrorObject {
  code: EError;
  message: string;
}

export interface IErrorResponsePayload {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export interface ICommonFunctionResult<T> {
  success: boolean;
  functionResult: T;
}

export interface IAuthCredential {
  username: string;
  password: string;
}

export enum EError {
  E_UNKNOWN,
  E_AUTH_ERROR,
}
