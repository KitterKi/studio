import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: number; // For convenience, maps to h-X w-X tailwind classes
  text?: string;
}

export default function LoadingSpinner({ className, size = 10, text }: LoadingSpinnerProps) {
  const sizeClasses: { [key: number]: string } = {
    4: 'h-4 w-4',
    6: 'h-6 w-6',
    8: 'h-8 w-8',
    10: 'h-10 w-10',
    12: 'h-12 w-12',
    16: 'h-16 w-16',
    20: 'h-20 w-20',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-2" aria-live="polite" aria-busy="true">
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size] || 'h-10 w-10', className)} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}
