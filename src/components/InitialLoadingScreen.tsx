
import { PandaIcon } from '@/components/icons/PandaIcon';
import { APP_NAME } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

export default function InitialLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center gap-6 p-8 rounded-lg shadow-2xl bg-card">
        <PandaIcon className="h-24 w-24 sm:h-32 sm:w-32 text-primary" />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
          {APP_NAME}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground mt-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm">Loading your experience...</p>
        </div>
      </div>
       <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </p>
    </div>
  );
}
