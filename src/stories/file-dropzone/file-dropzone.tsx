import { Accept, FileRejection, useDropzone } from 'react-dropzone';
import { FC, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useMachine } from '@xstate/react';

import styles from './file-dropzone.module.css';
import fileIcon from './assets/icons/file-icon.png';
import { Progress } from './components/progress/progress';
import { Error } from './components/error/error';
import { uploadingMachine } from './state/uploading-machine';

export interface FileDropzoneProps {
  /**
   * Callback which fires after file uploaded successfully
   */
  onUploadedFiles: (files: string[]) => void;
  /**
   * (Optional) Allow multiple files to be uploaded
   */
  allowMultiple?: boolean;
  /**
   * (Optional) `Accept` object, to be parsed by the `react-dropzone` library.
   * For more details, refer to the [documentation for `react-dropzone`][1].
   *
   * [1]: https://react-dropzone.js.org/#!/Accepting%20specific%20file%20types
   */
  accept?: Accept;
}

/**
 * FileDropzone component
 */
export const FileDropzone: FC<FileDropzoneProps> = ({
  accept,
  allowMultiple = false,
  onUploadedFiles,
}) => {
  const [state, send] = useMachine(uploadingMachine);

  const { enqueueSnackbar } = useSnackbar();

  const cancelUploading = () => {
    send('CANCEL');
  };

  const onDrop = (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    // Warn and do nothing if adding multiple files when disallowed
    if (!allowMultiple && acceptedFiles.length + rejectedFiles.length > 1) {
      enqueueSnackbar('Only one file can be added', { variant: 'error' });
      return;
    }
    // Warn if trying to add unsupported file
    if (rejectedFiles.length) {
      enqueueSnackbar('Only supported files can be added', {
        variant: 'error',
      });
      return;
    }

    send('UPLOAD', {
      files: acceptedFiles,
    });
  };

  const onRetry = () => {
    send('RETRY');
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    accept,
    multiple: allowMultiple,
    useFsAccessApi: false,
  });

  useEffect(() => {
    const { uploadedFiles } = state.context;
    const prevState = state.history?.value;

    if (prevState === 'uploading' && uploadedFiles) {
      onUploadedFiles(uploadedFiles);
    }
  }, [state]);

  if (state.matches('fethingError') || state.matches('uploadingError')) {
    return <Error onRetry={onRetry} />;
  }

  if (state.matches('urlFetching') || state.matches('uploading')) {
    return (
      <Progress
        isFetching={state.matches('urlFetching')}
        onCancel={cancelUploading}
        allowMultiple={allowMultiple}
      />
    );
  }

  return (
    <div className={styles['main-container']} {...getRootProps()}>
      <div className={styles['drop-container']}>
        <div className={styles.controls}>
          <input {...getInputProps()} data-testid="file-dropzone-input" />
          <h1>Add file{allowMultiple && 's'} to upload</h1>
          <div className={styles.button} onClick={open}>
            <img src={fileIcon as string} />
            Add file
            {allowMultiple && 's'}
          </div>
          <p>
            or drop document
            {allowMultiple && 's'} here
          </p>
        </div>
      </div>
    </div>
  );
};
