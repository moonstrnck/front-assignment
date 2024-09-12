import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import Button from '@/app/components/common/Button';
import AlertDialog from '@/app/components/common/AlertDialog';
import styles from '@/app/components/todo/TodoDialog.module.scss';

import { ERROR_MESSAGES, DIALOG_MESSAGES } from '@/lib/constants';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setHasChanges(title !== initialTitle || content !== initialDescription);
  }, [title, content, initialTitle, initialDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSubmit(title, content);
      setTitle('');
      setContent('');
      setHasChanges(false);
      onClose();
    } else {
      setErrorMessage('제목과 내용을 모두 입력해주세요.');
    }
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

  const handleErrorClose = () => {
    setErrorMessage(null);
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
                aria-label="닫기"
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
        title={DIALOG_MESSAGES.CONFIRM_DISCARD_CHANGES.TITLE}
        description={DIALOG_MESSAGES.CONFIRM_DISCARD_CHANGES.DESCRIPTION}
      />
      <AlertDialog
        isOpen={!!errorMessage}
        onClose={handleErrorClose}
        onConfirm={handleErrorClose}
        title={ERROR_MESSAGES.ERROR_TITLE}
        description={errorMessage || ''}
        isError
      />
    </>
  );
}

export default TodoDialog;
