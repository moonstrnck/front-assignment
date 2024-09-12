import { TODOS_API } from '@/lib/constants';

export async function getTodos() {
  try {
    const response = await fetch(TODOS_API);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    throw new Error(
      'todos를 가져오는데 실패했습니다. 나중에 다시 시도해주세요.'
    );
  }
}

export async function getTodo(id: string) {
  const response = await fetch(`${TODOS_API}/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}
