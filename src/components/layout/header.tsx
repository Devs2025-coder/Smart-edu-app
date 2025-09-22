
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Mountain, MoveRight, LogOut, Settings, User } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS, USER_ROLES } from '@/lib/constants';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarTrigger } from '../ui/sidebar';

const PORTAL_PREFIXES = [
  '/professor',
  '/student',
  '/college-admin',
  '/school-admin',
  '/teacher',
  '/parent',
  '/super-admin',
];

const LoginMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">Login</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {USER_ROLES.map((role) => (
        <DropdownMenuItem key={role} asChild>
          <Link href={`/login?role=${role.toLowerCase().replace(' ', '-')}`}>
            {role}
          </Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const getPortalInfo = (pathname: string) => {
  if (pathname.startsWith('/professor')) {
    return {
      role: 'professor',
      name: 'Dr. John Doe',
      avatarUrl: 'https://picsum.photos/seed/prof/40/40',
      avatarFallback: 'JD',
      settingsUrl: '/professor/settings',
      logoutUrl: '/login?role=professor',
    };
  }
  if (pathname.startsWith('/student')) {
    return {
      role: 'student',
      name: 'Sarah Miller',
      avatarUrl: 'https://picsum.photos/seed/student/40/40',
      avatarFallback: 'SM',
      settingsUrl: '/student/settings',
      logoutUrl: '/login?role=student',
    };
  }
  if (pathname.startsWith('/college-admin')) {
    return {
      role: 'college-admin',
      name: 'Admin Name',
      avatarUrl: 'https://picsum.photos/seed/admin/40/40',
      avatarFallback: 'AD',
      settingsUrl: '/college-admin/settings',
      logoutUrl: '/login?role=college-admin',
    };
  }
   if (pathname.startsWith('/teacher')) {
    return {
      role: 'teacher',
      name: 'Ms. Priya Sharma',
      avatarUrl: 'https://picsum.photos/seed/teacher/40/40',
      avatarFallback: 'PS',
      settingsUrl: '/teacher/settings',
      logoutUrl: '/login?role=teacher',
    };
  }
  if (pathname.startsWith('/parent')) {
    return {
      role: 'parent',
      name: 'Mr. Patel',
      avatarUrl: 'https://picsum.photos/seed/parent/40/40',
      avatarFallback: 'AP',
      settingsUrl: '/parent/settings',
      logoutUrl: '/login?role=parent',
    };
  }
  if (pathname.startsWith('/school-admin')) {
    return {
      role: 'school-admin',
      name: 'School Admin',
      avatarUrl: 'https://picsum.photos/seed/school-admin/40/40',
      avatarFallback: 'SA',
      settingsUrl: '/school-admin/settings',
      logoutUrl: '/login?role=school-admin',
    };
  }
  return null;
};

export function Header() {
  const pathname = usePathname();
  const isInPortal = PORTAL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const portalInfo = getPortalInfo(pathname);

  if (isInPortal) {
    let portalTitle = 'Portal';
    if(portalInfo?.role) {
       portalTitle = portalInfo?.role.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Portal';
    }

    return (
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">
            {portalTitle}
          </h1>
        </div>
        {portalInfo && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={portalInfo.avatarUrl} alt={portalInfo.name} />
                  <AvatarFallback>{portalInfo.avatarFallback}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{portalInfo.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {portalInfo.role.replace('-', ' ')}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={portalInfo.settingsUrl}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={portalInfo.logoutUrl}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Mountain className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">EduTrack</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <Mountain className="h-6 w-6" />
                <span className="font-bold">EduTrack</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-semibold text-foreground/90 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <>
              <div className="hidden md:flex items-center space-x-2">
                <LoginMenu />
                <Button asChild>
                  <Link href="/register">
                    Register <MoveRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="md:hidden">
                <LoginMenu />
              </div>
            </>
        </div>
      </div>
    </header>
  );
}
