import { Suspense } from 'react';
import { getTodos } from '@/lib/api';
import TodoList from '@/app/components/todo/TodoList';
import Loading from '@/app/loading';

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
