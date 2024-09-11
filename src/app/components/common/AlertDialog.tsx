import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import Button from '@/app/components/common/Button';
import styles from '@/app/components/common/AlertDialog.module.scss';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
}: AlertDialogProps): React.ReactElement {
  return (
    <AlertDialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay className={styles.alertDialogOverlay} />
        <AlertDialogPrimitive.Content className={styles.alertDialogContent}>
          <AlertDialogPrimitive.Title className={styles.alertDialogTitle}>
            {title}
          </AlertDialogPrimitive.Title>
          {description && (
            <AlertDialogPrimitive.Description
              className={styles.alertDialogDescription}
            >
              {description}
            </AlertDialogPrimitive.Description>
          )}
          <div className={styles.alertDialogActions}>
            <AlertDialogPrimitive.Cancel asChild>
              <Button onClick={onClose} theme="dangerous" size="small">
                {cancelText}
              </Button>
            </AlertDialogPrimitive.Cancel>
            <AlertDialogPrimitive.Action asChild>
              <Button onClick={onConfirm} theme="primary" size="small">
                {confirmText}
              </Button>
            </AlertDialogPrimitive.Action>
          </div>
        </AlertDialogPrimitive.Content>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}

export default AlertDialog;
