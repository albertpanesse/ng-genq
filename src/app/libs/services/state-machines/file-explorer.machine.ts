import { assign, fromPromise, setup } from "xstate";
import { ICommonFunctionResult, TFileExplorerListingResponsePayload, IErrorResponsePayload, TFileExplorerPreviewingResponsePayload } from "../../types";
import { creating, deleting, listing, moving, uploading, previewing } from "../apis";
import { ApiService, CommonService, EAlertType, IAlert } from "..";
import { IRootContext } from ".";
import { IGlobalState } from "../../store";
import { Store } from "@ngrx/store";
import { setFileContentAction, setFileDirListAction } from "../../store/actions";

export interface IStateFileExplorerServices {
  apiService: ApiService;
  commonService: CommonService;
  store: Store<IGlobalState>;
}

export interface IStateFileExplorerContext {
  dirName: string;
  params: {
    previewing: IEventFileExplorerPreviewingParams;
  };
  isError: boolean;
  errorDetails: any;
};

interface IStateFileExplorerEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

interface IEventFileExplorerUploadingParams {}

interface IEventFileExplorerCreatingParams {
  dirName: string;
}

interface IEventFileExplorerMovingParams {}

interface IEventFileExplorerDeletingParams {}

interface IEventFileExplorerPreviewingParams {
  userFileId: number;
  numberOfLine: number;
}

export const fileExplorerStateMachine = setup({
  types: {
    context: {} as IRootContext<IStateFileExplorerServices, IStateFileExplorerContext>,
    events: {} as IStateFileExplorerEvent<'event_listing'> | 
      IStateFileExplorerEvent<'event_uploading', IEventFileExplorerUploadingParams> | 
      IStateFileExplorerEvent<'event_creating', IEventFileExplorerCreatingParams> | 
      IStateFileExplorerEvent<'event_moving', IEventFileExplorerMovingParams> | 
      IStateFileExplorerEvent<'event_deleting', IEventFileExplorerDeletingParams> |
      IStateFileExplorerEvent<'event_previewing', IEventFileExplorerPreviewingParams>,
  },
  actions: {
    action_resetError: assign({
      context: {
        isError: false,
        errorDetails: null,
      } as IStateFileExplorerContext,
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
    actor_listing: fromPromise(listing),
    actor_uploading: fromPromise(uploading),
    actor_creating: fromPromise(creating),
    actor_moving: fromPromise(moving),
    actor_deleting: fromPromise(deleting),
    actor_previewing: fromPromise(previewing),
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
        params: {
          previewing: {
            userFileId: -1,
            numberOfLine: 0,
          }
        },
        isError: false,
        errorDetails: null,
      },
    }),
    initial: 'state_idle',
    states: {
      state_idle: {
        on: {
          event_listing: {
            target: 'state_listing',
          },
          event_creating: {
            target: 'state_creating',
            actions: assign({
              context: ({ event }) => ({
                dirName: event.params?.dirName,
              } as IStateFileExplorerContext),
            }),
          },
          event_previewing: {
            target: 'state_previewing',
            actions: assign({
              context: ({ event }) => ({
                params: {
                  previewing: event.params,
                },
              } as IStateFileExplorerContext)
            }),
          },
        }
      },
      state_listing: {
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
                  const fileDirList = (apiResponse as ICommonFunctionResult<TFileExplorerListingResponsePayload>).functionResult;
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
      state_afterListing: {
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
      state_listingError: {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
        exit: [{ type: 'action_resetError' }],
      },
      state_listingSuccess: {
        always: [{ target: 'state_idle' }],
      },
      state_creating: {},
      state_previewing: {
        invoke: {
          src: 'actor_previewing',
          input: ({ context: { services: { apiService }, context: { params } } }) => ({ apiService, params: params.previewing }),
          onDone: {
            target: 'state_afterPreviewing',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                if (apiResponse?.success) {
                  const fileContent = (apiResponse as ICommonFunctionResult<TFileExplorerPreviewingResponsePayload>).functionResult;
                  context.services.store.dispatch(setFileContentAction({ fileContent }));
                } else {
                  context.context.isError = true;
                  context.context.errorDetails = (apiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
                }
              },
            ],
          },
        },
      },
      state_afterPreviewing: {
        always: [
          {
            guard: 'guard_isError',
            target: 'state_previewingError',
          },
          {
            target: 'state_previewingSuccess',
          },
        ],
      },
      state_previewingError: {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
        exit: [{ type: 'action_resetError' }],
      },
      state_previewingSuccess: {
        always: [{ target: 'state_idle' }],
      },
    }
  });
