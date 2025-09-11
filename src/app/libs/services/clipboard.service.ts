import { Injectable } from '@angular/core';
import { IUserFile, IFileOperation } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {
  private clipboard: IFileOperation | null = null;

  copy(files: IUserFile[]): void {
    this.clipboard = {
      type: 'copy',
      files: [...files]
    };
  }

  cut(files: IUserFile[]): void {
    this.clipboard = {
      type: 'cut',
      files: [...files]
    };
  }

  getClipboard(): IFileOperation | null {
    return this.clipboard;
  }

  clear(): void {
    this.clipboard = null;
  }

  hasContent(): boolean {
    return this.clipboard !== null && this.clipboard.files.length > 0;
  }
}
