// auth.service.ts
import { ApplicationRef, EnvironmentInjector, Injectable } from '@angular/core';
import { createActor } from 'xstate';
import { Observable } from 'rxjs';

import { alertStateMachine } from './state-machines/alert.machine';

export enum EAlertType {
  INFO,
  WARN,
  ERROR
}

export interface IAlert {
  type: EAlertType;
  title: string;
  message: string;
  timeout: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertActor: any;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector,
  ) {
    this.alertActor = createActor(alertStateMachine, {
      input: {
        appRef: this.appRef,
        injector: this.injector,
      }
    }).start();

    this.alertActor.subscribe((snapshot: any) => {
      console.log('snapshot', snapshot);
    });
  }

  get state$(): Observable<any> {
    return new Observable(observer => {
      this.alertActor.subscribe((state: any) => observer.next(state));
    });
  }

  display(alert: IAlert ) {    
    this.alertActor.send({ type: 'event.displaying', params: { alert } });
  }

  undisplay() {
    this.alertActor.send({ type: 'event.undisplaying' });
  }
}
