import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavModule } from '@coreui/angular';
import { PopoverModule } from '@coreui/angular';
import { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { Observable } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { EFileType, EFileExplorerActions, ITreeItem, TFileExplorerActionParams, TFileExplorerActionResult } from "../../libs/types";
import { EContextMenuAction, IsDirPipe } from "../../libs";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";
import { FileExplorerService } from "../../../../libs/services";
import { ICreateDirDTO } from "../../../../libs/dtos";

@Component({
  selector: 'directory-tree-comp',
  templateUrl: 'directory-tree.component.html',
  styleUrls: ['directory-tree.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent, IconDirective, IsDirPipe, NavModule, PopoverModule, RouterModule]
})
export class DirectoryTreeComponent implements OnInit {
  @Input() rootItems: ITreeItem[] = [];
  @Input() isSelected: boolean = false;
  @Input() currentItem: ITreeItem | null = null;
  @Input() actions?: Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>;

  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  @Output() onDirectorySelected = new EventEmitter<ITreeItem>();

  icons = { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions };
  isContextMenuVisible: boolean = false;
  isCreateDirDialogVisible: boolean = false;
  contextMenuAction = EContextMenuAction;

  constructor(private renderer: Renderer2, private fileExplorerService: FileExplorerService) {}

  ngOnInit(): void {
    if (this.rootItems.length > 0) {
      this.handlerOnTreeItemClicked(this.rootItems[0]);
    }

    this.renderer.listen('document', 'mousedown', () => {
      this.isContextMenuVisible = false;
    });
  }

  handlerOnToggle = (item: ITreeItem) => {
    item.isExpanded = !item.isExpanded;
  }

  handlerOnTreeItemClicked = (item: ITreeItem) => {
    if (this.currentItem) this.currentItem.isOpened = false;

    if (item) {
      const action = this.actions?.get(EFileExplorerActions.FE_LISTING);
      if (action) {
        action({ userFileId: item.fileItem.userFileId })  
          .pipe(takeUntilDestroyed(this.#destroyRef))
          .subscribe();
      }

      item.isOpened = !item.isOpened;
      this.currentItem = item;

      this.onDirectorySelected.emit(item);
    }
  }

  handlerOnContextAction = (contextMenuAction: EContextMenuAction) => {
    switch (contextMenuAction) {
      case EContextMenuAction.CREATE:
        this.isCreateDirDialogVisible = true;
        break;
    }
  }

  handlerOnCreateDirDialogSaved = (dirName: string) => {
    this.fileExplorerService.create({
      name: dirName,
      parentId: this.currentItem?.fileItem.userFileId || null,
    } as ICreateDirDTO);
  }

  handlerOnCreateDirDialogClosed = () => {
    this.isCreateDirDialogVisible = false;
  }
}