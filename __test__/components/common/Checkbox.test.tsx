import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox from '@/app/components/common/Checkbox';

describe('Checkbox 컴포넌트', () => {
  test('체크박스를 기본 props로 렌더링한다', () => {
    render(<Checkbox />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeInTheDocument();
    expect(checkboxElement).not.toBeChecked();
  });

  test('레이블이 있는 체크박스를 렌더링한다', () => {
    const label = '테스트 레이블';
    render(<Checkbox label={label} />);
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  test('사용자 정의 className으로 체크박스를 렌더링한다', () => {
    const customClass = 'custom-checkbox';
    render(<Checkbox className={customClass} />);
    const checkmarkElement = screen.getByTestId('checkmark');
    expect(checkmarkElement).toHaveClass(customClass);
  });

  test('사용자 정의 id로 체크박스를 렌더링한다', () => {
    const customId = 'custom-checkbox-id';
    render(<Checkbox id={customId} />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toHaveAttribute('id', customId);
  });

  test('클릭 시 체크박스 상태를 변경한다', () => {
    render(<Checkbox />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).not.toBeChecked();

    fireEvent.click(checkboxElement);
    expect(checkboxElement).toBeChecked();

    fireEvent.click(checkboxElement);
    expect(checkboxElement).not.toBeChecked();
  });

  test('disabled 상태의 체크박스를 렌더링한다', () => {
    render(<Checkbox disabled />);
    const checkboxElement = screen.getByRole('checkbox');
    expect(checkboxElement).toBeDisabled();
  });

  test('onChange 핸들러를 호출한다', () => {
    const handleChange = jest.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkboxElement = screen.getByRole('checkbox');

    fireEvent.click(checkboxElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
