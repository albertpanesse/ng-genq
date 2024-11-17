// auth.service.ts
import { Injectable } from '@angular/core';
import { createActor } from 'xstate';
import { Observable } from 'rxjs';

import { AlertService, EAlertType, IAlert } from '../services/alert.service';
import { authStateMachine } from './state-machines/auth.machine';
import { createAlert } from './helpers/alert.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authActor: any;

  constructor(private alertService: AlertService) {
    this.authActor = createActor(authStateMachine).start();

    this.authActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
      if (snapshot.value === 'signingInError') {
        const alert = createAlert('Error', 'Error jee mas!', EAlertType.ERROR);
        this.alertService.display(alert);  
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
