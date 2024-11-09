import { Component, Input } from "@angular/core";
import { CommonModule } from '@angular/common';

import { cilArrowThickFromBottom } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { ButtonDirective } from '@coreui/angular';

import { FiletreeItemComponent, FileBrowserComponent } from "./components";
import { ITreeItem } from "./file-explorer.module";

@Component({
  selector: 'filetree-explorer-comp',
  templateUrl: 'file-explorer.component.html',
  styleUrls: ['file-explorer.component.scss'],
  standalone: true,
  imports: [ButtonDirective, CommonModule, FiletreeItemComponent, FileBrowserComponent, IconDirective]
})
export class FileExplorerComponent {
  @Input() items: ITreeItem[] = [];
 
  icons = { cilArrowThickFromBottom };
  currentActiveItem: ITreeItem | null = null;

  handlerOnFiletreeItemSelect = (item: ITreeItem) => {
    this.currentActiveItem = item;
  }

  handlerOnFiletreeItemUnselect = () => {
    this.currentActiveItem = null;
  }
}