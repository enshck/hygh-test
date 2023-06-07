import { Meta } from '@storybook/react';

import { FileDropzone, FileDropzoneProps } from './file-dropzone';
import styles from './file-dropzone-stories.module.css';
import { useState } from 'react';

export default {
  title: 'File Dropzone',
  component: FileDropzone,
} as Meta<typeof FileDropzone>;

const CommonDropZone = (props: Omit<FileDropzoneProps, 'onUploadedFiles'>) => {
  const [files, setFiles] = useState<string[]>([]);

  return (
    <div className={styles['main-container']}>
      <FileDropzone {...props} onUploadedFiles={(res) => setFiles(res)} />
      <div className={styles.files}>
        {files.map((file, key) => (
          <a href={file} key={key} target="_blank" rel="noreferrer">
            {file}
          </a>
        ))}
      </div>
    </div>
  );
};

export const SingleDropzone = () => {
  return <CommonDropZone />;
};

export const MultipleDropzone = () => {
  return <CommonDropZone allowMultiple />;
};

export const ImagesDropzone = () => {
  return (
    <CommonDropZone
      accept={{
        'image/*': ['.jpeg', '.png'],
      }}
    />
  );
};

export const PdfDropzone = () => {
  return (
    <CommonDropZone
      accept={{
        'pdf/*': ['.pdf'],
      }}
    />
  );
};
