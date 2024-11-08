import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFiles() {
    return this.http.get<any[]>(`${this.apiUrl}/files`);
  }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/files`, formData);
  }

  deleteFile(fileName: string) {
    return this.http.delete(`${this.apiUrl}/files/${fileName}`);
  }
}
