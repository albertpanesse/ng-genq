import { Component, HostListener, Input } from '@angular/core';

import { TreeNode } from './treeview.types';
import { addNode, findNode, replaceNode } from './treeview.helper';

@Component({
  selector: 'treeview',
  templateUrl: './treeview.component.html',
  styleUrls: ['./treeview.component.scss'],
})
export class TreeviewComponent {
  @Input() treeNodes: TreeNode[] = [];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.contextMenuVisible) {
      this.hideContextMenu();
    }
  }

  contextMenuVisible: boolean = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedNode: TreeNode | null = null;

  toggleExpandCollapse(node: TreeNode): void {
    if (!node.isFolder) return;

    node.isExpanded = !node.isExpanded;
  }

  onRightClick(event: MouseEvent, node: TreeNode): void {
    event.preventDefault();
    this.contextMenuVisible = true;
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.selectedNode = node;
  }

  addNode(parentNode: TreeNode | null, name: string, isFolder: boolean): void {
    const newNode: TreeNode = {
      id: this.generateId(),
      name: name,
      isFolder: isFolder,
      isExpanded: false,
      children: [],
    };

    if (parentNode) {
      addNode(parentNode, newNode);
    } else {
      this.treeNodes.push(newNode);
    }

    this.hideContextMenu();
  }

  removeNode(node: TreeNode | null): void {
    if (node) {
      this.treeNodes = this.removeNodeFromTree(this.treeNodes, node.id);
      this.hideContextMenu();
    }
  }

  removeNodeFromTree(tree: TreeNode[], nodeId: string): TreeNode[] {
    return tree.filter((node) => {
      if (node.id === nodeId) {
        return false;
      }

      if (node.children) {
        node.children = this.removeNodeFromTree(node.children, nodeId);
      }

      return true;
    });
  }

  hideContextMenu(): void {
    this.contextMenuVisible = false;
    this.selectedNode = null;
  }

  findNode(nodeId: string): TreeNode | null {
    return findNode(this.treeNodes, nodeId);
  }

  replaceNode(nodeId: string, name: string, isFolder: boolean): void {
    const newNode: TreeNode = {
      id: nodeId,
      name: name,
      isFolder: isFolder,
      children: [],
    };

    replaceNode(this.treeNodes, nodeId, newNode);
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
