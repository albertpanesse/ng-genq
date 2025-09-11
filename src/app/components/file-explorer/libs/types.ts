import { IFileDirList } from "../../../libs/store";

export enum EContextMenuAction {
  CREATE,
  COPY,
  CUT,
  PASTE,
  RENAME,
  DELETE,
  UPLOAD,
  DOWNLOAD
}

export enum EFileType {
  CSV,
  GZ,
  CSVGZ,
  RAW,
  NONE
}

export interface IFileItem {
  createdAt: string;
  fileName: string;
  userFileId: number;
  isDir: boolean;
  parentId: number;
  title: string;
  updatedAt: string;
  userId: number;
  groupId: string;

  id: string;
  fileType: EFileType;
  fileSize: number;
  children?: ITreeItem[];
}

export interface ITreeItem {
  fileItem: IFileItem;
  isExpanded: boolean;
  isOpened: boolean;
}

export interface IFileExplorerActionPreviewParams {
  userFileId: number;
  numberOfLine: number;
}

export interface IFileExplorerActionListingParams {
  userFileId: number;
}

export type TFileExplorerActionParams = IFileExplorerActionPreviewParams | IFileExplorerActionListingParams;

export type TFileExplorerActionResult = string | IFileDirList;

export enum EFileExplorerActions {
  FE_LISTING,
  FE_PREVIEWING,
  FE_CREATING,
};
