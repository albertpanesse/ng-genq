import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { AlertComponent } from '../components/alert/alert.component';
import { EAlertType, IAlert } from '../alert.service';

export const createAlert = function(title: string, message: string, type: EAlertType = EAlertType.INFO, timeout: number = 3000): IAlert {
  return {
    type,
    title,
    message,
    timeout,
  } as IAlert;
}

export const showAlert = function(
  title: string,
  message: string,
  appRef: ApplicationRef,
  injector: EnvironmentInjector
): void {
  const alertRef: ComponentRef<AlertComponent> = createComponent(AlertComponent, {
    environmentInjector: injector,
  });

  appRef.attachView(alertRef.hostView);
  const domElem = (alertRef.hostView as any).rootNodes[0] as HTMLElement;
  document.body.appendChild(domElem);

  alertRef.instance.title = title;
  alertRef.instance.message = message;
}
