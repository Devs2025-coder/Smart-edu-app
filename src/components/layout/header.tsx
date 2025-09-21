"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Mountain, MoveRight, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS, USER_ROLES } from '@/lib/constants';

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

export function Header() {
  const pathname = usePathname();
  const isInPortal = PORTAL_PREFIXES.some((prefix) => pathname.startsWith(prefix));

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
          {isInPortal ? (
            <Button variant="outline" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </Link>
            </Button>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  );
}
