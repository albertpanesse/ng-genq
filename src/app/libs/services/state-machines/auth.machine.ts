import { assign, emit, fromPromise, setup } from "xstate";
import { IUser } from "../../models";
import { signingIn, signingOut } from "../../apis";
import { IAuthSigningInResponsePayload, ICommonFunctionResult } from "../../types";
import { ApiService, CommonUIService, EAlertType, IAlert } from "../";
import { IRootContext } from ".";

export interface IStateAuthServices {
  apiService: ApiService;
  commonUIService: CommonUIService;
}

export interface IStateAuthContext {
  isSignedIn: boolean;
  user: IUser;
  accessToken: string;
  refreshToken: string;
  credential: TEventAuthSigningInParams;
  isAuthError: boolean;
  authError: TEventAuthSigningInErrorParams;
};

interface IStateAuthEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

type TEventAuthSigningInParams = {
  username: string;
  password: string;
}

type TEventAuthSigningInErrorParams = {
  message: string;
  path: string;
  statusCode: number;
  timestamp: string;
}

export const authStateMachine = setup({
  types: {
    context: {} as IRootContext<IStateAuthServices, IStateAuthContext>,
    events: {} as IStateAuthEvent<'event.signingIn', TEventAuthSigningInParams> | 
      IStateAuthEvent<'event.signingInError', TEventAuthSigningInErrorParams> |
      IStateAuthEvent<'event.signingOut'>,
  },
  actions: {
    resetAuth: assign({
      context: {
        isSignedIn: false,
        user: {} as IUser,
        accessToken: '',
        refreshToken: '',
      } as IStateAuthContext,
    }),
    resetError: assign({
      context: {
        isAuthError: false,
        authError: {} as TEventAuthSigningInErrorParams,
      } as IStateAuthContext,
    }),
    resetCredential: assign({
      context: {
        credential: {} as TEventAuthSigningInParams,
      } as IStateAuthContext,
    }),
    showAuthErrorAlert: ({ context }) => {
      context.services.commonUIService.setAlert({
        type: EAlertType.AT_ERROR,
        title: 'Authentication Error',
        message: context.context.authError.message,
      } as IAlert);
    },
    successSigningInRedirect: ({ context }) => {
      context.services.commonUIService.pageRedirect('/');
    },
  },
  actors: {    
    'actorSigningIn': fromPromise(signingIn),
    'actorSigningOut': fromPromise(signingOut),
  },
  guards: {
    isAuthError: ({ context }) => context.context.isAuthError,
  },
})
  .createMachine({
    id: 'authStateMachine',
    context: ({ input }: any) => ({
      services: {
        apiService: input.services.apiService,
        commonUIService: input.services.commonUIService,
      },
      context: {
        isSignedIn: input.context.isSignedIn || false,
        user: input.context.user || {} as IUser,
        accessToken: input.context.accessToken || '',
        refreshToken: input.context.refreshToken || '',
        credential: input.context.credential || {} as TEventAuthSigningInParams,
        isAuthError: input.context.isAuthError || false,
        authError: input.context.authError || {} as TEventAuthSigningInErrorParams,
      },
    }),
    initial: 'idle',
    states: {
      'idle': {
        on: {
          'event.signingIn': {
            target: 'signingIn',
            actions: assign({
              context: ({ event }) => ({
                credential: event.params as TEventAuthSigningInParams,
              } as IStateAuthContext),
            }),
          }
        }
      },
      'signingIn': {
        invoke: {
          src: 'actorSigningIn',
          input: ({ context: { services: { apiService }, context: { credential } } }) => ({ apiService, credential }),
          onDone: {
            target: 'afterSigningIn',
            actions: [
              { type: 'resetCredential' },
              { type: 'resetAuth' },
              { type: 'resetError' },
              ({ context, event }) => {
                const authApiResponse = event.output;
                context.context.credential = {} as TEventAuthSigningInParams;
                if (authApiResponse?.success) {
                  const { accessToken, refreshToken } = (authApiResponse as ICommonFunctionResult<IAuthSigningInResponsePayload>).functionResult;
                  context.context.isSignedIn = true;
                  context.context.accessToken = accessToken;
                  context.context.refreshToken = refreshToken;
                } else {
                  context.context.isAuthError = true;
                  context.context.authError = (authApiResponse as ICommonFunctionResult<TEventAuthSigningInErrorParams>).functionResult;
                }
              },
            ],
          },
        },
      },
      'afterSigningIn': {
        always: [
          {
            guard: 'isAuthError',
            target: 'signingInError',
          },
          {
            target: 'signedIn',
          },
        ],
      },
      'signingInError': {        
        entry: [{ type: 'showAuthErrorAlert' }],
        exit: [{ type: 'resetError' }],
      },
      'signingOut': {
        invoke: {
          src: 'actorSigningOut',
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
        entry: [{ type: 'successSigningInRedirect' }],
        on: {
          'event.signingOut': {
            target: 'signingOut',
          }
        }
      },
      'signedOut': {},
    }
  });
