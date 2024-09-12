import { Suspense } from 'react';

import TodoList from '@/app/components/todo/TodoList';
import Loading from '@/app/loading';

import { getTodos } from '@/lib/api';

async function TodoListContent() {
  const initialTodos = await getTodos();
  return <TodoList initialTodos={initialTodos} />;
}

export default async function TodoListPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TodoListContent />
    </Suspense>
  );
}
