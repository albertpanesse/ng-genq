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
  id: string;
  title: string;
  isDir: boolean;
  fileType: EFileType;
  fileSize: number;
  children?: ITreeItem[];
  lastUpdate: string;  
}

export interface ITreeItem {
  fileItem: IFileItem;
  isExpanded: boolean;
  isOpened: boolean;
}

export interface IFileExplorerActionPreviewParams {
  userFileId: string;
  numberOfLine: number;
}

export type TFileExplorerActionParams = IFileExplorerActionPreviewParams;

export type TFileExplorerActionResult = string;

export enum EFileExplorerActions {
  FE_PREVIEW,
  FE_CREATE,
};