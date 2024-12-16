import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EFileExplorerActions, IFileExplorerActionPreviewParams, ITreeItem, TFileExplorerActionParams, TFileExplorerActionResult } from "../../libs/types";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";
import { FileViewerModalComponent } from "../file-viewer-modal/file-viewer-modal.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Observable } from "rxjs";

@Component({
  selector: 'file-browser-comp',
  templateUrl: 'file-browser.component.html',
  styleUrls: ['file-browser.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent, FileViewerModalComponent]
})
export class FileBrowserComponent implements OnChanges {
  @Input() items?: ITreeItem[];
  @Input() actions?: Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  filteredItems: ITreeItem[] = [];
  isCreateDirDialogVisible: boolean = false;
  isPreviewModalVisible: boolean = false;
  fileContent: string = '';

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
    const action = this.actions?.get(EFileExplorerActions.FE_PREVIEW);
    if (action) {
      action({
        userFileId: item.fileItem.id,
        numberOfLine: 20,
      })
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((fileContent: string) => {
          this.fileContent = fileContent;
        });
    }

    this.isPreviewModalVisible = true;
  }

  handlerOnVisibleChange = (visible: boolean) => {
    this.isPreviewModalVisible = visible;
  }
}