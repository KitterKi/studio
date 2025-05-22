
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      {/* Minimal Auth Layout Wrapper */}
      {children}
    </div>
  );
}
