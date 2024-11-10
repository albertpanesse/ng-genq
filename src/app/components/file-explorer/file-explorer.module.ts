import { NgModule } from "@angular/core";

import { FileExplorerComponent } from "./file-explorer.component";

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

@NgModule({
  imports: [FileExplorerComponent],
  exports: [FileExplorerComponent],
})
export class FileExplorerModule {}
