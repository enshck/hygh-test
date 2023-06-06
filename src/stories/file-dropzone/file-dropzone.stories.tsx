import { Meta } from '@storybook/react';

import { FileDropzone } from './file-dropzone';

export default {
  title: 'File Dropzone',
  component: FileDropzone,
} as Meta<typeof FileDropzone>;

export const SingleDropzone = () => {
  return <FileDropzone />;
};
