
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
  Mountain,
  Settings,
  Users,
  CalendarDays,
  BarChart,
  Megaphone,
  LineChart,
  School,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';

const menuItems = [
  { href: '/school-admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/school-admin/users', label: 'Manage Users', icon: Users },
  { href: '/school-admin/classes', label: 'Classes & Sections', icon: School },
  { href: '/school-admin/attendance', label: 'Attendance', icon: BarChart },
  { href: '/school-admin/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/school-admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/school-admin/reports', label: 'Reports', icon: LineChart },
  { href: '/school-admin/events', label: 'Events', icon: Calendar },
  { href: '/school-admin/settings', label: 'Settings', icon: Settings },
];

export default function SchoolAdminLayout({
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
                <Link href="/login?role=school-admin">
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
