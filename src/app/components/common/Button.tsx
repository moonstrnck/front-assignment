'use client';

import styles from '@/app/components/common/Button.module.scss';

type ButtonTheme = 'primary' | 'dangerous';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: ButtonTheme;
  size?: ButtonSize;
  children: React.ReactNode;
}

function Button({
  theme = 'primary',
  size = 'medium',
  children,
  className,
  ...props
}: ButtonProps) {
  const buttonClass = `${styles.button} ${styles[theme]} ${styles[size]} ${className || ''}`;

  return (
    <button type="button" className={buttonClass} {...props}>
      {children}
    </button>
  );
}

export default Button;
