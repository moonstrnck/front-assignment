import Spinner from '@/app/components/common/Spinner';
import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <Spinner />
    </div>
  );
}
