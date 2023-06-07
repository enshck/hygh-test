import { createMachine } from 'xstate';

import { getUploadUrl, uploadFiles } from '../assets/requests';

interface Context {
  urlForUpload: string | null;
  filesForUpload: File[] | null;
  abortController: AbortController;
  uploadedFiles: string[] | null;
}

export const uploadingMachine = createMachine(
  {
    id: 'uploadingMachine',
    initial: 'urlFetching',
    context: {
      urlForUpload: null,
      filesForUpload: null,
      abortController: new AbortController(),
      uploadedFiles: null,
    } as Context,
    states: {
      urlFetching: {
        invoke: {
          src: getUploadUrl,
          onDone: {
            target: 'ready',
            actions: 'setUrlForUpload',
          },
          onError: 'fethingError',
        },
      },
      ready: {
        on: {
          UPLOAD: {
            target: 'uploading',
            actions: 'setFilesForUpload',
          },
        },
      },
      uploading: {
        invoke: {
          src: (ctx) =>
            uploadFiles(
              ctx.filesForUpload || [],
              ctx.urlForUpload || '',
              ctx.abortController.signal
            ),
          onDone: {
            target: 'ready',
            actions: [
              'clearFilesData',
              'reinitAbortController',
              'filesUploadedCallback',
            ],
          },
          onError: 'uploadingError',
        },
        on: {
          CANCEL: {
            target: 'ready',
            actions: [
              'abortRequest',
              'clearFilesData',
              'reinitAbortController',
            ],
          },
        },
      },
      fethingError: {
        on: {
          RETRY: {
            target: 'urlFetching',
          },
        },
      },
      uploadingError: {
        on: {
          RETRY: {
            target: 'uploading',
          },
        },
      },
    },
  },
  {
    actions: {
      setUrlForUpload: (ctx, event) => {
        ctx.urlForUpload = event?.data?.uploadUrl as string;
      },
      clearFilesData: (ctx) => {
        ctx.filesForUpload = null;
      },
      setFilesForUpload: (ctx, event) => {
        ctx.filesForUpload = event.files as File[];
      },
      reinitAbortController: (ctx) => {
        ctx.abortController = new AbortController();
      },
      abortRequest: (ctx) => {
        ctx.abortController.abort();
      },
      filesUploadedCallback: (ctx, event) => {
        ctx.uploadedFiles = event?.data?.data as string[];
      },
    },
  }
);
