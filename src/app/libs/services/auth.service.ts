import { Injectable } from '@angular/core';
import { createActor } from 'xstate';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { authStateMachine, IStateAuthContext } from './state-machines';
import { ApiService, CommonService } from '.';
import { IAuthCredential } from '../types';
import { IUser } from '../models';
import { IGlobalState } from './store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authActor: any;

  constructor(private store: Store<IGlobalState>, private apiService: ApiService, private commonService: CommonService) {
    this.authActor = createActor(authStateMachine, {
      input: {
        services: {
          apiService: this.apiService,
          commonService: this.commonService,  
          authService: this,
        },
      },
    }).start();

    this.authActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
    });
  }

  get state$(): Observable<any> {
    return new Observable(observer => {
      this.authActor.subscribe((state: any) => observer.next(state));
    });
  }

  isLoggedIn(): boolean {
    const snapshot = this.authActor.getSnapshot();
    return snapshot.context.context.isSignedIn;
  }

  getCurrentLoggedInUser(): IUser {
    const snapshot = this.authActor.getSnapshot();
    return snapshot.context.context.user;
  }

  signIn(authCredential: IAuthCredential) {
    this.authActor.send({ type: 'event_signingIn', params: authCredential });
  }

  signOut() {
    this.authActor.send({ type: 'event_signingOut' });
  }
}
