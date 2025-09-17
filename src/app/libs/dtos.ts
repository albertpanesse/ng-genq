export interface IAuthDTO {
  email: string;
  password: string;
}

export interface ICreateDirDTO {
  name: string;
  parent_id: number;
}

export interface IFileDirListDTO {
  userFileId: number;
}

export interface IPreviewFileDTO {
  userFileId: number;
  numberOfLine: number;
}
