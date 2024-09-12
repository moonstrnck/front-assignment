'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/app/components/common/Button';
import Checkbox from '@/app/components/common/Checkbox';
import AlertDialog from '@/app/components/common/AlertDialog';
import styles from '@/app/components/todo/TodoDetail.module.scss';

import { updateTodo, deleteTodo } from '@/lib/actions';
import { ERROR_MESSAGES, DIALOG_MESSAGES } from '@/lib/constants';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoDetailProps {
  todo: Todo;
}

export default function TodoDetail({ todo: initialTodo }: TodoDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState(initialTodo);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTodo(initialTodo);
  };

  const handleSave = async () => {
    try {
      const updatedTodo = await updateTodo(
        todo.id,
        todo.title,
        todo.description,
        todo.completed
      );
      setTodo(updatedTodo);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
      setErrorMessage(ERROR_MESSAGES.UPDATE_TODO);
    }
  };

  const handleDelete = async () => {
    setIsDeleteDialogOpen(false);

    try {
      await deleteTodo(todo.id);
      router.push('/todo-list');
    } catch (error) {
      console.error('Failed to delete todo:', error);
      setErrorMessage(ERROR_MESSAGES.DELETE_TODO);
    }
  };

  const handleBack = () => {
    if (isEditing) {
      handleCancel();
    } else {
      router.push('/todo-list');
    }
  };

  const handleErrorClose = () => {
    setErrorMessage(null);
  };

  return (
    <div className={styles.todoDetail}>
      <div className={styles.header}>
        <div className={styles.leftSection}>
          {!isEditing && (
            <Checkbox
              className={styles.todoDetailCheckmark}
              checked={todo.completed}
              disabled
            />
          )}
          <input
            type="text"
            value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })}
            disabled={!isEditing}
            className={`${styles.input} ${styles.titleInput} ${!isEditing ? styles.disabled : ''}`}
          />
        </div>
      </div>

      <textarea
        value={todo.description}
        onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        disabled={!isEditing}
        className={`${styles.textarea} ${!isEditing ? styles.disabled : ''}`}
      />

      <div className={styles.footer}>
        <Button onClick={handleBack}>이전</Button>
        <div className={styles.footerButtons}>
          {isEditing ? (
            <Button onClick={handleSave}>확인</Button>
          ) : (
            <>
              <Button onClick={handleEdit}>수정</Button>
              <Button
                theme="dangerous"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                삭제
              </Button>
            </>
          )}
        </div>
      </div>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
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
    </div>
  );
}
