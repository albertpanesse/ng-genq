import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
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
export class DirectoryTreeComponent implements OnChanges {
  @Input() treeData: ITreeNode[] = [];
  @Input() depth = 0;

  @Output() onSelect = new EventEmitter<ITreeNode>();

  ngOnChanges(): void {
    console.log('DirectoryTreeComponent initialized with data:', this.treeData);
  }

  _onSelect(node: ITreeNode, event: MouseEvent) {
    event.stopPropagation();
    this.onSelect.emit(node);
  }
}
