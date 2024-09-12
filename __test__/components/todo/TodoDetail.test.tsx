import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoDetail from '@/app/components/todo/TodoDetail';
import { updateTodo, deleteTodo } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES, DIALOG_MESSAGES } from '@/lib/constants';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/actions', () => ({
  updateTodo: jest.fn(),
  deleteTodo: jest.fn(),
}));

const mockTodo = {
  id: '1',
  title: '테스트 할 일',
  description: '이것은 테스트를 위한 할 일 설명입니다.',
  completed: false,
};

describe('TodoDetail 컴포넌트', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  test('초기 상태에서 todo 정보가 올바르게 표시된다', () => {
    render(<TodoDetail todo={mockTodo} />);

    expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockTodo.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '수정' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument();
  });

  test('수정 버튼 클릭 시 편집 모드로 전환된다', () => {
    render(<TodoDetail todo={mockTodo} />);

    fireEvent.click(screen.getByRole('button', { name: '수정' }));

    expect(screen.getByRole('button', { name: '확인' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: '수정' })
    ).not.toBeInTheDocument();
  });

  test('편집 모드에서 내용을 변경하고 저장할 수 있다', async () => {
    (updateTodo as jest.Mock).mockResolvedValue({
      ...mockTodo,
      title: '수정된 할 일',
    });

    render(<TodoDetail todo={mockTodo} />);

    fireEvent.click(screen.getByRole('button', { name: '수정' }));
    fireEvent.change(screen.getByDisplayValue(mockTodo.title), {
      target: { value: '수정된 할 일' },
    });
    fireEvent.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(updateTodo).toHaveBeenCalledWith(
        mockTodo.id,
        '수정된 할 일',
        mockTodo.description,
        mockTodo.completed
      );
    });

    expect(screen.getByDisplayValue('수정된 할 일')).toBeInTheDocument();
  });

  test('삭제 버튼 클릭 시 확인 대화상자가 표시된다', () => {
    render(<TodoDetail todo={mockTodo} />);

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));

    expect(
      screen.getByText(DIALOG_MESSAGES.CONFIRM_DELETE)
    ).toBeInTheDocument();
  });

  test('삭제 확인 시 deleteTodo가 호출되고 리디렉션된다', async () => {
    (deleteTodo as jest.Mock).mockResolvedValue(undefined);

    render(<TodoDetail todo={mockTodo} />);

    fireEvent.click(screen.getByRole('button', { name: '삭제' }));
    fireEvent.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(deleteTodo).toHaveBeenCalledWith(mockTodo.id);
      expect(mockPush).toHaveBeenCalledWith('/todo-list');
    });
  });

  test('이전 버튼 클릭 시 todo-list 페이지로 이동한다', () => {
    render(<TodoDetail todo={mockTodo} />);

    fireEvent.click(screen.getByRole('button', { name: '이전' }));

    expect(mockPush).toHaveBeenCalledWith('/todo-list');
  });

  test('에러 발생 시 에러 메시지가 표시된다', async () => {
    (updateTodo as jest.Mock).mockRejectedValue(new Error('업데이트 실패'));

    render(<TodoDetail todo={mockTodo} />);

    fireEvent.click(screen.getByRole('button', { name: '수정' }));
    fireEvent.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.UPDATE_TODO)).toBeInTheDocument();
    });
  });
});
