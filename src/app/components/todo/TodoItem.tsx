'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Checkbox from '@/app/components/common/Checkbox';
import Button from '@/app/components/common/Button';
import AlertDialog from '@/app/components/common/AlertDialog';
import TodoDialog from '@/app/components/todo/TodoDialog';
import styles from '@/app/components/todo/TodoItem.module.scss';

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  initialCompleted: boolean;
  onDelete: (id: string) => void;
}

function TodoItem({
  id,
  title,
  description,
  initialCompleted,
  onDelete,
}: TodoItemProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const router = useRouter();

  const handleCompletionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setIsCompleted(!isCompleted);
  };

  const handleUpdate = (newTitle: string, newContent: string) => {
    console.log('Updating todo:', id, newTitle, newContent);
  };

  const handleDeleteConfirm = () => {
    onDelete(id);
    setIsAlertOpen(false);
  };

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof Element &&
      (e.target.classList.contains(styles.todoContent) ||
        e.target.closest(`.${styles.todoContent}`))
    ) {
      router.push(`/todo-list/${id}`);
    }
  };

  return (
    <div className={styles.todoItem} onClick={handleItemClick}>
      <Checkbox
        checked={isCompleted}
        className={styles.todoItemCheckmark}
        onChange={handleCompletionChange}
        onClick={(e) => e.stopPropagation()}
      />
      <div className={styles.todoContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.todoActions}>
        <Button
          theme="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsDialogOpen(true);
          }}
        >
          수정
        </Button>
        <Button
          theme="dangerous"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setIsAlertOpen(true);
          }}
        >
          삭제
        </Button>
      </div>
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleUpdate}
        initialTitle={title}
        initialDescription={description}
        mode="update"
      />
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="할 일을 정말 삭제할까요?"
        cancelText="취소"
        confirmText="확인"
      />
    </div>
  );
}

export default TodoItem;
