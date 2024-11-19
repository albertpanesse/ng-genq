import { assign, fromPromise, setup } from "xstate";
import { ICommonFunctionResult, IFileManagerUploadingResponsePayload } from "../types";
import { deleting, uploading } from "../apis/file-manager.api";

export interface IStateFileManagerContext {};

interface IStateFileManagerEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

interface TEventFileManagerUploadingParams {}

interface TEventFileManagerDeletingParams {}

export const fileManagerStateMachine = setup({
  types: {
    context: {} as IStateFileManagerContext,
    events: {} as 
      IStateFileManagerEvent<'event.uploading', TEventFileManagerUploadingParams> | 
      IStateFileManagerEvent<'event.deleting', TEventFileManagerDeletingParams>,
  },
  actors: {
    'actor.uploading': fromPromise(uploading),
    'actor.deleting': fromPromise(deleting),
  },
})
  .createMachine({
    id: 'fileManagerStateMachine',
    context: {},
    initial: 'idle',
    states: {
      'idle': {
        on: {
          'event.uploading': {
            target: 'uploading',
            actions: assign({
              credential: ({ event }) => event.params as TEventFileManagerUploadingParams,
            }),
          },
          'event.deleting': {
            target: 'deleting',
            actions: assign({
              credential: ({ event }) => event.params as TEventFileManagerDeletingParams,
            }),
          },
        }
      },
      'uploading': {
        invoke: {
          src: 'actor.uploading',
          input: {},
          onDone: {
            target: 'uploaded',
            actions: [({ context, event }) => {
              if (event.output && event.output.success) {
                const payload = event.output as ICommonFunctionResult<IFileManagerUploadingResponsePayload>;
                context = {
                  ...context,
                  ...payload,
                };
              }
            }],
          },
          onError: {
            target: 'uploadingError',
          }
        }
      },
      'uploaded': {
        target: 'idle',
      },
      'uploadingError': {},
      'uploadingRetry': {
        type: 'final',
      },
      'deleting': {
        invoke: {
          src: 'actor.deleting',
          onDone: {
            target: 'deleted',
          },
          onError: {
            target: 'deletingError',
          }
        }
      },
      'deleted': {
        target: 'idle',
      },
      'deletingError': {},
      'deletingRetry': {
        type: 'final',
      },
    }
  });
