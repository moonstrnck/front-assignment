import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertDialog from '@/app/components/common/AlertDialog';

jest.mock('@radix-ui/react-alert-dialog', () => ({
  Root: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Portal: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Overlay: () => <div data-testid="overlay" />,
  Content: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  Description: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  Action: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Cancel: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('AlertDialog 컴포넌트', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: '알림',
    description: '정말 삭제하시겠습니까?',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('AlertDialog가 열려 있을 때 렌더링된다', () => {
    render(<AlertDialog {...defaultProps} />);
    expect(screen.getByText('알림')).toBeInTheDocument();
    expect(screen.getByText('정말 삭제하시겠습니까?')).toBeInTheDocument();
  });

  test('취소 버튼이 렌더링되고 클릭 시 onClose가 호출된다', () => {
    render(<AlertDialog {...defaultProps} />);
    const cancelButton = screen.getByText('취소');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('확인 버튼이 렌더링되고 클릭 시 onConfirm이 호출된다', () => {
    render(<AlertDialog {...defaultProps} />);
    const confirmButton = screen.getByText('확인');
    fireEvent.click(confirmButton);
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('사용자 정의 버튼 텍스트가 렌더링된다', () => {
    render(
      <AlertDialog {...defaultProps} cancelText="아니오" confirmText="예" />
    );
    expect(screen.getByText('아니오')).toBeInTheDocument();
    expect(screen.getByText('예')).toBeInTheDocument();
  });

  test('isError가 true일 때 취소 버튼이 렌더링되지 않는다', () => {
    render(<AlertDialog {...defaultProps} isError />);
    expect(screen.queryByText('취소')).not.toBeInTheDocument();
  });

  test('description이 없을 때 렌더링되지 않는다', () => {
    render(<AlertDialog {...defaultProps} description={undefined} />);
    expect(
      screen.queryByText('정말 삭제하시겠습니까?')
    ).not.toBeInTheDocument();
  });
});
