'use client'; // AppHeader uses usePathname, so this layout needs to be client component or AppHeader needs to be refactored.
// For simplicity, making this a client component. Ideally, AppHeader's active link logic could be server-side compatible if possible.
// Or, a client component wrapper for NavLink inside AppHeader.
// Let's make AppHeader itself a client component and NavLink part of it for this to work.
// The AppHeader provided is already structured to handle this if NavLink becomes part of it or AppHeader itself is client.
// If AppHeader is imported here, and AppHeader itself is a client component, this layout can be a server component.
// Let's assume AppHeader is a client component because of NavLink using usePathname.

import AppHeader from '@/components/AppHeader';

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-grow">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
