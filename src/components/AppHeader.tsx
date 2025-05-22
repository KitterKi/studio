
'use client';

import Link from 'next/link';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { APP_NAME } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import UserNav from './UserNav';
import { LogIn, UserPlus } from 'lucide-react';

export default function AppHeader() {
  const { user, isLoading } = useAuth();
  const { isMobile, toggleSidebar, openMobile, setOpenMobile } = useSidebar(); // Get sidebar state if needed for trigger visibility

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {user && ( // Show sidebar trigger only if user is logged in and sidebar is part of the layout
            <SidebarTrigger className="md:hidden" onClick={() => setOpenMobile(!openMobile)} /> // For mobile
          )}
          <Link href="/" className="flex items-center gap-2" aria-label={`${APP_NAME} home page`}>
            <LogoIcon />
            <span className="font-semibold text-xl">{APP_NAME}</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse bg-muted rounded-md"></div>
          ) : user ? (
            <UserNav />
          ) : (
            <>
              <Link href="/auth/signin" passHref legacyBehavior>
                <Button variant="ghost">
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </Button>
              </Link>
              <Link href="/auth/signup" passHref legacyBehavior>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
