
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
import {
  Home,
  LogOut,
  Settings,
  Mountain,
  LineChart,
  ClipboardList,
  MessageSquare,
  Bell,
  CalendarCheck,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';

const menuItems = [
  { href: '/parent/dashboard', label: 'Dashboard', icon: Home },
  { href: '/parent/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/parent/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/parent/reports', label: 'Reports', icon: LineChart },
  { href: '/parent/communication', label: 'Messages', icon: MessageSquare },
  { href: '/parent/notifications', label: 'Notifications', icon: Bell },
  { href: '/parent/settings', label: 'Settings', icon: Settings },
];

export default function ParentLayout({
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
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={{ children: item.label }}
                  href={item.href}
                  as={Link}
                >
                    <item.icon />
                    <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                tooltip={{ children: 'Logout' }}
                href="/login?role=parent"
                as={Link}
                >
                  <LogOut />
                  <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
