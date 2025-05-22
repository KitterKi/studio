
'use client';

import Link from 'next/link';
import { usePathname, useRouter as NextUseRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { APP_NAME, SIDEBAR_NAV_ITEMS_AUTHENTICATED, SIDEBAR_NAV_ITEMS_UNAUTHENTICATED } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const router = NextUseRouter();

  const navItems = user ? SIDEBAR_NAV_ITEMS_AUTHENTICATED : SIDEBAR_NAV_ITEMS_UNAUTHENTICATED;

  if (isLoading) {
    return (
       <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="flex items-center justify-center p-2 group-data-[collapsible=icon]:justify-center">
           <div className="group-data-[collapsible=icon]:hidden flex items-center gap-2">
            <LogoIcon />
            <span className="font-semibold text-xl">{APP_NAME}</span>
          </div>
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
            <LogoIcon />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {/* Skeleton items */}
        </SidebarContent>
      </Sidebar>
    );
  }


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center justify-between group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
        <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden" aria-label={`${APP_NAME} página de inicio`}>
          <LogoIcon />
          <span className="font-semibold text-xl">{APP_NAME}</span>
        </Link>
         <Link href="/" className="hidden items-center gap-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center" aria-label={`${APP_NAME} página de inicio`}>
          <LogoIcon />
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  variant="default"
                  size="default"
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  className={cn(
                    "w-full justify-start",
                    {'bg-sidebar-accent text-sidebar-accent-foreground': pathname === item.href}
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {user && (
        <SidebarFooter className="p-2 border-t border-sidebar-border">
           <div className="group-data-[collapsible=icon]:hidden p-2 space-y-2">
             <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name ? user.name.substring(0,1) : user.email.substring(0,1)}`} alt={user.name || user.email} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{user.name ? user.name.substring(0, 2).toUpperCase() : user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.name || 'Usuario'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
             </div>
            <Button variant="ghost" onClick={logout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
           <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center space-y-2 p-2">
             <Button variant="ghost" size="icon" onClick={() => router.push('/profile')} title="Perfil">
                <UserCircle className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={logout} title="Cerrar Sesión">
                <LogOut className="h-5 w-5" />
             </Button>
           </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
