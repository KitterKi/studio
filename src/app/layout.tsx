
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google'; // Cambiado de Inter a Manrope
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { APP_NAME } from '@/lib/constants';

// Configuración de la nueva fuente Manrope
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope', // Nueva variable CSS para Manrope
  display: 'swap',
});

export const metadata: Metadata = {
  title: APP_NAME,
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
      {/* Aplicada la nueva variable de fuente */}
      <body className={`${manrope.variable} font-sans antialiased flex flex-col h-full bg-background text-foreground`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
