import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'EduTrack - Smart Curriculum & Attendance Management',
  description:
    'Automate attendance, suggest personalized tasks, and boost productivity for schools and colleges.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
