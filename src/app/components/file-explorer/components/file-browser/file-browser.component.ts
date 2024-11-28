import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ITreeItem } from "../../libs/types";
import { CreateDirDialogComponent } from "../create-dir-dialog/create-dir-dialog.component";

@Component({
  selector: 'file-browser-comp',
  templateUrl: 'file-browser.component.html',
  styleUrls: ['file-browser.component.scss'],
  standalone: true,
  imports: [CommonModule, CreateDirDialogComponent]
})
export class FileBrowserComponent implements OnChanges {
  @Input() items?: ITreeItem[];

  filteredItems: ITreeItem[] | null = null;
  isCreateDirDialogVisible: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && changes['items'].currentValue && (changes['items'].currentValue as ITreeItem[]).length > 0) {
      this.filteredItems = (changes['items'].currentValue as ITreeItem[]).filter(item => !item.fileItem.isDir);
    }
  }

  handlerOnCreateDir = () => {
    this.isCreateDirDialogVisible = true;
  }

  handlerOnCreateDirDialogClosed = () => {
    this.isCreateDirDialogVisible = false;
  }
}