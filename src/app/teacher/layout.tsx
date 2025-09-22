

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
  Book,
  CalendarCheck,
  Home,
  LogOut,
  Settings,
  Mountain,
  LineChart,
  ClipboardList,
  MessageSquare,
  Users,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';

const menuItems = [
  { href: '/teacher/dashboard', label: 'Dashboard', icon: Home },
  { href: '/teacher/class-management', label: 'Class Management', icon: Users },
  { href: '/teacher/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/teacher/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/teacher/reports', label: 'Reports', icon: LineChart },
  { href: '/teacher/parent-communication', label: 'Parent Communication', icon: MessageSquare },
  { href: '/teacher/notifications', label: 'Notifications', icon: Bell },
  { href: '/teacher/settings', label: 'Settings', icon: Settings },
];

export default function TeacherLayout({
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
                <Link href="/login?role=teacher">
                  <LogOut />
                  <span>Logout</span>
                </Link>
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
