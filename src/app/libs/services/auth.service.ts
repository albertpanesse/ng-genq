import { Injectable } from '@angular/core';
import { createActor, Snapshot } from 'xstate';
import { Observable } from 'rxjs';

import { authStateMachine, IStateAuthContext } from './state-machines';
import { ApiService, CommonUIService } from './';
import { IAuthCredential } from '../types';
import { IUser } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authActor: any;

  constructor(private apiService: ApiService, private commonUIService: CommonUIService) {
    const authMachineContext: IStateAuthContext = JSON.parse(localStorage.getItem('authMachineContext') as string);
    this.authActor = createActor(authStateMachine, {
      input: {
        services: {
          apiService: this.apiService,
          commonUIService: this.commonUIService,  
        },
        context: { ...authMachineContext },
      },
    }).start();

    this.authActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
      localStorage.setItem('authMachineContext', JSON.stringify(snapshot.context.context));
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
    this.authActor.send({ type: 'event.signingIn', params: authCredential });
  }

  signOut() {
    this.authActor.send({ type: 'event.signingOut' });
  }
}
