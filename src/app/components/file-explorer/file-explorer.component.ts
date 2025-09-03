import { Component, HostListener, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IUserFile, ITreeNode } from "../../libs/types";
import { BreadcrumbComponent, ContextMenuComponent, FileGridComponent, FileTreeComponent, UploadZoneComponent } from "./components";
import { ClipboardService, FileService } from "../../libs/services";

@Component({
  selector: 'filetree-explorer-comp',
  templateUrl: 'file-explorer.component.html',
  styleUrls: ['file-explorer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FileTreeComponent,
    FileGridComponent,
    ContextMenuComponent,
    UploadZoneComponent,
    BreadcrumbComponent
  ]
})
export class FileExplorerComponent implements OnInit {
  treeData: ITreeNode[] = [];
  currentFiles: IUserFile[] = [];
  selectedFiles: number[] = [];
  currentFolderId: number = -1;
  breadcrumbPath: ITreeNode[] = [];
  loading = false;
  showCreateFolder = false;
  newFolderName = '';

  contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    file: null as IUserFile | null
  };

  constructor(
    private fileService: FileService,
    public clipboardService: ClipboardService
  ) {}

  ngOnInit(): void {
    this.loadRootFolder();
  }

  loadRootFolder(): void {
    this.loading = true;
    this.fileService.getFileList(-1).subscribe(result => {
      this.currentFiles = result.userFiles;
      this.treeData = this.buildTreeData(result.userFiles);
      this.loading = false;
    });
  }

  buildTreeData(files: IUserFile[]): ITreeNode[] {
    return files
      .filter(file => file.isDir)
      .map(dir => ({
        ...dir,
        children: [],
        expanded: false,
        loading: false
      }));
  }

  onTreeNodeClick(node: ITreeNode): void {
    this.currentFolderId = node.id;
    this.loadFolderContents(node.id);
    this.updateBreadcrumb(node);
  }

  onTreeToggle(node: ITreeNode): void {
    if (node.expanded) {
      node.expanded = false;
      node.children = [];
    } else {
      node.loading = true;
      node.expanded = true;

      this.fileService.getFileList(node.id).subscribe(result => {
        node.children = this.buildTreeData(result.userFiles);
        node.loading = false;
      });
    }
  }

  loadFolderContents(folderId: number): void {
    this.loading = true;
    this.selectedFiles = [];

    this.fileService.getFileList(folderId).subscribe(result => {
      this.currentFiles = result.userFiles;
      this.loading = false;
    });
  }

  updateBreadcrumb(node: ITreeNode): void {
    // Build breadcrumb path by traversing up the tree
    const path: ITreeNode[] = [];
    let current: ITreeNode | null = node;

    while (current && current.id !== -1) {
      path.unshift(current);
      current = this.findParentNode(current.parentId);
    }

    this.breadcrumbPath = path;
  }

  findParentNode(parentId: number): ITreeNode | null {
    const findInTree = (nodes: ITreeNode[]): ITreeNode | null => {
      for (const node of nodes) {
        if (node.id === parentId) {
          return node;
        }
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(this.treeData);
  }

  navigateToFolder(folderId: number): void {
    this.currentFolderId = folderId;
    this.loadFolderContents(folderId);

    if (folderId === -1) {
      this.breadcrumbPath = [];
    } else {
      const node = this.findNodeById(folderId);
      if (node) {
        this.updateBreadcrumb(node);
      }
    }
  }

  findNodeById(id: number): ITreeNode | null {
    const findInTree = (nodes: ITreeNode[]): ITreeNode | null => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        }
        if (node.children) {
          const found = findInTree(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    return findInTree(this.treeData);
  }

  onFileClick(event: {file: IUserFile, event: MouseEvent}): void {
    const { file, event: mouseEvent } = event;

    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
      // Multi-select
      if (this.selectedFiles.includes(file.id)) {
        this.selectedFiles = this.selectedFiles.filter(id => id !== file.id);
      } else {
        this.selectedFiles.push(file.id);
      }
    } else {
      // Single select
      this.selectedFiles = [file.id];
    }
  }

  onFileDoubleClick(file: IUserFile): void {
    if (file.isDir) {
      this.navigateToFolder(file.id);
    } else {
      this.downloadFile(file);
    }
  }

  onFileContextMenu(event: {file: IUserFile, event: MouseEvent}): void {
    this.contextMenu = {
      visible: true,
      x: event.event.clientX,
      y: event.event.clientY,
      file: event.file
    };
    this.selectedFiles = [event.file.id];
  }

  hideContextMenu(): void {
    this.contextMenu.visible = false;
  }

  onContextMenuAction(action: string): void {
    switch (action) {
      case 'open':
        if (this.contextMenu.file?.isDir) {
          this.navigateToFolder(this.contextMenu.file.id);
        } else if (this.contextMenu.file) {
          this.downloadFile(this.contextMenu.file);
        }
        break;
      case 'copy':
        this.copySelectedFiles();
        break;
      case 'cut':
        this.cutSelectedFiles();
        break;
      case 'paste':
        this.pasteFiles();
        break;
      case 'delete':
        this.deleteSelectedFiles();
        break;
      case 'download':
        if (this.contextMenu.file && !this.contextMenu.file.isDir) {
          this.downloadFile(this.contextMenu.file);
        }
        break;
    }
  }

  triggerUpload(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFilesSelected(fileList: FileList): void {
    Array.from(fileList).forEach(file => {
      this.fileService.uploadFile(file, this.currentFolderId).subscribe(newFile => {
        this.currentFiles.push(newFile);
        this.addToTree(newFile);
      });
    });
  }

  createFolder(): void {
    if (this.newFolderName.trim()) {
      this.fileService.createFolder(this.newFolderName.trim(), this.currentFolderId).subscribe(newFolder => {
        this.currentFiles.push(newFolder);
        this.addToTree(newFolder);
        this.cancelCreateFolder();
      });
    }
  }

  cancelCreateFolder(): void {
    this.showCreateFolder = false;
    this.newFolderName = '';
  }

  copySelectedFiles(): void {
    const selectedFileObjects = this.currentFiles.filter(f => this.selectedFiles.includes(f.id));
    this.clipboardService.copy(selectedFileObjects);
  }

  cutSelectedFiles(): void {
    const selectedFileObjects = this.currentFiles.filter(f => this.selectedFiles.includes(f.id));
    this.clipboardService.cut(selectedFileObjects);
  }

  pasteFiles(): void {
    const clipboard = this.clipboardService.getClipboard();
    if (!clipboard) return;

    clipboard.files.forEach(file => {
      if (clipboard.type === 'copy') {
        this.fileService.copyFile(file.id, this.currentFolderId).subscribe(copiedFile => {
          if (copiedFile) {
            this.currentFiles.push(copiedFile);
            this.addToTree(copiedFile);
          }
        });
      } else if (clipboard.type === 'cut') {
        this.fileService.moveFile(file.id, this.currentFolderId).subscribe(movedFile => {
          this.currentFiles.push(movedFile);
          this.removeFromTree(file.id);
          this.addToTree(movedFile);
        });
      }
    });

    if (clipboard.type === 'cut') {
      this.clipboardService.clear();
    }
  }

  deleteSelectedFiles(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedFiles.length} item(s)?`)) {
      this.selectedFiles.forEach(fileId => {
        this.fileService.deleteFile(fileId).subscribe(() => {
          this.currentFiles = this.currentFiles.filter(f => f.id !== fileId);
          this.removeFromTree(fileId);
        });
      });
      this.selectedFiles = [];
    }
  }

  downloadFile(file: IUserFile): void {
    this.fileService.downloadFile(file.id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  refreshCurrentFolder(): void {
    this.loadFolderContents(this.currentFolderId);
  }

  addToTree(file: IUserFile): void {
    if (file.isDir && file.parentId === this.currentFolderId) {
      // Add to current tree level if it's a directory in current folder
      const newNode: ITreeNode = {
        ...file,
        children: [],
        expanded: false,
        loading: false
      };

      if (this.currentFolderId === -1) {
        this.treeData.push(newNode);
      } else {
        const parentNode = this.findNodeById(this.currentFolderId);
        if (parentNode && parentNode.children) {
          parentNode.children.push(newNode);
        }
      }
    }
  }

  removeFromTree(fileId: number): void {
    const removeFromNodes = (nodes: ITreeNode[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === fileId) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && removeFromNodes(nodes[i].children!)) {
          return true;
        }
      }
      return false;
    };

    removeFromNodes(this.treeData);
  }

  getCurrentFolderName(): string {
    if (this.currentFolderId === -1) {
      return 'Root Directory';
    }

    if (this.breadcrumbPath.length > 0) {
      return this.breadcrumbPath[this.breadcrumbPath.length - 1].title;
    }

    return 'Unknown Folder';
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'c':
          event.preventDefault();
          this.copySelectedFiles();
          break;
        case 'x':
          event.preventDefault();
          this.cutSelectedFiles();
          break;
        case 'v':
          event.preventDefault();
          this.pasteFiles();
          break;
        case 'Delete':
          event.preventDefault();
          this.deleteSelectedFiles();
          break;
      }
    }
  }
}
