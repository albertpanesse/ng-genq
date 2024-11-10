import { Pipe, PipeTransform } from '@angular/core';

import { ITreeItem } from "../file-explorer.module";

@Pipe({
  name: 'isDir',
  standalone: true,
})
export class IsDirPipe implements PipeTransform {
  transform(items: ITreeItem[]): ITreeItem[] {
    if (!items) return [];
    return items.filter(item => item.fileItem.isDir);
  }
}
