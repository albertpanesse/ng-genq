import { assign, fromPromise, setup } from "xstate";
import { ICommonFunctionResult, IErrorResponsePayload, IFileExplorerCreatingResponsePayload, IFileExplorerListingResponsePayload, IFileExplorerPreviewingResponsePayload, IFileExplorerUploadingResponsePayload } from "../../types";
import { creating, deleting, listing, moving, uploading, previewing } from "../apis";
import { ApiService, CommonService, EAlertType, IAlert } from "..";
import { IRootContext } from ".";
import { IGlobalState } from "../../store";
import { Store } from "@ngrx/store";
import { setFileContentAction, setFileDirListAction, setUserFileAction } from "../../store/actions";
import { ICreateDirDTO, IFileDirListDTO, IPreviewFileDTO, IUploadFileDTO } from "../../dtos";

export interface IStateFileExplorerServices {
  apiService: ApiService;
  commonService: CommonService;
  store: Store<IGlobalState>;
}

export interface IStateFileExplorerContext {
  createDirDTO: ICreateDirDTO;
  fileDirListDTO: IFileDirListDTO;
  uploadFileDTO: IUploadFileDTO;
  previewFileDTO: IPreviewFileDTO;
  isError: boolean;
  errorDetails: any;
};

interface IStateFileExplorerEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

interface IEventFileExplorerUploadingParams {}

interface IEventFileExplorerMovingParams {}

interface IEventFileExplorerDeletingParams {}

interface IEventFileExplorerPreviewingParams {
  user_file_id: number;
  number_of_line: number;
}

export const fileExplorerStateMachine = setup({
  types: {
    context: {} as IRootContext<IStateFileExplorerServices, IStateFileExplorerContext>,
    events: {} as IStateFileExplorerEvent<'event_listing', IFileDirListDTO> |
      IStateFileExplorerEvent<'event_creating', ICreateDirDTO> |
      IStateFileExplorerEvent<'event_uploading', IUploadFileDTO> |
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
        createDirDTO: {} as ICreateDirDTO,
        fileDirListDTO: {} as IFileDirListDTO,
        uploadFileDTO: {} as IUploadFileDTO,
        previewFileDTO: {} as IPreviewFileDTO,
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
            actions: assign({
              context: ({ event }) => ({
                fileDirListDTO: event.params as IFileDirListDTO,
              } as IStateFileExplorerContext),
            }),
          },
          event_creating: {
            target: 'state_creating',
            actions: assign({
              context: ({ event }) => ({
                createDirDTO: event.params as ICreateDirDTO,
              } as IStateFileExplorerContext),
            }),
          },
          event_uploading: {
            target: 'state_uploading',
            actions: assign({
              context: ({ event }) => ({
                uploadFileDTO: event.params as IUploadFileDTO,
              } as IStateFileExplorerContext)
            }),
          },
          event_previewing: {
            target: 'state_previewing',
            actions: assign({
              context: ({ event }) => ({
                previewFileDTO: event.params as IPreviewFileDTO,
              } as IStateFileExplorerContext)
            }),
          },
        }
      },
      state_listing: {
        invoke: {
          src: 'actor_listing',
          input: ({ context: { services: { apiService }, context: { fileDirListDTO } } }) => ({ apiService, fileDirListDTO }),
          onDone: {
            target: 'state_afterListing',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                if (apiResponse?.success) {
                  const fileDirList = (apiResponse as ICommonFunctionResult<IFileExplorerListingResponsePayload>).functionResult;
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
      state_creating: {
        invoke: {
          src: 'actor_creating',
          input: ({ context: { services: { apiService }, context: { createDirDTO } } }) => ({ apiService, createDirDTO }),
          onDone: {
            target: 'state_afterCreating',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                if (apiResponse?.success) {
                  const newDir = (apiResponse as ICommonFunctionResult<IFileExplorerCreatingResponsePayload>).functionResult;
                  context.services.store.dispatch(setUserFileAction({ userFile: newDir }));
                } else {
                  context.context.isError = true;
                  context.context.errorDetails = (apiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
                }
              },
            ],
          },
        },
      },
      state_afterCreating: {
        always: [
          {
            guard: 'guard_isError',
            target: 'state_creatingError',
          },
          {
            target: 'state_creatingSuccess',
          },
        ],
      },
      state_creatingError: {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
        exit: [{ type: 'action_resetError' }],
      },
      state_creatingSuccess: {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
      },
      state_uploading: {
        invoke: {
          src: 'actor_uploading',
          input: ({ context: { services: { apiService }, context: { uploadFileDTO } } }) => ({ apiService, uploadFileDTO }),
          onDone: {
            target: 'state_afterUploading',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                if (apiResponse?.success) {
                  const uploadedFile = (apiResponse as ICommonFunctionResult<IFileExplorerUploadingResponsePayload>).functionResult;
                  context.services.store.dispatch(setUserFileAction({ userFile: uploadedFile }));
                } else {
                  context.context.isError = true;
                  context.context.errorDetails = (apiResponse as ICommonFunctionResult<IErrorResponsePayload>).functionResult;
                }
              },
            ],
          },
        },
      },
      state_afterUploading: {
        always: [
          {
            guard: 'guard_isError',
            target: 'state_uploadingError',
          },
          {
            target: 'state_uploadingSuccess',
          },
        ],
      },
      state_uploadingError: {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
        exit: [{ type: 'action_resetError' }],
      },
      state_uploadingSuccess: {
        entry: [{ type: 'action_showAlert' }],
        always: [{ target: 'state_idle' }],
      },
      state_previewing: {
        invoke: {
          src: 'actor_previewing',
          input: ({ context: { services: { apiService }, context: { previewFileDTO } } }) => ({ apiService, previewFileDTO }),
          onDone: {
            target: 'state_afterPreviewing',
            actions: [
              { type: 'action_resetError' },
              ({ context, event }) => {
                const apiResponse = event.output;
                if (apiResponse?.success) {
                  const fileContent = (apiResponse as ICommonFunctionResult<IFileExplorerPreviewingResponsePayload>).functionResult;
                  context.services.store.dispatch(setFileContentAction({ fileContent: fileContent.content }));
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
