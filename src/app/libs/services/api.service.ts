import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
    this.#headers.set('Content-Type', 'application/json');
  }

  #mergeHeaders(isNeedAuthorization: boolean, headers?: { [key: string]: string }) {
    if (!headers) return this.#headers;

    if (isNeedAuthorization) {
      this.#headers.set('Authorization', 'Bearer 1231234123123');
    }

    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        const value = headers[key];
        this.#headers.set(key, value);
      }
    }

    return this.#headers;
  }

  // Generic GET request
  get<T>(url: string, params?: HttpParams, headers?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    return this.http.get<T>(url, { params, headers: this.#mergeHeaders(isNeedAuthorization, headers) });
  }

  // Generic POST request
  post<T>(url: string, body: any, headers?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    return this.http.post<T>(url, body, { headers: this.#mergeHeaders(isNeedAuthorization, headers) });
  }

  // Generic PUT request
  put<T>(url: string, body: any, headers?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    return this.http.put<T>(url, body, { headers: this.#mergeHeaders(isNeedAuthorization, headers) });
  }

  // Generic DELETE request
  delete<T>(url: string, headers?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    return this.http.delete<T>(url, { headers: this.#mergeHeaders(isNeedAuthorization, headers) });
  }
}
