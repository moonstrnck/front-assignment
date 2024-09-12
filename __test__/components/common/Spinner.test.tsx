import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Spinner from '@/app/components/common/Spinner';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

describe('Spinner 컴포넌트', () => {
  test('스피너 오버레이가 렌더링된다', () => {
    render(<Spinner />);
    const overlay = screen.getByTestId('spinner-overlay');
    expect(overlay).toBeInTheDocument();
  });

  test('스피너 이미지가 올바른 속성으로 렌더링된다', () => {
    render(<Spinner />);
    const spinnerImage = screen.getByAltText('로딩 중');
    expect(spinnerImage).toBeInTheDocument();
    expect(spinnerImage).toHaveAttribute('src', '/images/icon-spinner.gif');
    expect(spinnerImage).toHaveAttribute('width', '70');
    expect(spinnerImage).toHaveAttribute('height', '70');
  });

  test('스피너 이미지에 올바른 클래스가 적용된다', () => {
    render(<Spinner />);
    const spinnerImage = screen.getByAltText('로딩 중');
    expect(spinnerImage).toHaveClass('spinner');
  });
});
