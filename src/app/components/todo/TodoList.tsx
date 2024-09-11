'use client';

import { useState } from 'react';

import TodoItem from '@/app/components/todo/TodoItem';
import Button from '@/app/components/common/Button';
import TodoDialog from '@/app/components/todo/TodoDialog';
import styles from '@/app/components/todo/TodoList.module.scss';

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

  const handleCreateTodo = (title: string, description: string) => {
    const newTodo = {
      id: Date.now().toString(),
      title,
      description,
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Todo List</h1>
        <Button theme="primary" onClick={() => setIsDialogOpen(true)}>
          할 일 추가
        </Button>
      </div>
      <div className={styles.todoList}>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            title={todo.title}
            description={todo.description}
            initialCompleted={todo.completed}
            onDelete={handleDeleteTodo}
          />
        ))}
      </div>
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleCreateTodo}
        mode="create"
      />
    </div>
  );
}
