
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
  Home,
  LogOut,
  Settings,
  Users,
  PlusCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/college-admin/dashboard', label: 'Dashboard', icon: Home },
  { href: '/college-admin/manage-users', label: 'Manage Users', icon: Users },
  { href: '/college-admin/add-user', label: 'Add User', icon: PlusCircle },
  { href: '/college-admin/settings', label: 'Settings', icon: Settings },
];

export default function CollegeAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src="https://picsum.photos/seed/admin/40/40" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold">Admin Name</span>
              <span className="text-xs text-muted-foreground">College Admin</span>
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
                <Link href="/login?role=college-admin">
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
          <h1 className="text-xl font-semibold">College Admin Portal</h1>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
