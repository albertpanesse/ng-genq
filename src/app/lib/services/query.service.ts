import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  executeQuery(query: any) {
    return this.http.post(`${this.apiUrl}/queries`, query);
  }
}
