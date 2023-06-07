import { FC } from 'react';

import styles from './error.module.css';
import dropzoneStyles from '../../file-dropzone.module.css';

interface ErrorProps {
  /**
   * Function-callback for retry uploading
   */
  onRetry: () => void;
}

export const Error: FC<ErrorProps> = ({ onRetry }) => (
  <div className={dropzoneStyles['main-container']}>
    <div className={dropzoneStyles['drop-container']}>
      <div className={styles['main-container']}>
        <p>Uploading/Fetching error</p>
        <div className={styles.button} onClick={onRetry}>
          Retry
        </div>
      </div>
    </div>
  </div>
);
