import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from '@angular/common';

import { cilArrowThickFromBottom } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { ButtonDirective } from '@coreui/angular';

import { DirectoryTreeComponent, FileBrowserComponent } from "./components";
import { ITreeItem } from "./libs/types";

@Component({
  selector: 'filetree-explorer-comp',
  templateUrl: 'file-explorer.component.html',
  styleUrls: ['file-explorer.component.scss'],
  standalone: true,
  imports: [ButtonDirective, CommonModule, DirectoryTreeComponent, FileBrowserComponent, IconDirective]
})
export class FileExplorerComponent implements OnChanges {
  @Input() items: ITreeItem[] = [];
 
  icons = { cilArrowThickFromBottom };
  currentActiveDirectory: ITreeItem | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      console.log('changes.items', changes['items'].currentValue);
    }
  }

  handlerOnDirectorySelected = (item: ITreeItem) => {
    this.currentActiveDirectory = item;
  }
}