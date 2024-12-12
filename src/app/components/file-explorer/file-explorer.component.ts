import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from '@angular/common';

import { cilArrowThickFromBottom } from '@coreui/icons';
import { IconDirective } from '@coreui/icons-angular';
import { ButtonDirective } from '@coreui/angular';

import { DirectoryTreeComponent, FileBrowserComponent } from "./components";
import { EFileExplorerActions, ITreeItem, TFileExplorerActionParams } from "./libs/types";

@Component({
  selector: 'filetree-explorer-comp',
  templateUrl: 'file-explorer.component.html',
  styleUrls: ['file-explorer.component.scss'],
  standalone: true,
  imports: [ButtonDirective, CommonModule, DirectoryTreeComponent, FileBrowserComponent, IconDirective]
})
export class FileExplorerComponent implements OnChanges {
  @Input() items: ITreeItem[] = [];
  @Input() actions?: Map<EFileExplorerActions, (<T>(params: TFileExplorerActionParams, callback: () => Promise<T>) => void)>;

  icons = { cilArrowThickFromBottom };
  currentItem: ITreeItem | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.currentItem = changes['items'].currentValue[0];
    }
  }

  handlerOnDirectorySelected = (item: ITreeItem) => {
    this.currentItem = item;
  }
}