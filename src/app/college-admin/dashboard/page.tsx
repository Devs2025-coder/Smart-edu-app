
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, KeyRound, Users, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const MOCK_INSTITUTION_CODE = 'NWOOD1234';

export default function CollegeAdminDashboardPage() {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(MOCK_INSTITUTION_CODE);
    toast({
      title: "Copied!",
      description: "Institution code has been copied to your clipboard.",
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>Welcome back, Admin!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-primary/5 border-primary/20">
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
                  Share this code with your professors and students to allow them to register.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">150</div>
                <p className="text-xs text-muted-foreground">
                  (120 Students, 30 Professors)
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your institution's users and settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild>
            <Link href="/college/add-user">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add User
            </Link>
          </Button>
           <Button asChild variant="secondary">
            <Link href="/college/manage-users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
