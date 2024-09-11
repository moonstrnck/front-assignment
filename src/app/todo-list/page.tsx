import getTodos from '@/lib/api';
import TodoList from '@/app/components/todo/TodoList';

export default async function TodoListPage() {
  const initialTodos = await getTodos();
  console.log(initialTodos);

  return <TodoList initialTodos={initialTodos} />;
}
