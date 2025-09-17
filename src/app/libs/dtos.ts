export interface IAuthDTO {
  email: string;
  password: string;
}

export interface ICreateDirDTO {
  name: string;
  parent_id: number;
}

export interface IFileDirListDTO {
  user_file_id: number;
}

export interface IUploadFileDTO {
  file: File;
  parent_id: number;
}

export interface IPreviewFileDTO {
  user_file_id: number;
  number_of_line: number;
}
