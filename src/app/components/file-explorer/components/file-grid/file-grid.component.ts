import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITreeNode, IUserFile } from '../../../../libs/types';

@Component({
  selector: 'app-file-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-grid.component.html',
})
export class FileGridComponent {
  @Input() files: ITreeNode[] = [];
  @Input() selectedFiles: number[] = [];

  @Output() fileClick = new EventEmitter<{file: IUserFile, event: MouseEvent}>();
  @Output() fileDoubleClick = new EventEmitter<IUserFile>();
  @Output() contextMenu = new EventEmitter<{file: IUserFile, event: MouseEvent}>();

  onFileClick(file: IUserFile, event: MouseEvent): void {
    this.fileClick.emit({ file, event });
  }

  onFileDoubleClick(file: IUserFile): void {
    this.fileDoubleClick.emit(file);
  }

  onContextMenu(file: IUserFile, event: MouseEvent): void {
    event.preventDefault();
    this.contextMenu.emit({ file, event });
  }

  getFileIcon(file: IUserFile): string {
    if (file.isDir) {
      return 'cil-folder';
    }

    const extension = file.fileName.split('.').pop()?.toLowerCase() || '';

    switch (extension) {
      case 'pdf':
        return 'cil-description';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'cil-image';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'cil-video';
      case 'mp3':
      case 'wav':
        return 'cil-audio-spectrum';
      case 'doc':
      case 'docx':
        return 'cil-description';
      case 'xls':
      case 'xlsx':
        return 'cil-spreadsheet';
      case 'ppt':
      case 'pptx':
        return 'cil-presentation';
      default:
        return 'cil-file';
    }
  }

  getFileIconClass(file: IUserFile): string {
    if (file.isDir) {
      return 'folder';
    }

    const extension = file.fileName.split('.').pop()?.toLowerCase() || '';

    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return 'image';
    } else if (['mp4', 'avi', 'mov'].includes(extension)) {
      return 'video';
    } else {
      return 'document';
    }
  }
}
