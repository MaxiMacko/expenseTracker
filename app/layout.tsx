import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track and manage expenses with a modern Next.js dashboard.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
