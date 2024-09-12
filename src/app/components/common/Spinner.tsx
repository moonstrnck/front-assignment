import Image from 'next/image';
import styles from '@/app/components/common/Spinner.module.scss';

export default function Spinner() {
  return (
    <div className={styles.spinnerOverlay} data-testid="spinner-overlay">
      <Image
        src="/images/icon-spinner.gif"
        alt="로딩 중"
        className={styles.spinner}
        width={70}
        height={70}
      />
    </div>
  );
}
