import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUserFile } from '../../../../libs/types';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="visible"
      class="context-menu"
      [style.left.px]="x"
      [style.top.px]="y">

      <div class="context-menu-item" (click)="onAction('open')">
        <i class="cil-external-link me-2"></i>
        Open
      </div>

      <div class="context-menu-item" (click)="onAction('copy')">
        <i class="cil-copy me-2"></i>
        Copy
      </div>

      <div class="context-menu-item" (click)="onAction('cut')">
        <i class="cil-cut me-2"></i>
        Cut
      </div>

      <div class="context-menu-item" (click)="onAction('paste')" [class.disabled]="!canPaste">
        <i class="cil-clipboard me-2"></i>
        Paste
      </div>

      <div class="context-menu-item" (click)="onAction('rename')">
        <i class="cil-pencil me-2"></i>
        Rename
      </div>

      <div class="context-menu-item" (click)="onAction('delete')">
        <i class="cil-trash me-2"></i>
        Delete
      </div>

      <div class="context-menu-item" (click)="onAction('download')" *ngIf="!file?.isDir">
        <i class="cil-cloud-download me-2"></i>
        Download
      </div>
    </div>
  `
})
export class ContextMenuComponent {
  @Input() visible = false;
  @Input() x = 0;
  @Input() y = 0;
  @Input() file: IUserFile | null = null;
  @Input() canPaste = false;
  @Output() action = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();

  @HostListener('document:click')
  onDocumentClick(): void {
    this.close.emit();
  }

  onAction(action: string): void {
    this.action.emit(action);
    this.close.emit();
  }
}
