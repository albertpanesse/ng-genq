// auth.service.ts
import { Injectable } from '@angular/core';
import { createActor } from 'xstate';
import { Observable } from 'rxjs';

import { authStateMachine, IStateAuthContext } from '../state-machines/auth.machine';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authActor = createActor(authStateMachine);

  constructor() {
    this.authActor.start();
    this.authActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
    });
  }

  get state$(): Observable<any> {
    return new Observable(observer => {
      this.authActor.subscribe(state => observer.next(state));
    });
  }

  signIn(authCredential: IAuthCredential) {
    this.authActor.send({ type: 'event.signingIn', params: authCredential });
  }

  signOut() {
    this.authActor.send({ type: 'event.signingOut' });
  }
}

export interface IAuthCredential {
  username: string;
  password: string;
}
