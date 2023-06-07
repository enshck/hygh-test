import { FC } from 'react';

import styles from './progress.module.css';
import dropzoneStyles from '../../file-dropzone.module.css';

interface ProgressProps {
  /**
   * Fetching status
   */
  isFetching: boolean;
  /**
   * Function-callback for cancel uploading
   */
  onCancel: () => void;
  /**
   * (Optional) allow multiple files to be uploaded
   */
  allowMultiple?: boolean;
}

export const Progress: FC<ProgressProps> = ({
  onCancel,
  allowMultiple,
  isFetching,
}) => (
  <div className={dropzoneStyles['main-container']}>
    <div className={dropzoneStyles['drop-container']}>
      <div className={styles['main-container']}>
        <p>
          {isFetching
            ? 'Fetching upload url'
            : `Uploading file${allowMultiple ? '(s)' : ''}`}
        </p>
        <div className={styles.spinner} />
        <div className={styles.button} onClick={onCancel}>
          Cancel
        </div>
      </div>
    </div>
  </div>
);
