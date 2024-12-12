import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { lastValueFrom, take } from 'rxjs';
import { IGlobalState } from '../store';
import { isUserLoggedInSelector } from '../store/selectors';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private store: Store<IGlobalState>, private router: Router) {}

  async canActivate(): Promise<boolean> {
    
    const isUserLoggedIn = await lastValueFrom(this.store.select(isUserLoggedInSelector).pipe(take(1)));
    if (isUserLoggedIn) {
      return true;
    } else {
      this.router.navigate(['/sign-in']);
      return false;
    }
  }
}
