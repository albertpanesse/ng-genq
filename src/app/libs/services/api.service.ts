import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from ".";

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #headers: { [key: string]: string } = {};

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.#headers['Content-Type'] = 'application/json';
  }

  #mergeHeaders(isNeedAuthorization: boolean, headers?: { [key: string]: string }) {
    const { accessToken } = this.commonService.getTokens();

    if (isNeedAuthorization) {
      this.#headers['Authorization'] = `Bearer ${accessToken}`;
    }

    this.#headers = { ...this.#headers, ...headers };

    return this.#headers;
  }

  // Generic GET request
  get<T>(url: string, params?: HttpParams, additionalHeaders?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    const headers = this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.http.get<T>(url, { params, headers });
  }

  // Generic POST request
  post<T>(url: string, body: any, additionalHeaders?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    const headers = this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.http.post<T>(url, body, { headers });
  }

  // Generic PUT request
  put<T>(url: string, body: any, additionalHeaders?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    const headers = this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.http.put<T>(url, body, { headers });
  }

  // Generic DELETE request
  delete<T>(url: string, additionalHeaders?: { [key: string]: string }, isNeedAuthorization: boolean = false): Observable<T> {
    const headers = this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.http.delete<T>(url, { headers });
  }
}
