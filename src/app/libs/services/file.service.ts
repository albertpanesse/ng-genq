import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { IUserFile } from '../types';
import { IFileDirList } from '../store';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private mockData: IUserFile[] = [
    {
      id: 1,
      fileName: 'Documents',
      title: 'Documents',
      isDir: true,
      parentId: -1,
      userId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 2,
      fileName: 'Pictures',
      title: 'Pictures',
      isDir: true,
      parentId: -1,
      userId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 3,
      fileName: 'Videos',
      title: 'Videos',
      isDir: true,
      parentId: -1,
      userId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 4,
      fileName: 'report.pdf',
      title: 'Annual Report',
      isDir: false,
      parentId: 1,
      userId: 1,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: 5,
      fileName: 'presentation.pptx',
      title: 'Project Presentation',
      isDir: false,
      parentId: 1,
      userId: 1,
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: 6,
      fileName: 'vacation.jpg',
      title: 'Vacation Photo',
      isDir: false,
      parentId: 2,
      userId: 1,
      createdAt: '2024-01-04T00:00:00Z',
      updatedAt: '2024-01-04T00:00:00Z'
    },
    {
      id: 7,
      fileName: 'portfolio.jpg',
      title: 'Portfolio Image',
      isDir: false,
      parentId: 2,
      userId: 1,
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-05T00:00:00Z'
    },
    {
      id: 8,
      fileName: 'Work',
      title: 'Work',
      isDir: true,
      parentId: 1,
      userId: 1,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 9,
      fileName: 'budget.xlsx',
      title: 'Budget Spreadsheet',
      isDir: false,
      parentId: 8,
      userId: 1,
      createdAt: '2024-01-06T00:00:00Z',
      updatedAt: '2024-01-06T00:00:00Z'
    }
  ];

  getFileList(parentId: number): Observable<IFileDirList> {
    const userFiles = this.mockData.filter(file => file.parentId === parentId);
    return of({ parentId, userFiles }).pipe(delay(300));
  }

  uploadFile(file: File, parentId: number): Observable<IUserFile> {
    const newFile: IUserFile = {
      id: this.getNextId(),
      fileName: file.name,
      title: file.name,
      isDir: false,
      parentId,
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockData.push(newFile);
    return of(newFile).pipe(delay(500));
  }

  createFolder(name: string, parentId: number): Observable<IUserFile> {
    const newFolder: IUserFile = {
      id: this.getNextId(),
      fileName: name,
      title: name,
      isDir: true,
      parentId,
      userId: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.mockData.push(newFolder);
    return of(newFolder).pipe(delay(300));
  }

  deleteFile(id: number): Observable<boolean> {
    const index = this.mockData.findIndex(file => file.id === id);
    if (index !== -1) {
      // Also delete all children if it's a directory
      this.deleteChildren(id);
      this.mockData.splice(index, 1);
    }
    return of(true).pipe(delay(300));
  }

  moveFile(fileId: number, newParentId: number): Observable<IUserFile> {
    const file = this.mockData.find(f => f.id === fileId);
    if (file) {
      file.parentId = newParentId;
      file.updatedAt = new Date().toISOString();
    }
    return of(file!).pipe(delay(300));
  }

  copyFile(fileId: number, newParentId: number): Observable<IUserFile> {
    const originalFile = this.mockData.find(f => f.id === fileId);
    if (originalFile) {
      const copiedFile: IUserFile = {
        ...originalFile,
        id: this.getNextId(),
        parentId: newParentId,
        fileName: `Copy of ${originalFile.fileName}`,
        title: `Copy of ${originalFile.title}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.mockData.push(copiedFile);
      return of(copiedFile).pipe(delay(300));
    }
    return of(null as any);
  }

  downloadFile(id: number): Observable<Blob> {
    // Simulate file download
    const content = new Blob(['This is a mock file content'], { type: 'text/plain' });
    return of(content).pipe(delay(500));
  }

  private deleteChildren(parentId: number): void {
    const children = this.mockData.filter(file => file.parentId === parentId);
    children.forEach(child => {
      if (child.isDir) {
        this.deleteChildren(child.id);
      }
      const index = this.mockData.findIndex(f => f.id === child.id);
      if (index !== -1) {
        this.mockData.splice(index, 1);
      }
    });
  }

  private getNextId(): number {
    return Math.max(...this.mockData.map(f => f.id)) + 1;
  }
}
