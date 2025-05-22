
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants'; // Import APP_NAME

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export const metadata: Metadata = {
  title: APP_NAME, // Use APP_NAME
  description: 'Rediseña tu habitación con IA',
};

const InitializeTheme = () => {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');
        var root = document.documentElement;
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches && theme !== 'light')) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <head>
        <InitializeTheme />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col h-full bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
