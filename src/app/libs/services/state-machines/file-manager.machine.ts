import { assign, fromPromise, setup } from "xstate";
import { ICommonFunctionResult, IErrorResponsePayload, IUserFile, TFileManagerListingResponsePayload } from "../../types";
import { creating, deleting, listing, moving, uploading } from "../apis";
import { ApiService, CommonService, EAlertType, IAlert } from "../";
import { IRootContext } from ".";

export interface IStateFileManagerServices {
  apiService: ApiService;
  commonService: CommonService;
}

export interface IStateFileManagerContext {
  fileDirList: IUserFile[];
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
    events: {} as IStateFileManagerEvent<'event.listing'> | 
      IStateFileManagerEvent<'event.uploading', TEventFileManagerUploadingParams> | 
      IStateFileManagerEvent<'event.creating', TEventFileManagerCreatingParams> | 
      IStateFileManagerEvent<'event.moving', TEventFileManagerMovingParams> | 
      IStateFileManagerEvent<'event.deleting', TEventFileManagerDeletingParams>,
  },
  actions: {
    resetError: assign({
      context: {
        isError: false,
        errorDetails: null,
      } as IStateFileManagerContext,
    }),
    showAlert: ({ context }) => {
      context.services.commonService.setAlert({
        type: EAlertType.AT_ERROR,
        title: 'Error',
        message: context.context.errorDetails.message,
      } as IAlert);
    },
  },
  actors: {
    'actorListing': fromPromise(listing),
    'actorUploading': fromPromise(uploading),
    'actorCreating': fromPromise(creating),
    'actorMoving': fromPromise(moving),
    'actorDeleting': fromPromise(deleting),
  },
  guards: {
    isError: ({ context }) => context.context.isError,
  },
})
  .createMachine({
    id: 'fileManagerStateMachine',
    context: ({ input }: any) => ({
      services: {
        apiService: input.services.apiService,
        commonService: input.services.commonService,
      },
      context: {
        fileDirList: [],
        dirName: '',
        isError: false,
        errorDetails: null,
      },
    }),
    initial: 'idle',
    states: {
      'idle': {
        on: {
          'event.listing': {
            target: 'listing',
          },
          'event.creating': {
            target: 'creating',
            actions: assign({
              context: ({ event }) => ({
                dirName: event.params?.dirName,
              } as IStateFileManagerContext),
            }),
          },
        }
      },
      'listing': {
        invoke: {
          src: 'actorListing',
          input: ({ context: { services: { apiService } } }) => ({ apiService }),
          onDone: {
            target: 'afterListing',
            actions: [
              { type: 'resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                context.context.fileDirList = [];
                if (apiResponse?.success) {
                  context.context.fileDirList = (apiResponse as ICommonFunctionResult<TFileManagerListingResponsePayload>).functionResult;
                } else {
                  context.context.isError = true;
                  context.context.errorDetails = (apiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
                }
              },
            ],
          },
        },
      },
      'afterListing': {
        always: [
          {
            guard: 'isError',
            target: 'listingError',
          },
          {
            target: 'listingSuccess',
          },
        ],
      },
      'listingError': {
        entry: [{ type: 'showAlert' }],
        always: [{ target: 'idle' }],
        exit: [{ type: 'resetError' }],
      },
      'listingSuccess': {
        entry: [({ event }) => {
          console.log('event', event);
        }],
        always: [{ target: 'idle' }],
      },
      'creating': {},
    }
  });
