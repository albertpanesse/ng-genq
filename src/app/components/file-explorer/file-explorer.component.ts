import { Component, DestroyRef, HostListener, inject, Input, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from "@ngrx/store";
import { Observable, Subject, Subscription } from "rxjs";
import { filter, map, switchMap, take } from "rxjs/operators";

import { IUserFile, ITreeNode } from "../../libs/types";
import { BreadcrumbComponent, ContextMenuComponent, CreateDirDialogComponent, DirectoryTreeComponent, FileGridComponent, UploadZoneComponent } from "./components";
import { ClipboardService, FileExplorerService, FileService } from "../../libs/services";
import { IFileDirList } from "../../libs/store";
import { EFileExplorerActions, IFileExplorerActionListingParams, TFileExplorerActionParams, TFileExplorerActionResult } from "./libs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ICreateDirDTO } from "../../libs/dtos";
import { fileDirListSelector, userFileSelector } from "src/app/libs/store/selectors";

@Component({
  selector: 'file-explorer-comp',
  templateUrl: 'file-explorer.component.html',
  styleUrls: ['file-explorer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CreateDirDialogComponent,
    FormsModule,
    DirectoryTreeComponent,
    FileGridComponent,
    ContextMenuComponent,
    UploadZoneComponent,
    BreadcrumbComponent
  ]
})
export class FileExplorerComponent implements OnInit, OnDestroy {
  @Input() actions!: Map<EFileExplorerActions, (params: TFileExplorerActionParams) => Observable<TFileExplorerActionResult>>;

  currentFiles: IUserFile[] = [];
  treeData: ITreeNode[] = [];
  selectedFiles: number[] = [];
  currentFolderId: number = -1;
  breadcrumbPath: ITreeNode[] = [];
  loading = false;
  showCreateDirModal = false;
  newFolderName = '';
  selectedNode : ITreeNode | null = null;

  contextMenu = {
    visible: false,
    x: 0,
    y: 0,
    file: null as IUserFile | null
  };

  #listingRequest$ = new Subject<ITreeNode | null>();
  #subscription?: Subscription;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private fileExplorerService: FileExplorerService,
    private fileService: FileService,
    public clipboardService: ClipboardService,
    private store: Store,
  ) { }

  ngOnInit(): void {
    this.store.select(fileDirListSelector).pipe(
      filter(dirList => !!dirList),
      take(1),
    ).subscribe(result => {
        const parsed = this.buildTreeData((result as IFileDirList).userFiles);

        if (this.selectedNode) {
          this.selectedNode.children = parsed;
          this.selectedNode.loading = false;
        } else {
          this.treeData = parsed;
          this.breadcrumbPath = parsed;
          this.loading = false;
        }
      });

    this.store.select(userFileSelector).pipe(
      filter(userFile => !!userFile),
      take(1),
    ).subscribe(userFile => {
      if (userFile && userFile.parentId === this.currentFolderId) {
        this.currentFiles = [userFile, ...this.currentFiles];
        this.addToTree(userFile);
      }
      this.showCreateDirModal = false;
    });

    this.loadRoot();
  }

  ngOnDestroy(): void {
    this.#subscription?.unsubscribe();
  }

  private requestListing(node: ITreeNode | null) {
    this.fileExplorerService.getList(node ? node.id : -1);
  }

  loadRoot(): void {
    this.currentFolderId = -1;
    this.requestListing(null);
  }

  onNodeSelect(node: ITreeNode): void {
    if (!node.isDir) return;

    node.expanded = !node.expanded;
    if (node.expanded) {
      node.loading = true;
      this.requestListing(node);
    }
  }

  buildTreeData(files: IUserFile[]): ITreeNode[] {
    return files?.filter(file => file.isDir)
      .map(dir => ({
        ...dir,
        children: [],
        expanded: false,
        loading: false
      }));
  }

  onTreeNodeClick(node: ITreeNode): void {
    if (node.isDir) {
      this.navigateToFolder(node.id);
    }
  }

  loadFolderContents(folderId: number): void {
    this.currentFolderId = folderId;
    this.requestListing(this.findNodeById(folderId));
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

  updateBreadcrumb(node: ITreeNode): void {
    const path: ITreeNode[] = [];
    let current: ITreeNode | null = node;

    while (current) {
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

  onFileClick(event: { file: IUserFile, event: MouseEvent }): void {
    const { file, event: mouseEvent } = event;

    if (mouseEvent.ctrlKey || mouseEvent.metaKey) {
      if (this.selectedFiles.includes(file.id)) {
        this.selectedFiles = this.selectedFiles.filter(id => id !== file.id);
      } else {
        this.selectedFiles.push(file.id);
      }
    } else {
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

  onFileContextMenu(event: { file: IUserFile, event: MouseEvent }): void {
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
    this.showCreateDirModal = true;
  }

  onCreateDirSaved(dirName: any): void {
    if (dirName) {
      this.fileExplorerService.create({ name: dirName, parent_id: this.currentFolderId } as ICreateDirDTO);
    }
  }

  onCreateDirClosed(): void {
    this.showCreateDirModal = false;
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
