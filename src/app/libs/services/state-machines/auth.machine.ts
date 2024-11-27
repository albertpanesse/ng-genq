import { assign, fromPromise, setup } from "xstate";
import { Store } from "@ngrx/store";

import { IUser } from "../../models";
import { signingIn } from "../apis";
import { IAuthSigningInResponsePayload, ICommonFunctionResult, IErrorResponsePayload } from "../../types";
import { ApiService, CommonService, EAlertType, IAlert } from "../";
import { IRootContext } from ".";
import { IGlobalState } from "../store";

export interface IStateAuthServices {
  apiService: ApiService;
  commonService: CommonService;
  store: Store<IGlobalState>;
}

export interface IStateAuthContext {
  isSignedIn: boolean;
  user: IUser;
  accessToken: string;
  refreshToken: string;
  credential: TEventAuthSigningInParams;
  isAuthError: boolean;
  authError: IErrorResponsePayload;
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
    context: {} as IRootContext<IStateAuthServices, IStateAuthContext>,
    events: {} as IStateAuthEvent<'event.signingIn', TEventAuthSigningInParams> | 
      IStateAuthEvent<'event.signingInError', IErrorResponsePayload> |
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
        authError: {} as IErrorResponsePayload,
      } as IStateAuthContext,
    }),
    resetCredential: assign({
      context: {
        credential: {} as TEventAuthSigningInParams,
      } as IStateAuthContext,
    }),
    showAuthErrorAlert: ({ context }) => {
      context.services.commonService.setAlert({
        type: EAlertType.AT_ERROR,
        title: 'Authentication Error',
        message: context.context.authError.message,
      } as IAlert);
    },
    redirectToTop: ({ context }) => {
      context.services.commonService.pageRedirect('');
    },
  },
  actors: {    
    'actorSigningIn': fromPromise(signingIn),
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
        commonService: input.services.commonService,
        store: input.services.store,
      },
      context: {
        isSignedIn: input.context.isSignedIn || false,
        user: input.context.user || {} as IUser,
        accessToken: input.context.accessToken || '',
        refreshToken: input.context.refreshToken || '',
        credential: {} as TEventAuthSigningInParams,
        isAuthError: false,
        authError: {} as IErrorResponsePayload,
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
          },
          'event.signingOut': {
            target: 'signingOut',
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
                  context.context.authError = (authApiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
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
        always: [{ target: 'idle' }],
        exit: [{ type: 'resetError' }],
      },
      'signedIn': {
        entry: [{ type: 'redirectToTop' }],
        always: [{ target: 'idle' }],
      },
      'signingOut': {
        always: [
          {
            target: 'afterSigningOut',
            actions: [
              { type: 'resetError' },
              { type: 'resetAuth' },
            ],    
          }
        ],
      },
      'afterSigningOut': {
        always: [{ target: 'signedOut' }],
      },
      'signedOut': {
        entry: [{ type: 'redirectToTop' }],
        always: [{ target: 'idle', actions: [() => window.location.reload()] }],
      },
    }
  });
