
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

    const protectedPaths = ['/favorites', '/profile', '/settings', '/profile/edit'];
    const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

    if (!user && isProtectedPath) {
      if (!isRedirecting) {
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
  
  if (!user) {
    // For unauthenticated users, render a simpler layout without sidebar
    // but still show AppHeader and the children (e.g., community page, main redesign page if public)
    // The AppHeader will show Login/SignUp buttons.
    // Individual pages like /favorites will redirect if this layout is reached without a user.
    return (
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-grow px-4 py-8">
            {children}
          </main>
        </div>
    );
  }
  
  // If user is logged in, render the full app layout with sidebar
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-grow">
          <AppSidebar />
          <SidebarInset>
            {/* Removed container and mx-auto from here, let pages handle their own max-width */}
            <main className="flex-grow px-4 py-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
