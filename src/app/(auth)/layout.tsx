
import type { ReactNode } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { APP_NAME } from '@/lib/constants';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
       <Link href="/" className="flex items-center gap-2 mb-8" aria-label={`${APP_NAME} home page`}>
          <LogoIcon />
          <span className="font-semibold text-2xl text-foreground">{APP_NAME}</span>
        </Link>
      {children}
    </div>
  );
}
