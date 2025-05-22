
'use client';

import { useEffect, useState } from 'react'; // Added useState
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
  const [isRedirecting, setIsRedirecting] = useState(false); // Added state for redirect

  useEffect(() => {
    if (isLoading) {
      setIsRedirecting(false); // Reset redirecting state if auth is still loading
      return;
    }

    if (!user && !pathname.startsWith('/auth/')) {
      if (!isRedirecting) {
        setIsRedirecting(true);
        router.replace('/auth/signin');
      }
    } else {
      // If user exists or we are on an auth path, we are not trying to redirect from here.
      if (isRedirecting) {
        setIsRedirecting(false);
      }
    }
  }, [user, isLoading, router, pathname, isRedirecting]); // Added isRedirecting to dependencies

  if (isLoading || isRedirecting) { // Show loading screen if auth is loading OR if redirecting
    return <InitialLoadingScreen />;
  }

  // If not loading, not redirecting, and no user,
  // this implies we are on an auth path (which AppGroupLayout shouldn't handle)
  // or something else is wrong. The redirect should have happened.
  // For safety, if somehow user is null here and we are not on an auth path, show loading.
  // However, the isRedirecting flag should cover this.
  if (!user && !pathname.startsWith('/auth/')) {
     // This case should ideally be covered by isRedirecting flag making the above block true
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
  
  // Fallback if user is null but we are on an auth path (handled by AuthLayout)
  // or if none of the above conditions met (should not happen for app routes).
  // If on an app route and !user, the isRedirecting logic should show InitialLoadingScreen.
  return <InitialLoadingScreen />;
}
