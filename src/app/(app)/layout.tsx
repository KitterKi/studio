
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import InitialLoadingScreen from '@/components/InitialLoadingScreen'; // Import the new loading screen

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If authentication is still loading, don't do anything yet.
    if (isLoading) {
      return;
    }

    // If not loading, no user, and not on an auth path already, redirect to signin.
    // All routes under (app) are now protected.
    if (!user && !pathname.startsWith('/auth/')) {
      router.replace('/auth/signin');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return <InitialLoadingScreen />;
  }

  // If there's no user and we're not on an auth path,
  // we are in the process of redirecting. Show the loading screen to avoid content flash.
  if (!user && !pathname.startsWith('/auth/')) {
    return <InitialLoadingScreen />;
  }

  // If user is logged in, render the full app layout
  if (user) {
    return (
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <div className="flex flex-grow">
            <AppSidebar />
            <SidebarInset>
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    );
  }
  
  // Fallback for any other scenario (e.g. an auth page somehow trying to use this layout)
  // This should ideally not be reached if routing is set up correctly.
  return <InitialLoadingScreen />;
}
