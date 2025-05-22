
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const IS_AUTH_PATH = pathname.startsWith('/auth/');
  const PROTECTED_PATHS = ['/favorites', '/profile']; // Routes requiring login
  const PUBLIC_APP_SHELL_PATHS = ['/', '/community']; // Routes using AppHeader but not necessarily AppSidebar when logged out

  useEffect(() => {
    if (!isLoading && !user) {
      // If on a protected path and not an auth path itself, redirect to signin
      if (PROTECTED_PATHS.includes(pathname) && !IS_AUTH_PATH) {
        router.replace('/auth/signin');
      }
    }
  }, [user, isLoading, router, pathname, IS_AUTH_PATH]);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-grow h-screen items-center justify-center bg-background">
        <LoadingSpinner text="Loading application..." size={20} />
      </div>
    );
  }

  // If this layout is somehow active for an auth path, pass children through.
  // The (auth)/layout.tsx should ideally handle these routes.
  if (IS_AUTH_PATH) {
    return <>{children}</>;
  }

  // User is logged in: Render full app layout with sidebar
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

  // No user, but on a public page that uses the app shell (header, no sidebar)
  if (!user && PUBLIC_APP_SHELL_PATHS.includes(pathname)) {
    return (
      <SidebarProvider> {/* SidebarProvider might be needed for useSidebar hook in AppHeader */}
        <div className="flex flex-col min-h-screen">
          <AppHeader /> {/* Header will show Sign In / Sign Up */}
          <div className="flex flex-grow">
            {/* No AppSidebar for non-logged-in users */}
            <SidebarInset className="md:ml-0"> {/* Ensure main content takes full width */}
              <main className="flex-grow container mx-auto px-4 py-8">
                {children}
              </main>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // No user and on a protected path: useEffect is redirecting. Show a message.
  if (!user && PROTECTED_PATHS.includes(pathname)) {
    return (
      <div className="flex flex-col flex-grow h-screen items-center justify-center bg-background">
        <LoadingSpinner text="Redirecting to login..." size={16} />
      </div>
    );
  }
  
  // Fallback for any other scenario (e.g., a new route within (app) group not defined as public or protected)
  // This could also indicate that the child component is trying to render before the redirect logic has a chance to run.
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background">
       <LoadingSpinner text="Verifying access..." size={16} />
      {/* Consider adding a more specific error or a link to the homepage */}
    </div>
  );
}
