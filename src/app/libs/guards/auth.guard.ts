import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    
    const isUserLoggedIn = this.authService.isLoggedIn();
    if (isUserLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
