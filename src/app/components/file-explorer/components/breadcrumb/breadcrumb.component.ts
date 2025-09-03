import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITreeNode } from '../../../../libs/types';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="breadcrumb">
      <span
        class="breadcrumb-item"
        (click)="onNavigate(-1)">
        Home
      </span>

      <span *ngFor="let item of breadcrumbPath; let last = last">
        <i class="cil-chevron-right mx-2"></i>
        <span
          class="breadcrumb-item"
          [class.text-muted]="last"
          (click)="!last && onNavigate(item.id)">
          {{ item.title }}
        </span>
      </span>
    </nav>
  `
})
export class BreadcrumbComponent {
  @Input() breadcrumbPath: ITreeNode[] = [];
  @Output() navigate = new EventEmitter<number>();

  onNavigate(parentId: number): void {
    this.navigate.emit(parentId);
  }
}
