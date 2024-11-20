import { Injectable } from '@angular/core';
import { createActor } from 'xstate';
import { Observable } from 'rxjs';

import { authStateMachine } from './state-machines/auth.machine';
import { CommonUIService, createAlert, EAlertType } from './common-ui.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authActor: any;

  constructor(private commonUIService: CommonUIService) {
    this.authActor = createActor(authStateMachine).start();

    this.authActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
      if (snapshot.value === 'signingInError') {
        this.commonUIService.setAlert(createAlert(EAlertType.AT_ERROR, 'ERror', 'ERROR!!!!!!!!!!'));
      }
    })
  }

  get state$(): Observable<any> {
    return new Observable(observer => {
      this.authActor.subscribe((state: any) => observer.next(state));
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
