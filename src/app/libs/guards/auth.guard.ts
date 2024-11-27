import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { StoreService } from '../services';
import { lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storeService: StoreService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    
    const isUserLoggedIn = await lastValueFrom(this.storeService.getIsUserLoggedInState().pipe(take(1)));
    if (isUserLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
