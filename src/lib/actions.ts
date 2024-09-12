'use server';

import { revalidatePath } from 'next/cache';
import { TODOS_API } from '@/lib/constants';

export async function addTodo(title: string, description: string) {
  const response = await fetch(TODOS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description, completed: false }),
  });

  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  revalidatePath('/todo-list');
  return response.json();
}

export async function deleteTodo(id: string) {
  const response = await fetch(`${TODOS_API}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }

  revalidatePath(`/todo-list/${id}`);
  revalidatePath('/todo-list');
}

export async function updateTodo(
  id: string,
  title: string,
  description: string,
  completed: boolean
) {
  const response = await fetch(`${TODOS_API}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, completed }),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  const updatedTodo = await response.json();
  revalidatePath('/todo-list');
  return updatedTodo;
}

export async function updateTodoCompletion(id: string, completed: boolean) {
  const response = await fetch(`${TODOS_API}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo completion status');
  }

  const updatedTodo = await response.json();
  revalidatePath('/todo-list');
  return updatedTodo;
}
