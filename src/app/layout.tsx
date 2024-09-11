import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './styles/globals.scss';

const pretendard = localFont({
  src: './fonts/PretendardVariable.woff2',
  variable: '--font-pretendard',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Todo List',
  description: 'Todo List',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pretendard.variable}`}>{children}</body>
    </html>
  );
}
