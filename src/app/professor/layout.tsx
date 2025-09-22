
'use client';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Book,
  CalendarCheck,
  Home,
  LogOut,
  Settings,
  Mountain,
  LineChart,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/professor/dashboard', label: 'Dashboard', icon: Home },
  { href: '/professor/classes', label: 'Classes', icon: Book },
  { href: '/professor/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/professor/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/professor/reports', label: 'Reports', icon: LineChart },
  { href: '/professor/settings', label: 'Settings', icon: Settings },
];

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
           <div className="flex items-center gap-2 border-b p-2">
              <Mountain className="h-6 w-6" />
              <span className="text-lg font-semibold">EduTrack</span>
          </div>
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/prof/40/40" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">Dr. John Doe</span>
              <span className="text-xs text-muted-foreground">Professor</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={{ children: 'Logout' }}>
                <Link href="/login?role=professor">
                  <LogOut />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Professor Portal</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
