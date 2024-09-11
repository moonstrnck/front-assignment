import TodoDetail from '@/app/components/todo/TodoDetail';
import styles from '@/app/todo-list/[id]/page.module.scss';

async function getTodo(id: string) {
  // TODO: json-server에서 todo를 가져오는 로직 구현
  return {
    id,
    title: '샘플 할 일',
    content: '이것은 샘플 할 일 내용입니다.',
    completed: false,
  };
}

async function updateTodo(id: string, title: string, content: string) {
  'use server';

  // TODO: json-server에 todo를 업데이트하는 로직 구현
  return { id, title, content, completed: false };
}

async function deleteTodo(id: string) {
  'use server';

  // TODO json-server에서todo를 삭제하는 로직 구현
  console.log('Deleting todo:', id);
}

export default async function TodoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const todo = await getTodo(params.id);

  return (
    <div className={styles.container}>
      <TodoDetail todo={todo} updateTodo={updateTodo} deleteTodo={deleteTodo} />
    </div>
  );
}
