import { assign, fromPromise, setup } from "xstate";
import { Store } from "@ngrx/store";

import { IUser } from "../../models";
import { signingIn } from "../apis";
import { IAuthSigningInResponsePayload, ICommonFunctionResult, IErrorResponsePayload } from "../../types";
import { ApiService, CommonService, EAlertType, IAlert } from "../";
import { IRootContext } from ".";
import { IGlobalState } from "../../store";
import { setIsUserLoggedInAction, setTokensAction } from "../../store/actions";

export interface IStateAuthServices {
  apiService: ApiService;
  commonService: CommonService;
  store: Store<IGlobalState>;
}

export interface IStateAuthContext {
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
    events: {} as IStateAuthEvent<'event_signingIn', TEventAuthSigningInParams> | IStateAuthEvent<'event_signingOut'>,
  },
  actions: {
    action_resetError: assign({
      context: {
        isAuthError: false,
        authError: {} as IErrorResponsePayload,
      } as IStateAuthContext,
    }),
    action_resetCredential: assign({
      context: {
        credential: {} as TEventAuthSigningInParams,
      } as IStateAuthContext,
    }),
    action_showAuthErrorAlert: ({ context }) => {
      context.services.commonService.setAlert({
        type: EAlertType.AT_ERROR,
        title: 'Authentication Error',
        message: context.context.authError.message,
      } as IAlert);
    },
  },
  actors: {    
    actor_signingIn: fromPromise(signingIn),
  },
  guards: {
    guard_isAuthError: ({ context }) => context.context.isAuthError,
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
        credential: {} as TEventAuthSigningInParams,
        isAuthError: false,
        authError: {} as IErrorResponsePayload,
      },
    }),
    initial: 'state_idle',
    states: {
      state_idle: {
        on: {
          event_signingIn: {
            target: 'state_signingIn',
            actions: [
              assign({
                context: ({ event }) => ({
                  credential: event.params as TEventAuthSigningInParams,
                } as IStateAuthContext),
              }),
            ],
          },
          event_signingOut: {
            target: 'state_signingOut',
          }
        }
      },
      state_signingIn: {
        entry: [({ context }) => context.services.commonService.setLoader(true)],
        invoke: {
          src: 'actor_signingIn',
          input: ({ context: { services: { apiService }, context: { credential } } }) => ({ apiService, credential }),
          onDone: {
            target: 'state_afterSigningIn',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const authApiResponse = event.output;
                context.context.credential = {} as TEventAuthSigningInParams;
                if (authApiResponse?.success) {
                  const { accessToken, refreshToken } = (authApiResponse as ICommonFunctionResult<IAuthSigningInResponsePayload>).functionResult;
                  context.services.store.dispatch(setIsUserLoggedInAction({ isUserLoggedIn: true }));
                  context.services.store.dispatch(setTokensAction({ accessToken, refreshToken }));
                } else {
                  context.context.isAuthError = true;
                  context.context.authError = (authApiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
                }
              },
            ],
          },
        },
      },
      state_afterSigningIn: {
        always: [
          {
            guard: 'guard_isAuthError',
            target: 'state_signingInError',
          },
          {
            target: 'state_signedIn',
          },
        ],
      },
      state_signingInError: {        
        entry: [{ type: 'action_showAuthErrorAlert' }],
        always: [{ target: 'state_idle' }],
        exit: [{ type: 'action_resetError' }],
      },
      state_signedIn: {
        always: [{ target: 'state_idle' }],
      },
      state_signingOut: {
        entry: [({ context }) => context.services.commonService.setLoader(true)],
        always: [
          {
            target: 'state_afterSigningOut',
            actions: [
              { type: 'action_resetError' },
              ({ context }) => context.services.store.dispatch(setIsUserLoggedInAction({ isUserLoggedIn: false })),
            ],    
          }
        ],
      },
      state_afterSigningOut: {
        always: [{ target: 'state_signedOut' }],
      },
      state_signedOut: {
        always: [{ target: 'state_idle', actions: [() => window.location.reload()] }],
      },
    }
  });
