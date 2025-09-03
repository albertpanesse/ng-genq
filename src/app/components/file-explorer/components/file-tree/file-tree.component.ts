import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITreeNode } from '../../../../libs/types';

@Component({
  selector: 'app-file-tree',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tree-container">
      <div *ngFor="let node of treeData" class="tree-node">
        <div
          class="tree-item"
          [class.active]="node.id === selectedNodeId"
          [class.has-children]="node.isDir"
          (click)="onNodeClick(node)">

          <span
            *ngIf="node.isDir"
            class="tree-toggle"
            (click)="handleToggleNodeClick(node, $event)">
            {{ node.expanded ? '−' : '+' }}
          </span>

          <i class="tree-icon"
             [class]="node.isDir ? 'cil-folder' : 'cil-description'"></i>

          <span class="tree-label">{{ node.title }}</span>

          <div *ngIf="node.loading" class="spinner-border spinner-border-sm ms-auto"></div>
        </div>

        <div *ngIf="node.expanded && node.children" class="tree-children">
          <app-file-tree
            [treeData]="node.children"
            [selectedNodeId]="selectedNodeId"
            (nodeClick)="onChildNodeClick($event)"
            (toggleNode)="onChildToggleNode($event)">
          </app-file-tree>
        </div>
      </div>
    </div>
  `
})
export class FileTreeComponent {
  @Input() treeData: ITreeNode[] = [];
  @Input() selectedNodeId: number | null = null;
  @Output() nodeClick = new EventEmitter<ITreeNode>();
  @Output() toggleNode = new EventEmitter<ITreeNode>();

  onNodeClick(node: ITreeNode): void {
    this.nodeClick.emit(node);
  }

  onChildNodeClick(node: ITreeNode): void {
    this.nodeClick.emit(node);
  }

  handleToggleNodeClick(node: ITreeNode, event: Event): void {
    event.stopPropagation();
    this.toggleNode.emit(node);
  }

  onChildToggleNode(node: ITreeNode): void {
    this.toggleNode.emit(node);
  }
}
