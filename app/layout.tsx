import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KapoorOS 24.04 LTS',
  description: 'Ankush Kapoor — Full-Stack Developer & UI Engineer',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="overflow-hidden select-none" suppressHydrationWarning>{children}</body>
    </html>
  );
}
