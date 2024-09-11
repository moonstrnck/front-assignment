export const TODOS_API = 'http://localhost:3001/todos';

export async function getTodos() {
  const res = await fetch(TODOS_API);
  if (!res.ok) {
    throw new Error('Failed to fetch todos');
  }
  return res.json();
}
