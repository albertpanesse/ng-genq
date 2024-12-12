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
  @Input() apiUrls: { [key: string]: string } = {};
 
  icons = { cilArrowThickFromBottom };
  currentItem!: ITreeItem;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.currentItem = changes['items'].currentValue[0];
    }
  }

  handlerOnDirectorySelected = (item: ITreeItem) => {
    this.currentItem = item;
  }
}