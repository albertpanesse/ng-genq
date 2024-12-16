import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { lastValueFrom, take } from 'rxjs';
import { IGlobalState } from '../store';
import { Store } from '@ngrx/store';
import { tokensSelector } from '../store/selectors';
import { setTokensAction } from '../store/actions';
import { IApiResponse } from '../types';
import { REFRESH_TOKEN_URL } from '../consts';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  #defaultHeaders: { [key: string]: string } = { 'Content-Type': 'application/json' };
  #isRefreshing = false;

  constructor(private http: HttpClient, private store: Store<IGlobalState>) {}

  async #mergeHeaders(isNeedAuthorization: boolean, additionalHeaders?: { [key: string]: string }): Promise<HttpHeaders> {
    const headers: { [key: string]: string } = { ...this.#defaultHeaders, ...additionalHeaders };

    if (isNeedAuthorization) {
      const { accessToken } = await this.#getTokens();
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return new HttpHeaders(headers);
  }

  async #getTokens(): Promise<{ accessToken: string; refreshToken: string; }> {
    try {
      return await lastValueFrom(this.store.select(tokensSelector).pipe(take(1)));
    } catch (error) {
      console.error('Error fetching access token:', error);
      throw new Error('Authorization token is required but could not be fetched.');
    }
  }

  async #refreshToken(): Promise<void> {
    if (this.#isRefreshing) {
      return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    this.#isRefreshing = true;
    try {
      const { refreshToken } = await this.#getTokens();
      const result = await lastValueFrom(this.http.post<IApiResponse>(REFRESH_TOKEN_URL, {
        refreshToken,
      }));
      if (result?.success) {
        const { accessToken, refreshToken } = result.payload;
        this.store.dispatch(setTokensAction({ accessToken, refreshToken }));
      } else {
        throw new Error('Token refresh failed.');
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new Error('Token refresh failed.');
    } finally {
      this.#isRefreshing = false;
    }
  }

  async #handleRequest<T>(url: string, request: (accessToken: string) => Promise<T>): Promise<T> {
    try {
      return await request('');
    } catch (error: any) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        console.error('Unauthorized error (401), attempting token refresh...');
        try {
          await this.#refreshToken();
          const { accessToken } = await this.#getTokens();
          return await request(accessToken); // Retry the original request.
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          throw refreshError;
        }
      } else {
        console.error('HTTP Error:', error);
        throw error;
      }
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
    return this.#handleRequest(url, (accessToken: string = '') => {
      let updatedHeaders = headers;

      if (accessToken) {
        updatedHeaders = headers.set('Authorization', `Bearer ${accessToken}`);
      }

      return lastValueFrom(this.http.get<T>(url, { params, headers: updatedHeaders }));
    });
  }

  // Generic POST request
  async post<T>(
    url: string,
    body: any,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(url, () =>
      lastValueFrom(this.http.post<T>(url, body, { headers }))
    );
  }

  // Generic PUT request
  async put<T>(
    url: string,
    body: any,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(url, () =>
      lastValueFrom(this.http.put<T>(url, body, { headers }))
    );
  }

  // Generic DELETE request
  async delete<T>(
    url: string,
    additionalHeaders?: { [key: string]: string },
    isNeedAuthorization: boolean = false
  ): Promise<T> {
    const headers = await this.#mergeHeaders(isNeedAuthorization, additionalHeaders);
    return this.#handleRequest(url, () =>
      lastValueFrom(this.http.delete<T>(url, { headers }))
    );
  }
}
