import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavModule } from '@coreui/angular';
import { PopoverModule } from '@coreui/angular';
import { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

import { EFileType, ITreeItem } from "../../libs/types";
import { EContextMenuAction, IsDirPipe } from "../../libs";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";

@Component({
  selector: 'directory-tree-comp',
  templateUrl: 'directory-tree.component.html',
  styleUrls: ['directory-tree.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent, IconDirective, IsDirPipe, NavModule, PopoverModule, RouterModule]
})
export class DirectoryTreeComponent implements OnInit {
  @Input() items: ITreeItem[] = [];
  @Input() isSelected: boolean = false;

  @Output() onDirectorySelected = new EventEmitter<ITreeItem>();

  icons = { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions };
  isContextMenuVisible: boolean = false;
  isCreateDirDialogVisible: boolean = false;
  currentActiveDirectory!: ITreeItem;
  contextMenuAction = EContextMenuAction;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.handlerOnTreeItemClicked(this.items[0]);

    this.renderer.listen('document', 'mousedown', () => {
      this.isContextMenuVisible = false;
    });
  }

  handlerOnToggle = (item: ITreeItem) => {
    item.isExpanded = !item.isExpanded;
  }

  handlerOnTreeItemClicked = (item: ITreeItem) => {
    if (this.currentActiveDirectory) this.currentActiveDirectory.isOpened = false;

    item.isOpened = !item.isOpened;
    this.currentActiveDirectory = item;

    this.onDirectorySelected.emit(item);
  }

  handlerOnContextAction = (contextMenuAction: EContextMenuAction) => {
    switch (contextMenuAction) {
      case EContextMenuAction.CREATE:
        this.isCreateDirDialogVisible = true;
        break;
    }
  }

  handlerOnCreateDirDialogClosed = () => {
    this.isCreateDirDialogVisible = false;
  }
}