
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AppSidebar from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'; // Assuming SidebarTrigger might be part of AppHeader now
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/auth/signin' && pathname !== '/auth/signup') {
      // Allow access to community page even if not logged in, if it's part of (app) group
      // For this setup, (app) group routes are protected.
      // If community page needs to be public, it should be outside this layout or this logic adjusted.
      // For now, all (app) routes are protected.
      if (pathname !== '/community') { // Example: if community is public within (app)
         router.replace('/auth/signin');
      } else if (pathname === '/community' && !user) {
        // Allow viewing community page if not logged in
        // The page itself can handle what to show/hide for non-logged in users
      } else if (pathname !== '/community') {
         router.replace('/auth/signin');
      }
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex flex-col flex-grow h-screen items-center justify-center bg-background">
        <LoadingSpinner text="Loading application..." size={20} />
      </div>
    );
  }

  // If user is not logged in and we are not on an auth page (already handled by useEffect for redirection)
  // still show a loading or minimal UI to prevent flashing content.
  // The useEffect should handle redirection, so this is a fallback.
  if (!user && pathname !== '/community') { // Adjusted to allow community page
     return (
      <div className="flex flex-col flex-grow h-screen items-center justify-center bg-background">
        <p>Redirecting to login...</p>
        <LoadingSpinner size={16} />
      </div>
    );
  }


  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <AppHeader /> {/* AppHeader will contain SidebarTrigger */}
        <div className="flex flex-grow">
          {user && <AppSidebar />} {/* Conditionally render sidebar if user is logged in */}
          <SidebarInset className={user ? "" : "md:ml-0"}> {/* Adjust margin if sidebar is not present */}
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
