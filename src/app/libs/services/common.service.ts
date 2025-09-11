import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

const DEFAULT_TIMEOUT = 3000;

export enum EAlertType {
  AT_INFO,
  AT_WARNING,
  AT_ERROR,
}

export interface IAlert {
  type: EAlertType;
  title: string;
  message: string;
  timeout: number;
  triggered: boolean;
}

export const createAlert = function(type: EAlertType, title: string, message: string) {
  return {
    type,
    title,
    message,
    timeout: DEFAULT_TIMEOUT,
    triggered: false,
  };
}

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private _alertSubject$: BehaviorSubject<IAlert[]> = new BehaviorSubject([] as IAlert[]);
  private _loaderSubject$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private router: Router) {}

  getAlertSubject(): BehaviorSubject<IAlert[]> {
    return this._alertSubject$;
  }

  setLoader(isLoading: boolean): void {
    this._loaderSubject$.next(isLoading);
  }

  getLoaderSubject(): BehaviorSubject<boolean> {
    return this._loaderSubject$;
  }
  
  setAlert(alert: IAlert): void {
    const currentAlerts = this._alertSubject$.getValue() as IAlert[];
    currentAlerts.push(alert);
    this._alertSubject$.next(currentAlerts);
  }

  resetAlert(): void {
    this._alertSubject$.next([]);
  }

  getTokens(): { accessToken: string; refreshToken: string } {
    return {
      accessToken: '',
      refreshToken: '',
    };
  }

  pageRedirect(path: string): void {
    this.router.navigate([path], { replaceUrl: true });
  }
}