import TodoDetail from '@/app/components/todo/TodoDetail';
import styles from '@/app/todo-list/[id]/page.module.scss';

import { getTodo } from '@/lib/api';

export default async function TodoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const todo = await getTodo(params.id);

  return (
    <div className={styles.container}>
      <TodoDetail todo={todo} />
    </div>
  );
}
