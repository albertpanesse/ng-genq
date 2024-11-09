import { NgModule } from "@angular/core";

import { FileExplorerComponent } from "./file-explorer.component";

export enum EFileType {
  CSV,
  GZ,
  CSVGZ,
  RAW
}

export interface ITreeItem {
  id: string;
  title: string;
  isDir: boolean;
  fileType: EFileType;
  fileSize: number;
  lastUpdate: string;
}

@NgModule({
  imports: [FileExplorerComponent],
  exports: [FileExplorerComponent],
})
export class FileExplorerModule {}
