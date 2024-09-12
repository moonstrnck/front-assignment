import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import Button from '@/app/components/common/Button';
import AlertDialog from '@/app/components/common/AlertDialog';
import styles from '@/app/components/todo/TodoDialog.module.scss';

type TodoDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
  initialTitle?: string;
  initialDescription?: string;
  mode: 'create' | 'update';
};

function TodoDialog({
  isOpen,
  onClose,
  onSubmit,
  initialTitle = '',
  initialDescription = '',
  mode,
}: TodoDialogProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialDescription);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(title !== initialTitle || content !== initialDescription);
  }, [title, content, initialTitle, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content);
    onClose();
  };

  const handleClose = () => {
    if (hasChanges) {
      setIsAlertOpen(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setTitle(initialTitle);
    setContent(initialDescription);
    setIsAlertOpen(false);
    onClose();
  };

  const handleCancelClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={handleClose}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent}>
            <Dialog.Title className={styles.dialogTitle}>
              {mode === 'create' ? '할 일 추가' : '할 일 수정'}
            </Dialog.Title>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className={styles.input}
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className={styles.textarea}
              />
              <div className={styles.dialogActions}>
                <Button type="submit" theme="primary">
                  확인
                </Button>
              </div>
            </form>
            <Dialog.Close asChild>
              <button
                type="button"
                className={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        title="변경사항이 있습니다"
        description="수정을 취소할까요?"
      />
    </>
  );
}

export default TodoDialog;
