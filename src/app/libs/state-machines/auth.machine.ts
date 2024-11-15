import { fromPromise, setup } from "xstate";
import { IUser } from "../models";
import { signingIn, signingOut } from "../apis";

export interface IStateAuthContext {
  isSignedIn: boolean;
  user: IUser | null;
  accessToken: string;
  refreshToken: string;
  credential: TEventAuthSigningInParams;
};

interface IStateAuthEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

type TEventAuthSigningInParams = {
  username: string;
  password: string;
}

export const authStateMachine = setup({
  types: {
    context: {} as IStateAuthContext,
    events: {} as IStateAuthEvent<'event.signingIn', TEventAuthSigningInParams> | IStateAuthEvent<'event.signingOut'>,
  },
  actions: {
    updateContext: (_, params: any) => {},
  },
  actors: {
    'actor.signingIn': fromPromise(signingIn),
    'actor.signingOut': fromPromise(signingOut),
  },
})
  .createMachine({
    id: 'authMachine',
    context: {
      isSignedIn: false,
      user: null,
      accessToken: '',
      refreshToken: '',
      credential: {} as TEventAuthSigningInParams,
    },
    initial: 'signedOut',
    states: {
      'signedOut': {
        on: {
          'event.signingIn': {
            target: 'signingIn',
            actions: ({ context, event }) => (context.credential = event.params as TEventAuthSigningInParams),
          }
        }
      },
      'signingIn': {
        invoke: {
          src: 'actor.signingIn',
          input: ({ context: { credential } }) => ({ credential }),
          onDone: {
            target: 'signedIn',
            actions: [
              { type: 'updateContext', params: {} }
            ],
          },
          onError: {
            target: 'signingInRetry',
          }
        }
      },
      'signingInRetry': {
        type: 'final',
      },
      'signingOut': {
        invoke: {
          src: 'actor.signingOut',
          onDone: {
            target: 'signedOut',
          },
          onError: {
            target: 'signingOutRetry',
          }
        }
      },
      'signingOutRetry': {
        type: 'final',
      },
      'signedIn': {
        on: {
          'event.signingOut': {
            target: 'signingOut',
          }
        }
      }
    }
  });
