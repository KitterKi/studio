
import type { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { APP_NAME } from '@/lib/constants';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors">
          <LogoIcon />
          <span className="text-2xl font-semibold">{APP_NAME}</span>
        </Link>
      </div>
      <Card className="w-full max-w-md shadow-xl">
        {children}
      </Card>
       <p className="mt-8 text-center text-sm text-muted-foreground">
        Volver a la <Link href="/" className="text-primary hover:underline">Página de Inicio</Link>
      </p>
    </div>
  );
}
