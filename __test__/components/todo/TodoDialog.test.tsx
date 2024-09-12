import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoDialog from '@/app/components/todo/TodoDialog';
import { DIALOG_MESSAGES } from '@/lib/constants';

jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange }: any) => (
    <div
      data-testid="dialog-root"
      data-open={open}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  ),
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Overlay: () => <div data-testid="dialog-overlay" />,
  Content: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  Close: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@/app/components/common/AlertDialog', () =>
  jest.fn(({ isOpen, onClose, onConfirm, title, description }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-alert-dialog">
        <h2>{title}</h2>
        <p>{description}</p>
        <button
          type="button"
          onClick={onConfirm}
          data-testid="alert-confirm-button"
        >
          확인
        </button>
        <button
          type="button"
          onClick={onClose}
          data-testid="alert-cancel-button"
        >
          취소
        </button>
      </div>
    );
  })
);

describe('TodoDialog 컴포넌트', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    mode: 'create' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('다이얼로그가 열려있을 때 렌더링된다', () => {
    render(<TodoDialog {...defaultProps} />);
    expect(screen.getByText('할 일 추가')).toBeInTheDocument();
  });

  test('입력 필드와 텍스트 영역이 올바르게 렌더링된다', () => {
    render(<TodoDialog {...defaultProps} />);
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Content')).toBeInTheDocument();
  });

  test('제출 시 onSubmit 함수가 호출된다', () => {
    render(<TodoDialog {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'New Todo' },
    });
    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Todo Description' },
    });
    fireEvent.submit(screen.getByRole('button', { name: '확인' }));
    expect(mockOnSubmit).toHaveBeenCalledWith('New Todo', 'Todo Description');
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('수정 모드에서 초기값이 올바르게 설정된다', () => {
    render(
      <TodoDialog
        {...defaultProps}
        mode="update"
        initialTitle="Initial Title"
        initialDescription="Initial Description"
      />
    );
    expect(screen.getByDisplayValue('Initial Title')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Initial Description')).toBeInTheDocument();
  });

  test('변경 사항이 있을 때 닫기 시도 시 AlertDialog가 표시된다', async () => {
    render(<TodoDialog {...defaultProps} />);
    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Changed Title' },
    });
    fireEvent.click(screen.getByLabelText('닫기'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-alert-dialog')).toBeInTheDocument();
      expect(
        screen.getByText(DIALOG_MESSAGES.CONFIRM_DISCARD_CHANGES.TITLE)
      ).toBeInTheDocument();
      expect(
        screen.getByText(DIALOG_MESSAGES.CONFIRM_DISCARD_CHANGES.DESCRIPTION)
      ).toBeInTheDocument();
    });
  });

  test('변경 사항이 있을 때 AlertDialog에서 확인을 누르면 변경 사항을 폐기하고 다이얼로그가 닫힌다', async () => {
    render(<TodoDialog {...defaultProps} initialTitle="Initial Title" />);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Changed Title' },
    });

    fireEvent.click(screen.getByLabelText('닫기'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-alert-dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('alert-confirm-button'));

    expect(mockOnClose).toHaveBeenCalled();
    expect(screen.queryByDisplayValue('Changed Title')).not.toBeInTheDocument();
  });

  test('변경 사항이 있을 때 AlertDialog에서 취소를 누르면 TodoDialog가 열린 채로 유지되고 변경 사항이 보존된다', async () => {
    render(<TodoDialog {...defaultProps} initialTitle="Initial Title" />);

    fireEvent.change(screen.getByPlaceholderText('Title'), {
      target: { value: 'Changed Title' },
    });

    fireEvent.click(screen.getByLabelText('닫기'));

    await waitFor(() => {
      expect(screen.getByTestId('mock-alert-dialog')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('alert-cancel-button'));
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(screen.getByDisplayValue('Changed Title')).toBeInTheDocument();
  });
});
