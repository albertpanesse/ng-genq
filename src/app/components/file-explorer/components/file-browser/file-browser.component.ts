import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { IGlobalState } from "../../../../libs/store";
import { fileDirListSelector } from "../../../../libs/store/selectors";
import { EFileExplorerActions, IFileExplorerActionPreviewParams, ITreeItem, TFileExplorerActionParams, TFileExplorerActionResult } from "../../libs/types";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";
import { FileViewerModalComponent } from "../file-viewer-modal/file-viewer-modal.component";

@Component({
  selector: 'file-browser-comp',
  templateUrl: 'file-browser.component.html',
  styleUrls: ['file-browser.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent, FileViewerModalComponent]
})
export class FileBrowserComponent implements OnInit, OnChanges {
  @Input() childItems?: ITreeItem[];
  @Input() actions?: Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  filteredItems: ITreeItem[] = [];
  isCreateDirDialogVisible: boolean = false;
  isPreviewModalVisible: boolean = false;
  fileContent: string = '';

  constructor(private store: Store<IGlobalState>) {}

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['childItems'] && changes['childItems'].currentValue) {
      this.filteredItems = (changes['childItems'].currentValue as ITreeItem[])?.filter(item => !item.fileItem.isDir) || [];
    }
  }

  handlerOnCreateDir = () => {
    this.isCreateDirDialogVisible = true;
  }

  handlerOnCreateDirDialogClosed = () => {
    this.isCreateDirDialogVisible = false;
  }

  handlerOnFileClick = (item: ITreeItem) => {
    const action = this.actions?.get(EFileExplorerActions.FE_PREVIEWING);
    if (action) {
      action({
        userFileId: item.fileItem.userFileId,
        numberOfLine: 20,
      })
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe((result: TFileExplorerActionResult) => {
          this.fileContent = result as string ?? '';
        });
    }

    this.isPreviewModalVisible = true;
  }

  handlerOnVisibleChange = (visible: boolean) => {
    this.isPreviewModalVisible = visible;
  }
}