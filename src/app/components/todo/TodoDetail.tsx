'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/app/components/common/Button';
import Checkbox from '@/app/components/common/Checkbox';
import AlertDialog from '@/app/components/common/AlertDialog';
import styles from '@/app/components/todo/TodoDetail.module.scss';

interface Todo {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

interface TodoDetailProps {
  todo: Todo;
  updateTodo: (id: string, title: string, content: string) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
}

export default function TodoDetail({
  todo: initialTodo,
  updateTodo,
  deleteTodo,
}: TodoDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [todo, setTodo] = useState(initialTodo);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTodo(initialTodo);
  };

  const handleSave = async () => {
    const updatedTodo = await updateTodo(todo.id, todo.title, todo.content);
    setTodo(updatedTodo);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await deleteTodo(todo.id);
    router.push('/todo-list');
  };

  const handleBack = () => {
    if (isEditing) {
      handleCancel();
    } else {
      router.push('/todo-list');
    }
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
        value={todo.content}
        onChange={(e) => setTodo({ ...todo, content: e.target.value })}
        disabled={!isEditing}
        className={`${styles.textarea} ${!isEditing ? styles.disabled : ''}`}
      />

      <div className={styles.footer}>
        <Button onClick={handleBack}>{isEditing ? '취소' : '이전'}</Button>
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
        title="할 일을 정말 삭제할까요?"
        cancelText="취소"
        confirmText="확인"
      />
    </div>
  );
}
