import type { SVGProps } from 'react';
import { Home, Wand2 } from 'lucide-react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <Home className="h-6 w-6 text-primary" />
      <Wand2 className="h-6 w-6 text-primary" />
    </div>
  );
}
