import { assign, setup } from "xstate";

import { IAlert } from "../alert.service";
import { ApplicationRef, EnvironmentInjector } from "@angular/core";
import { showAlert } from "../helpers/alert.helper";

export interface IStateAlertContext {
  appRef: ApplicationRef | null;
  injector: EnvironmentInjector | null;
  alert: IAlert | null;
};

interface IStateAlertEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

export const alertStateMachine = setup({
  types: {
    context: {} as IStateAlertContext,
    events: {} as IStateAlertEvent<'event.displaying', { alert: IAlert }> | IStateAlertEvent<'event.undisplaying'>,
  },
  actions: {
    displayAlert: ({ context }) => {
      if (context.alert && context.appRef && context.injector) {
        showAlert(context.alert.title, context.alert.message, context.appRef, context.injector);
      }
    },
  },
  delays: {
    timeout: ({ context }) => context.alert?.timeout || 3000, 
  }
})
  .createMachine({
    id: 'alertStateMachine',
    context: ({ input }) => ({
      appRef: (input as any).appRef,
      injector: (input as any).injector,
      alert: null,
    }),
    initial: 'undisplayed',
    states: {
      undisplayed: {
        on: {
          'event.displaying': {
            target: 'displayed',
            actions: [
              assign({
                alert: ({ event }) => event.params?.alert as IAlert
              }),
              { type: 'displayAlert' },
            ],
          },
        },
        entry: assign({ alert: null }),
      },
      displayed: {
        after: {
          timeout: {
            target: 'undisplayed',
          }
        },
        on: {
          'event.undisplaying': {
            target: 'undisplayed',
          }
        }
      },
    },
  });