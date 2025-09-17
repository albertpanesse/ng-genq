export interface IApiResponse {
  success: boolean;
  payload: any;
  message?: string;
}

export interface IAuthSigningInResponsePayload {
  accessToken: string;
  refreshToken: string;
}

export interface IUserFile {
  createdAt: string;
  fileName: string;
  id: number;
  isDir: boolean;
  parentId: number;
  title: string;
  updatedAt: string;
  userId: number;
}

export interface ITreeNode extends IUserFile {
  children?: ITreeNode[];
  expanded?: boolean;
  loading?: boolean;
}

export interface IFileOperation {
  type: 'copy' | 'cut';
  files: IUserFile[];
}

export interface IFileExplorerListingResponsePayload {
  parentId: number;
  userFiles: IUserFile[];
}

export interface IFileExplorerPreviewingResponsePayload {
  content: string;
  fileName: string;
}

export interface IFileExplorerCreatingResponsePayload extends IUserFile {}

export interface IFileExplorerUploadingResponsePayload extends IUserFile {}

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

export enum EError {
  E_UNKNOWN,
  E_AUTH_ERROR,
}
