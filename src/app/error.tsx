'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Button from '@/app/components/common/Button';
import styles from '@/app/error.module.scss';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <Image
        src="/images/icon-error.png"
        alt="오류 발생"
        width={120}
        height={120}
      />
      <h2 className={styles.errorTitle}>오류가 발생했습니다.</h2>
      <Button theme="primary" onClick={() => reset()}>
        다시 시도
      </Button>
    </div>
  );
}
