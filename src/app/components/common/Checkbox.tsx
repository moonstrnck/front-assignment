'use client';

import { useId } from 'react';
import styles from '@/app/components/common/Checkbox.module.scss';

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

function Checkbox({ label, className, id, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || `checkbox-${generatedId}`;

  const checkmarkClass = `${styles.checkmark} ${className || ''}`;

  return (
    <div className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={checkboxId}
        className={styles.checkbox}
        {...props}
      />
      <label htmlFor={checkboxId} className={styles.label}>
        <span className={checkmarkClass} data-testid="checkmark" />
        {label && <span className={styles.labelText}>{label}</span>}
      </label>
    </div>
  );
}

export default Checkbox;
