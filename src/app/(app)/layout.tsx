
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
      const isAuthPath = pathname.startsWith('/auth/');
      const isCommunityPage = pathname === '/community';

      if (!isAuthPath && !isCommunityPage) {
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

  const isAuthPath = pathname.startsWith('/auth/');
  const isCommunityPage = pathname === '/community';

  // If no user and on a protected page (not auth, not community),
  // a redirect is in progress. Show a clear "Redirecting..." message.
  if (!user && !isAuthPath && !isCommunityPage) {
    return (
      <div className="flex flex-col flex-grow h-screen items-center justify-center bg-background">
        <LoadingSpinner text="Redirecting to login..." size={16} />
      </div>
    );
  }

  // Render the main app layout if:
  // 1. User is logged in.
  // OR
  // 2. User is not logged in, BUT the current path is /community.
  // For auth paths (/auth/signin, etc.), Next.js should use the (auth)/layout.tsx,
  // so this (app)/layout.tsx should not render its main UI for those paths.
  if (user || isCommunityPage) {
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
  
  // If it's an auth path (e.g., /auth/signin) and we've reached here,
  // it means `!user` and `isAuthPath` is true.
  // In this scenario, the (auth)/layout.tsx is responsible for rendering.
  // This (app)/layout.tsx should simply pass through the children, which
  // will be the content from the (auth) route group (e.g., SignInPage).
  if (isAuthPath) {
    return <>{children}</>;
  }

  // Fallback for any other unexpected state, though ideally covered.
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-background">
      <p>An unexpected state was reached. Please try refreshing.</p>
    </div>
  );
}
