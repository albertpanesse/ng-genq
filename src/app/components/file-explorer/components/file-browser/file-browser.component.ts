import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EFileExplorerActions, ITreeItem, TFileExplorerActionParams } from "../../libs/types";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";
import { FileViewerModalComponent } from "../file-viewer-modal/file-viewer-modal.component";

@Component({
  selector: 'file-browser-comp',
  templateUrl: 'file-browser.component.html',
  styleUrls: ['file-browser.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent, FileViewerModalComponent]
})
export class FileBrowserComponent implements OnChanges {
  @Input() items?: ITreeItem[];
  @Input() actions?: Map<EFileExplorerActions, (<T>(params: TFileExplorerActionParams, callback: () => Promise<T>) => void)>;

  filteredItems: ITreeItem[] = [];
  isCreateDirDialogVisible: boolean = false;
  viewItem: ITreeItem | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['items'].currentValue) {
      this.filteredItems = (changes['items'].currentValue as ITreeItem[])?.filter(item => !item.fileItem.isDir) || [];
    }
  }

  handlerOnCreateDir = () => {
    this.isCreateDirDialogVisible = true;
  }

  handlerOnCreateDirDialogClosed = () => {
    this.isCreateDirDialogVisible = false;
  }

  handlerOnFileClick = (item: ITreeItem) => {
    this.viewItem = item;
  }
}