

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, School, UserCheck, BarChart, Bell } from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,850</div>
            <p className="text-xs text-muted-foreground">
              Across all institutions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">985</div>
            <p className="text-xs text-muted-foreground">
              Platform-wide engagement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Registrations</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Institutions awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Analytics</CardTitle>
          <CardDescription>
            An overview of platform-wide activity.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            User Roles Distribution
                        </CardTitle>
                         <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p>College Admins: 12</p>
                        <p>Professors: 250</p>
                        <p>Students: 1,588</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Attendance Marking Activity
                        </CardTitle>
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,453</div>
                         <p className="text-xs text-muted-foreground">
                            QR scans in the last 24 hours
                        </p>
                    </CardContent>
                </Card>
           </div>
        </CardContent>
      </Card>
    </div>
  );
}
