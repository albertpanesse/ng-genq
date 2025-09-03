import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="upload-zone"
      [class.dragover]="isDragOver"
      (click)="fileInput.click()">
      
      <i class="cil-cloud-upload" style="font-size: 48px; color: #6c757d;"></i>
      <p class="mt-3 mb-2">Drop files here or click to browse</p>
      <small class="text-muted">Supports all file types</small>
      
      <input 
        #fileInput
        type="file"
        multiple
        style="display: none"
        (change)="onFileSelect($event)">
    </div>
  `
})
export class UploadZoneComponent {
  @Output() filesSelected = new EventEmitter<FileList>();
  isDragOver = false;

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files) {
      this.filesSelected.emit(event.dataTransfer.files);
    }
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.filesSelected.emit(files);
    }
  }
}