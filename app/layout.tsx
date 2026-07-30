import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Client Manager',
  description: 'Quản lý client của công ty',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
