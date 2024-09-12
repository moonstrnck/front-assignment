import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/app/components/common/Button';

describe('Button 컴포넌트', () => {
  test('기본 props로 버튼을 렌더링한다', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass('button primary medium');
  });

  test('사용자 정의 테마로 버튼을 렌더링한다', () => {
    render(<Button theme="dangerous">Dangerous</Button>);
    const buttonElement = screen.getByRole('button', { name: /dangerous/i });
    expect(buttonElement).toHaveClass('button dangerous medium');
  });

  test('사용자 정의 크기로 버튼을 렌더링한다', () => {
    render(<Button size="large">Large Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /large button/i });
    expect(buttonElement).toHaveClass('button primary large');
  });

  test('사용자 정의 className으로 버튼을 렌더링한다', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom class/i });
    expect(buttonElement).toHaveClass('button primary medium custom-class');
  });

  test('클릭 시 onClick 핸들러를 호출한다', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled prop이 true일 때 버튼이 비활성화된다', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', {
      name: /disabled button/i,
    });
    expect(buttonElement).toBeDisabled();
  });
});
