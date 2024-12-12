import { assign, fromPromise, setup } from "xstate";
import { ICommonFunctionResult, IErrorResponsePayload, TFileManagerListingResponsePayload } from "../../types";
import { creating, deleting, listing, moving, uploading } from "../apis";
import { ApiService, CommonService, EAlertType, IAlert } from "../";
import { IRootContext } from ".";
import { IGlobalState } from "../../store";
import { Store } from "@ngrx/store";
import { setFileDirListAction } from "../../store/actions";

export interface IStateFileManagerServices {
  apiService: ApiService;
  commonService: CommonService;
  store: Store<IGlobalState>;
}

export interface IStateFileManagerContext {
  dirName: string;
  isError: boolean;
  errorDetails: any;
};

interface IStateFileManagerEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

interface TEventFileManagerUploadingParams {}

interface TEventFileManagerCreatingParams {
  dirName: string;
}

interface TEventFileManagerMovingParams {}

interface TEventFileManagerDeletingParams {}

export const fileManagerStateMachine = setup({
  types: {
    context: {} as IRootContext<IStateFileManagerServices, IStateFileManagerContext>,
    events: {} as IStateFileManagerEvent<'event_listing'> | 
      IStateFileManagerEvent<'event_uploading', TEventFileManagerUploadingParams> | 
      IStateFileManagerEvent<'event_creating', TEventFileManagerCreatingParams> | 
      IStateFileManagerEvent<'event_moving', TEventFileManagerMovingParams> | 
      IStateFileManagerEvent<'event_deleting', TEventFileManagerDeletingParams>,
  },
  actions: {
    action_resetError: assign({
      context: {
        isError: false,
        errorDetails: null,
      } as IStateFileManagerContext,
    }),
    action_showAlert: ({ context }) => {
      context.services.commonService.setAlert({
        type: EAlertType.AT_ERROR,
        title: 'Error',
        message: context.context.errorDetails?.message,
      } as IAlert);
    },
  },
  actors: {
    'actor_listing': fromPromise(listing),
    'actor_uploading': fromPromise(uploading),
    'actor_creating': fromPromise(creating),
    'actor_moving': fromPromise(moving),
    'actor_deleting': fromPromise(deleting),
  },
  guards: {
    guard_isError: ({ context }) => context.context.isError,
  },
})
  .createMachine({
    id: 'fileManagerStateMachine',
    context: ({ input }: any) => ({
      services: {
        apiService: input.services.apiService,
        commonService: input.services.commonService,
        store: input.services.store,
      },
      context: {
        dirName: '',
        isError: false,
        errorDetails: null,
      },
    }),
    initial: 'state_idle',
    states: {
      'state_idle': {
        on: {
          'event_listing': {
            target: 'state_listing',
          },
          'event_creating': {
            target: 'state_creating',
            actions: assign({
              context: ({ event }) => ({
                dirName: event.params?.dirName,
              } as IStateFileManagerContext),
            }),
          },
        }
      },
      'state_listing': {
        invoke: {
          src: 'actor_listing',
          input: ({ context: { services: { apiService } } }) => ({ apiService }),
          onDone: {
            target: 'state_afterListing',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                if (apiResponse?.success) {
                  const fileDirList = (apiResponse as ICommonFunctionResult<TFileManagerListingResponsePayload>).functionResult;
                  context.services.store.dispatch(setFileDirListAction({ fileDirList }));
                } else {
                  context.context.isError = true;
                  context.context.errorDetails = (apiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
                }
              },
            ],
          },
        },
      },
      'state_afterListing': {
        always: [
          {
            guard: 'guard_isError',
            target: 'state_listingError',
          },
          {
            target: 'state_listingSuccess',
          },
        ],
      },
      'state_listingError': {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
        exit: [{ type: 'action_resetError' }],
      },
      'state_listingSuccess': {
        always: [{ target: 'state_idle' }],
      },
      'state_creating': {},
    }
  });
