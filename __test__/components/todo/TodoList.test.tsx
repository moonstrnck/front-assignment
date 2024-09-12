import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from '@/app/components/todo/TodoList';
import { addTodo } from '@/lib/actions';
import { ERROR_MESSAGES } from '@/lib/constants';

jest.mock('@/lib/actions', () => ({
  addTodo: jest.fn(),
}));

jest.mock(
  '@/app/components/todo/TodoItem',
  () =>
    function MockTodoItem({ title, description, onDelete, onUpdate }: any) {
      return (
        <div data-testid="todo-item">
          <h3>{title}</h3>
          <p>{description}</p>
          <button type="button" onClick={() => onDelete('mockId')}>
            Delete
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdate('mockId', 'Updated Title', 'Updated Description')
            }
          >
            Update
          </button>
        </div>
      );
    }
);

jest.mock(
  '@/app/components/todo/TodoDialog',
  () =>
    function MockTodoDialog({ isOpen, onClose, onSubmit }: any) {
      if (!isOpen) return null;
      return (
        <div data-testid="todo-dialog">
          <button
            type="submit"
            onClick={() => onSubmit('New Todo', 'New Description')}
          >
            Submit
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      );
    }
);

describe('TodoList 컴포넌트', () => {
  const mockTodos = [
    {
      id: '1',
      title: 'Todo 1',
      description: 'Description 1',
      completed: false,
    },
    { id: '2', title: 'Todo 2', description: 'Description 2', completed: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('초기 todos가 렌더링된다', () => {
    render(<TodoList initialTodos={mockTodos} />);
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  test('할 일 추가 버튼이 렌더링된다', () => {
    render(<TodoList initialTodos={mockTodos} />);
    expect(screen.getByText('할 일 추가')).toBeInTheDocument();
  });

  test('할 일 추가 버튼 클릭 시 TodoDialog가 열린다', () => {
    render(<TodoList initialTodos={mockTodos} />);
    fireEvent.click(screen.getByText('할 일 추가'));
    expect(screen.getByTestId('todo-dialog')).toBeInTheDocument();
  });

  test('새로운 todo 추가 시 목록이 업데이트된다', async () => {
    const newTodo = {
      id: '3',
      title: 'New Todo',
      description: 'New Description',
      completed: false,
    };
    (addTodo as jest.Mock).mockResolvedValue(newTodo);

    render(<TodoList initialTodos={mockTodos} />);
    fireEvent.click(screen.getByText('할 일 추가'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('todo-item')).toHaveLength(3);
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  test('todo 추가 실패 시 에러 메시지가 표시된다', async () => {
    (addTodo as jest.Mock).mockRejectedValue(new Error('Add failed'));

    render(<TodoList initialTodos={mockTodos} />);
    fireEvent.click(screen.getByText('할 일 추가'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.CREATE_TODO)).toBeInTheDocument();
    });
  });

  test('로딩 중일 때 Spinner가 표시된다', async () => {
    (addTodo as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              id: '3',
              title: 'New Todo',
              description: 'New Description',
              completed: false,
            });
          }, 100);
        })
    );

    render(<TodoList initialTodos={mockTodos} />);
    fireEvent.click(screen.getByText('할 일 추가'));

    await act(async () => {
      fireEvent.click(screen.getByText('Submit'));
    });

    expect(screen.getByTestId('spinner-overlay')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner-overlay')).not.toBeInTheDocument();
    });
  });
});
