import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITreeNode } from '../../../../libs/types';

@Component({
  selector: 'directory-tree-comp',
  templateUrl: './directory-tree.component.html',
  standalone: true,
  imports: [
    CommonModule
  ],
  styleUrls: ['./directory-tree.component.scss'],
})
export class DirectoryTreeComponent {
  @Input() treeData: ITreeNode[] = [];
  @Input() depth = 0;

  @Output() onSelect = new EventEmitter<ITreeNode>();

  _onSelect(node: ITreeNode, event: MouseEvent) {
    event.stopPropagation();
    this.onSelect.emit(node);
  }
}
