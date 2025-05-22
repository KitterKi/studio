
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import InitialLoadingScreen from '@/components/InitialLoadingScreen';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setIsRedirecting(false); 
      return;
    }

    // Define protected paths that require authentication
    // The main page "/" is now protected.
    const protectedPaths = ['/', '/favorites', '/profile', '/settings', '/profile/edit']; 
    const isProtectedPath = protectedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));

    if (!user && isProtectedPath) {
      if (!isRedirecting) {
        console.log(`[AppGroupLayout] User not authenticated, trying to access protected path: ${pathname}. Redirecting to signin.`);
        setIsRedirecting(true);
        router.replace('/auth/signin');
      }
    } else {
      if (isRedirecting) {
        setIsRedirecting(false);
      }
    }
  }, [user, isLoading, router, pathname, isRedirecting]);

  if (isLoading || (isRedirecting && !pathname.startsWith('/auth/'))) {
    return <InitialLoadingScreen />;
  }
  
  return (
    <SidebarProvider>
      {!user ? (
        // For unauthenticated users, render a simpler layout for non-protected pages (e.g. /community)
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-grow px-4 py-8">
            {children}
          </main>
        </div>
      ) : (
        // If user is logged in, render the full app layout with sidebar
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <div className="flex flex-grow">
            <AppSidebar />
            <SidebarInset>
              <main className="flex-grow px-4 py-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
