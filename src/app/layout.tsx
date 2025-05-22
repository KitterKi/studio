import type {Metadata} from 'next';
import { Inter } from 'next/font/google'; // Changed to Inter for a clean, modern look
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Added Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans', // Keep variable name for compatibility if theme uses it
});

export const metadata: Metadata = {
  title: 'StyleMyRoom',
  description: 'Redesign your room with AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} antialiased flex flex-col h-full`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
