import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #defaultHeaders: { [key: string]: string } = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient, private storeService: StoreService) {}

  async #mergeHeaders(isNeedAuthorization: boolean, additionalHeaders?: { [key: string]: string }): Promise<HttpHeaders> {
    const headers: { [key: string]: string } = { ...this.#defaultHeaders, ...additionalHeaders };

    if (isNeedAuthorization) {
      const accessToken = await lastValueFrom(this.storeService.getAccessTokenState());
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return new HttpHeaders(headers);
  }

  // Generic GET request
  async get<T>(
    url: string,
    params?: HttpParams,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return lastValueFrom(this.http.get<T>(url, { params, headers }));
  }

  // Generic POST request
  async post<T>(
    url: string,
    body: any,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return lastValueFrom(this.http.post<T>(url, body, { headers }));
  }

  // Generic PUT request
  async put<T>(
    url: string,
    body: any,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return lastValueFrom(this.http.put<T>(url, body, { headers }));
  }

  // Generic DELETE request
  async delete<T>(
    url: string,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return lastValueFrom(this.http.delete<T>(url, { headers }));
  }
}
