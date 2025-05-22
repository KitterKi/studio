import Link from 'next/link';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation'; // Correct hook for App Router

// Client component to use usePathname
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} legacyBehavior passHref>
      <Button variant="ghost" className={cn(isActive && 'bg-accent text-accent-foreground')}>
        {children}
      </Button>
    </Link>
  );
};


export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} home page`}>
          <LogoIcon />
          <span className="font-semibold text-xl">{APP_NAME}</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink href="/">Redesign</NavLink>
          <NavLink href="/community">Community</NavLink>
        </nav>
      </div>
    </header>
  );
}
