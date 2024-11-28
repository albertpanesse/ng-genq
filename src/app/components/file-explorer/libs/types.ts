export enum EContextMenuAction {
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
