'use client';

import { useState } from 'react';

import TodoItem from '@/app/components/todo/TodoItem';
import Button from '@/app/components/common/Button';
import Spinner from '@/app/components/common/Spinner';
import AlertDialog from '@/app/components/common/AlertDialog';
import TodoDialog from '@/app/components/todo/TodoDialog';
import styles from '@/app/components/todo/TodoList.module.scss';

import { addTodo } from '@/lib/actions';
import { ERROR_MESSAGES } from '@/lib/constants';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface TodoListProps {
  initialTodos: Todo[];
}

export default function TodoList({ initialTodos }: TodoListProps) {
  const [todos, setTodos] = useState(initialTodos);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreateTodo = async (title: string, description: string) => {
    setIsDialogOpen(false);
    setIsLoading(true);
    try {
      const newTodo = await addTodo(title, description);
      setTodos([...todos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
      setErrorMessage(ERROR_MESSAGES.CREATE_TODO);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleUpdateTodo = (
    id: string,
    newTitle: string,
    newDescription: string
  ) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, title: newTitle, description: newDescription }
          : todo
      )
    );
  };

  const handleErrorClose = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <div className={styles.header}>
        <h1>Todo List</h1>
        <Button theme="primary" onClick={() => setIsDialogOpen(true)}>
          할 일 추가
        </Button>
      </div>
      <div className={styles.container}>
        <div className={styles.todoList}>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              title={todo.title}
              description={todo.description}
              initialCompleted={todo.completed}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
            />
          ))}
        </div>
        <TodoDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleCreateTodo}
          mode="create"
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
    </>
  );
}
