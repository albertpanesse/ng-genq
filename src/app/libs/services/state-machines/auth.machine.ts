import { assign, fromPromise, setup } from "xstate";
import { IUser } from "../../models";
import { signingIn, signingOut } from "../../apis";
import { IAuthSigningInResponsePayload, ICommonFunctionResult } from "../../types";

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
  actors: {
    'actor.signingIn': fromPromise(signingIn),
    'actor.signingOut': fromPromise(signingOut),
  },
})
  .createMachine({
    id: 'authStateMachine',
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
            actions: assign({
              credential: ({ event }) => event.params as TEventAuthSigningInParams,
            }),
          }
        }
      },
      'signingIn': {
        invoke: {
          src: 'actor.signingIn',
          input: ({ context: { credential } }) => ({ credential }),
          onDone: {
            target: 'signedIn',
            actions: [({ context, event }) => {
              if (event.output && event.output.success) {
                const payload = event.output as ICommonFunctionResult<IAuthSigningInResponsePayload>;
                context = {
                  ...context,
                  ...payload,
                };
              }
            }],
          },
          onError: {
            target: 'signingInError',
          }
        }
      },
      'signingInError': {},
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
            target: 'signingOutError',
          }
        }
      },
      'signingOutError': {},
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
