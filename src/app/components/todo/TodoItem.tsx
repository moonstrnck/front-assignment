'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Checkbox from '@/app/components/common/Checkbox';
import Button from '@/app/components/common/Button';
import Spinner from '@/app/components/common/Spinner';
import AlertDialog from '@/app/components/common/AlertDialog';
import TodoDialog from '@/app/components/todo/TodoDialog';
import styles from '@/app/components/todo/TodoItem.module.scss';

import { deleteTodo, updateTodo, updateTodoCompletion } from '@/lib/actions';
import { ERROR_MESSAGES, DIALOG_MESSAGES } from '@/lib/constants';

interface TodoItemProps {
  id: string;
  title: string;
  description: string;
  initialCompleted: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
}

function TodoItem({
  id,
  title,
  description,
  initialCompleted,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleCompletionChange = async () => {
    setIsLoading(true);
    try {
      const newCompletionStatus = !isCompleted;
      const updatedTodo = await updateTodoCompletion(id, newCompletionStatus);
      setIsCompleted(updatedTodo.completed);
    } catch (error) {
      console.error('Failed to update todo completion status:', error);
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (newTitle: string, newDescription: string) => {
    setIsLoading(true);
    try {
      const updatedTodo = await updateTodo(
        id,
        newTitle,
        newDescription,
        isCompleted
      );
      onUpdate(id, updatedTodo.title, updatedTodo.description);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      await deleteTodo(id);
      onDelete(id);
      setIsAlertOpen(false);
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
    } finally {
      setIsLoading(false);
    }
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

  const handleErrorClose = () => {
    setErrorMessage(null);
  };

  return (
    <div className={styles.todoItem} onClick={handleItemClick}>
      <Checkbox
        checked={isCompleted}
        className={styles.todoItemCheckmark}
        onChange={handleCompletionChange}
      />
      <div className={styles.todoContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className={styles.todoActions}>
        <Button
          theme="primary"
          size="small"
          onClick={() => {
            setIsDialogOpen(true);
          }}
        >
          수정
        </Button>
        <Button
          theme="dangerous"
          size="small"
          onClick={() => {
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
        title={DIALOG_MESSAGES.CONFIRM_DELETE}
      />
      <AlertDialog
        isOpen={!!errorMessage}
        onClose={handleErrorClose}
        onConfirm={handleErrorClose}
        title={ERROR_MESSAGES.ERROR_TITLE}
        description={errorMessage || ''}
        isError
      />
      {isLoading && <Spinner />}
    </div>
  );
}

export default TodoItem;
