import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavModule } from '@coreui/angular';
import { PopoverModule } from '@coreui/angular';
import { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

import { EFileType, ITreeItem } from "../../libs/types";
import { EContextMenuAction, IsDirPipe } from "../../libs";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";
import { FileExplorerService } from "../../../../libs/services";

@Component({
  selector: 'directory-tree-comp',
  templateUrl: 'directory-tree.component.html',
  styleUrls: ['directory-tree.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent, IconDirective, IsDirPipe, NavModule, PopoverModule, RouterModule]
})
export class DirectoryTreeComponent implements OnInit, OnChanges {
  @Input() items: ITreeItem[] = [];
  @Input() isSelected: boolean = false;
  @Input() currentItem: ITreeItem | null = null;

  @Output() onDirectorySelected = new EventEmitter<ITreeItem>();

  icons = { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions };
  isContextMenuVisible: boolean = false;
  isCreateDirDialogVisible: boolean = false;
  contextMenuAction = EContextMenuAction;

  constructor(private renderer: Renderer2, private fileExplorerService: FileExplorerService) {}

  ngOnInit(): void {
    this.handlerOnTreeItemClicked(this.items[0]);

    this.renderer.listen('document', 'mousedown', () => {
      this.isContextMenuVisible = false;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['items'].currentValue) {
      this.items = changes['items'].currentValue as ITreeItem[];
      if (this.items.length > 0 && !this.currentItem) {
        this.handlerOnTreeItemClicked(this.items[0]);
      }
    }
  }

  handlerOnToggle = (item: ITreeItem) => {
    item.isExpanded = !item.isExpanded;
  }

  handlerOnTreeItemClicked = (item: ITreeItem) => {
    if (this.currentItem) this.currentItem.isOpened = false;

    if (item) {
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
    this.fileExplorerService.create(dirName);
  }

  handlerOnCreateDirDialogClosed = () => {
    this.isCreateDirDialogVisible = false;
  }
}