import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(user: any) {
    return this.http.post(`${this.apiUrl}/auth/login`, user);
  }

  loginWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }

  registerWithGoogle() {
    window.location.href = `${this.apiUrl}/auth/google`;
  }
}
