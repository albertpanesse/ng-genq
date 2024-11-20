import { assign, fromPromise, setup } from "xstate";
import { ICommonFunctionResult, IFileManagerUploadingResponsePayload } from "../types";
import { copying, cutting, deleting, pasting, uploading } from "../apis";

export interface IStateFileManagerContext {};

interface IStateFileManagerEvent<T1, T2 = void> {
  type: T1;
  params?: T2;
};

interface TEventFileManagerUploadingParams {}

interface TEventFileManagerCopyingParams {}

interface TEventFileManagerCuttingParams {}

interface TEventFileManagerPastingParams {}

interface TEventFileManagerDeletingParams {}

export const fileManagerStateMachine = setup({
  types: {
    context: {} as IStateFileManagerContext,
    events: {} as IStateFileManagerEvent<'event.uploading', TEventFileManagerUploadingParams> | 
      IStateFileManagerEvent<'event.copying', TEventFileManagerCopyingParams> | 
      IStateFileManagerEvent<'event.cutting', TEventFileManagerCuttingParams> | 
      IStateFileManagerEvent<'event.pasting', TEventFileManagerPastingParams> | 
      IStateFileManagerEvent<'event.deleting', TEventFileManagerDeletingParams>,
  },
  actors: {
    'actor.uploading': fromPromise(uploading),
    'actor.copying': fromPromise(copying),
    'actor.cutting': fromPromise(cutting),
    'actor.pasting': fromPromise(pasting),
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
          'event.copying': {
            target: 'copying',
            actions: assign({
              credential: ({ event }) => event.params as TEventFileManagerCopyingParams,
            }),
          },
          'event.cutting': {
            target: 'cutting',
            actions: assign({
              credential: ({ event }) => event.params as TEventFileManagerCuttingParams,
            }),
          },
          'event.pasting': {
            target: 'pasting',
            actions: assign({
              credential: ({ event }) => event.params as TEventFileManagerPastingParams,
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
      'copying': {
        invoke: {
          src: 'actor.copying',
          onDone: {
            target: 'copied',
          },
          onError: {
            target: 'copyingError',
          }
        }
      },
      'copied': {},
      'copyingError': {},
      'copyingRetry': {},
      'cutting': {
        invoke: {
          src: 'actor.cutting',
          onDone: {
            target: 'cut',
          },
          onError: {
            target: 'cuttingError',
          }
        }
      },
      'cut': {},
      'cuttingError': {},
      'cuttingRetry': {},
      'pasting': {
        invoke: {
          src: 'actor.pasting',
          onDone: {
            target: 'paste',
          },
          onError: {
            target: 'pastingError',
          }
        }
      },
      'paste': {},
      'pastingError': {},
      'pastingRetry': {},
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
