
import { SnackbarProvider } from 'notistack';
import React from 'react';

import './preview-styles.css'

const { worker } = require('../src/mocks/browser')

worker.start()


/** @type { import('@storybook/react').Preview } */
const preview = {
  decorators: [
    (Story) => (
      <SnackbarProvider maxSnack={3}>
        <Story />
      </SnackbarProvider>
    ),
  ],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    }
  },
};

export default preview;
