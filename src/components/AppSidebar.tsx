
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
  useSidebar, 
} from '@/components/ui/sidebar';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { APP_NAME, SIDEBAR_NAV_ITEMS_AUTHENTICATED, SIDEBAR_NAV_ITEMS_UNAUTHENTICATED } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const router = NextUseRouter();
  const { isMobile, setOpenMobile } = useSidebar(); 

  const navItems = user ? SIDEBAR_NAV_ITEMS_AUTHENTICATED : SIDEBAR_NAV_ITEMS_UNAUTHENTICATED;

  const handleNavigationClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      const names = name.split(' ');
      if (names.length > 1) {
        return (names[0][0] + (names[names.length - 1][0] || '')).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) return email.substring(0, 2).toUpperCase();
    return 'U';
  }

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
                  onClick={handleNavigationClick} 
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
                  {/* For mock auth, no photoURL */}
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${getInitials(user.name, user.email)}`} alt={user.name || "Avatar"} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{getInitials(user.name, user.email)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.name || 'Usuario'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
             </div>
            <Button variant="ghost" onClick={() => { logout(); handleNavigationClick(); }} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
           <div className="hidden group-data-[collapsible=icon]:flex flex-col items-center space-y-2 p-2">
             <Button variant="ghost" size="icon" onClick={() => { router.push('/profile'); handleNavigationClick(); }} title="Perfil">
                <UserCircle className="h-5 w-5" />
             </Button>
             <Button variant="ghost" size="icon" onClick={() => { logout(); handleNavigationClick(); }} title="Cerrar Sesión">
                <LogOut className="h-5 w-5" />
             </Button>
           </div>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
