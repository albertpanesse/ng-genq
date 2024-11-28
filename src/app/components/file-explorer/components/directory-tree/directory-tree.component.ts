import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { NavModule } from '@coreui/angular';
import { PopoverModule } from '@coreui/angular';
import { ButtonDirective } from '@coreui/angular';
import { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';

import { EFileType, ITreeItem } from "../../libs/types";
import { DashboardComponent } from "../../../../pages/dashboard/dashboard.component";
import { EContextMenuAction, IsDirPipe } from "../../libs";

@Component({
  selector: 'directory-tree-comp',
  templateUrl: 'directory-tree.component.html',
  styleUrls: ['directory-tree.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonDirective, IconDirective, IsDirPipe, DashboardComponent, NavModule, PopoverModule, RouterModule]
})
export class DirectoryTreeComponent implements OnInit {
  @Input() items: ITreeItem[] = [];
  @Input() isSelected: boolean = false;

  @Output() onDirectorySelected = new EventEmitter<ITreeItem>();

  icons = { cilPlus, cilMinus, cilFolder, cilFolderOpen, cilOptions };
  isContextMenuVisible: boolean = false;
  currentActiveDirectory!: ITreeItem;
  treeItems: ITreeItem[] = [];
  contextMenuAction = EContextMenuAction;

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.treeItems[0] = {
      fileItem: {
        id: 'root',
        isDir: true,
        title: 'Root Directory',
        fileSize: 0,
        fileType: EFileType.NONE,
        lastUpdate: '',
        children: this.items,  
      },
      isExpanded: true,
      isOpened: true,
    };
    this.currentActiveDirectory = this.treeItems[0];

    this.renderer.listen('document', 'mousedown', () => {
      this.isContextMenuVisible = false;
    });
  }

  handlerOnToggle = (item: ITreeItem) => {
    item.isExpanded = !item.isExpanded;
  }

  handlerOnTreeItemClicked = (item: ITreeItem) => {
    this.currentActiveDirectory.isOpened = false;

    item.isOpened = !item.isOpened;
    this.currentActiveDirectory = item;

    this.onDirectorySelected.emit(item);
  }

  handlerOnContextAction = (contextMenuAction: EContextMenuAction) => {}
}