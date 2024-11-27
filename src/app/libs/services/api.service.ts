import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { lastValueFrom, take, catchError } from 'rxjs';
import { StoreService } from './store.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #defaultHeaders: { [key: string]: string } = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient, private storeService: StoreService) {}

  async #mergeHeaders(isNeedAuthorization: boolean, additionalHeaders?: { [key: string]: string }): Promise<HttpHeaders> {
    const headers: { [key: string]: string } = { ...this.#defaultHeaders, ...additionalHeaders };

    if (isNeedAuthorization) {
      try {
        const accessToken = await lastValueFrom(this.storeService.getAccessTokenState().pipe(take(1)));
        headers['Authorization'] = `Bearer ${accessToken}`;
      } catch (error) {
        console.error('Error fetching access token:', error);
        throw new Error('Authorization token is required but could not be fetched.');
      }
    }

    return new HttpHeaders(headers);
  }

  async #handleRequest<T>(request: Promise<T>): Promise<T> {
    try {
      return await request;
    } catch (error: any) {
      this.#handleHttpError(error);
      throw error;
    }
  }

  #handleHttpError(error: any): void {
    console.error('HTTP Error:', error);
    if (error.status === 401) {
      console.error('Unauthorized access - perhaps the token has expired.');
      // Add logic to refresh token or redirect to login
    } else if (error.status === 403) {
      console.error('Access forbidden - insufficient permissions.');
    } else if (error.status === 500) {
      console.error('Server error - something went wrong on the backend.');
    } else {
      console.error(`Unhandled HTTP error: ${error.message}`);
    }
  }

  // Generic GET request
  async get<T>(
    url: string,
    params?: HttpParams,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(lastValueFrom(this.http.get<T>(url, { params, headers })));
  }

  // Generic POST request
  async post<T>(
    url: string,
    body: any,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(lastValueFrom(this.http.post<T>(url, body, { headers })));
  }

  // Generic PUT request
  async put<T>(
    url: string,
    body: any,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(lastValueFrom(this.http.put<T>(url, body, { headers })));
  }

  // Generic DELETE request
  async delete<T>(
    url: string,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(lastValueFrom(this.http.delete<T>(url, { headers })));
  }
}
