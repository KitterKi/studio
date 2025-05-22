
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

  useEffect(() => {
    if (!isLoading && !user) {
      // User is not logged in, and auth state is resolved
      const isAuthPage = pathname === '/auth/signin' || pathname === '/auth/signup';
      const isCommunityPage = pathname === '/community';

      if (!isAuthPage && !isCommunityPage) {
        // If not on an auth page and not on the community page,
        // and not already trying to go to an auth page, redirect to signin.
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

  // If not loading, but user is null and we are on a protected page,
  // useEffect is attempting to redirect. Show a temporary message.
  if (!user) {
    const isAuthPage = pathname === '/auth/signin' || pathname === '/auth/signup';
    const isCommunityPage = pathname === '/community';
    // This condition ensures we only show "Redirecting..." if we are on a page that *requires* auth
    // and we are not on an auth page itself (which have their own layout) or the public community page.
    if (!isAuthPage && !isCommunityPage) {
      return (
        <div className="flex flex-col flex-grow h-screen items-center justify-center bg-background">
          <p>Redirecting to login...</p>
          <LoadingSpinner size={16} />
        </div>
      );
    }
    // If !user but on /community or an auth page (handled by (auth) layout), proceed.
  }

  // Render the main app layout if:
  // 1. User is logged in.
  // 2. User is not logged in, BUT the current path is /community (which is public within this layout group).
  // Auth pages (/auth/signin, /auth/signup) have their own layout and won't hit this return.
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex flex-grow">
          {user && <AppSidebar />} {/* Sidebar is only rendered if there's a user */}
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
