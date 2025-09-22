
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  CalendarPlus,
  Percent,
  KeyRound,
  Copy,
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const MOCK_INSTITUTION_CODE = 'GWOOD9876';

export default function SchoolAdminDashboardPage() {
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MOCK_INSTITUTION_CODE);
    toast({
      title: 'Copied!',
      description: 'Institution code has been copied to your clipboard.',
    });
  };

  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Your Institution Code
            </CardTitle>
            <KeyRound className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold tracking-widest border-dashed border-2 rounded-md px-4 py-2">
                {MOCK_INSTITUTION_CODE}
              </div>
              <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Share this code with new users for registration.
            </p>
          </CardContent>
        </Card>
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground">+20 from last month</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">25</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Parents</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">420</div>
                <p className="text-xs text-muted-foreground">93% parent accounts linked</p>
            </CardContent>
            </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your institution's core operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild>
            <Link href="/school-admin/users?tab=teachers">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Teacher
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/school-admin/users?tab=students">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Student
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/school-admin/users?tab=parents">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Parent
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/school-admin/events">
              <CalendarPlus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
