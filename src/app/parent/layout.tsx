
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
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    as="a"
                    isActive={pathname.startsWith(item.href)}
                    tooltip={{ children: item.label }}
                  >
                      <item.icon />
                      <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/login?role=parent" passHref legacyBehavior>
                <SidebarMenuButton 
                  as="a"
                  tooltip={{ children: 'Logout' }}
                  >
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </Link>
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
