import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import TodoItem from '@/app/components/todo/TodoItem';
import { updateTodoCompletion, updateTodo, deleteTodo } from '@/lib/actions';
import { ERROR_MESSAGES, DIALOG_MESSAGES } from '@/lib/constants';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  updateTodoCompletion: jest.fn(),
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

jest.mock('@/app/components/common/Spinner', () => ({
  __esModule: true,
  default: () => <div data-testid="spinner" />,
}));

describe('TodoItem 컴포넌트', () => {
  const mockRouter = { push: jest.fn() };
  const mockOnDelete = jest.fn();
  const mockOnUpdate = jest.fn();

  const defaultProps = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    initialCompleted: false,
    onDelete: mockOnDelete,
    onUpdate: mockOnUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  test('TodoItem이 올바르게 렌더링된다', () => {
    render(<TodoItem {...defaultProps} />);
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('체크박스 클릭 시 완료 상태가 토글된다', async () => {
    (updateTodoCompletion as jest.Mock).mockResolvedValue({ completed: true });
    render(<TodoItem {...defaultProps} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(updateTodoCompletion).toHaveBeenCalledWith('1', true);
      expect(checkbox).toBeChecked();
    });
  });

  test('수정 버튼 클릭 시 TodoDialog가 열린다', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByText('수정'));
    expect(screen.getByText('할 일 수정')).toBeInTheDocument();
  });

  test('삭제 버튼 클릭 시 AlertDialog가 열린다', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByText('삭제'));
    expect(
      screen.getByText(DIALOG_MESSAGES.CONFIRM_DELETE)
    ).toBeInTheDocument();
  });

  test('TodoDialog에서 수정 시 updateTodo가 호출된다', async () => {
    (updateTodo as jest.Mock).mockResolvedValue({
      title: 'Updated Title',
      description: 'Updated Description',
      completed: false,
    });
    render(<TodoItem {...defaultProps} />);

    fireEvent.click(screen.getByText('수정'));
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Updated Title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Updated Description' },
    });
    fireEvent.click(screen.getByText('확인'));

    await waitFor(() => {
      expect(updateTodo).toHaveBeenCalledWith(
        '1',
        'Updated Title',
        'Updated Description',
        false
      );
      expect(mockOnUpdate).toHaveBeenCalledWith(
        '1',
        'Updated Title',
        'Updated Description'
      );
    });
  });

  test('AlertDialog에서 삭제 확인 시 deleteTodo가 호출된다', async () => {
    (deleteTodo as jest.Mock).mockResolvedValue({});
    render(<TodoItem {...defaultProps} />);

    fireEvent.click(screen.getByText('삭제'));
    fireEvent.click(screen.getByText('확인'));

    await waitFor(() => {
      expect(deleteTodo).toHaveBeenCalledWith('1');
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  test('todo 내용 클릭 시 상세 페이지로 이동한다', () => {
    render(<TodoItem {...defaultProps} />);
    fireEvent.click(screen.getByText('Test Todo'));
    expect(mockRouter.push).toHaveBeenCalledWith('/todo-list/1');
  });

  test('에러 발생 시 에러 메시지가 표시된다', async () => {
    (updateTodoCompletion as jest.Mock).mockRejectedValue(
      new Error('Update failed')
    );
    render(<TodoItem {...defaultProps} />);

    fireEvent.click(screen.getByRole('checkbox'));

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.UPDATE_TODO)).toBeInTheDocument();
    });
  });

  test('로딩 중일 때 Spinner가 표시된다', async () => {
    let resolveUpdateTodo: (value: { completed: boolean }) => void;
    (updateTodoCompletion as jest.Mock).mockImplementation(
      () =>
        new Promise<{ completed: boolean }>((resolve) => {
          resolveUpdateTodo = resolve;
        })
    );

    render(<TodoItem {...defaultProps} />);

    act(() => {
      fireEvent.click(screen.getByRole('checkbox'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    await act(async () => {
      resolveUpdateTodo({ completed: true });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });
});
