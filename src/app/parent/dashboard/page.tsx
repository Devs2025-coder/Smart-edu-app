
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList, MessageSquare, Bell, CheckCircle, Percent, LineChart } from 'lucide-react';
import Link from 'next/link';

export default function ParentDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Attendance
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Present</div>
            <p className="text-xs text-muted-foreground">
              for all classes today.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Tasks
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 task is overdue.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Performance Snapshot
            </CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">85% Attendance</div>
            <p className="text-xs text-muted-foreground">
              70% Task Completion
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              1 from Admin, 1 from teacher
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>
            Jump right into the most important sections.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="secondary">
            <Link href="/parent/attendance">
              <Calendar className="mr-2 h-4 w-4" />
              View Attendance History
            </Link>
          </Button>
           <Button asChild>
            <Link href="/parent/tasks">
                <ClipboardList className="mr-2 h-4 w-4" />
                Check Pending Tasks
            </Link>
          </Button>
          <Button asChild variant="secondary">
             <Link href="/parent/communication">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Teacher
            </Link>
          </Button>
           <Button asChild variant="secondary">
             <Link href="/parent/reports">
                <LineChart className="mr-2 h-4 w-4" />
                View Reports
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            A summary of recent events and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">New Task Assigned: 'Science - Chapter 5 Quiz'</p>
                <p className="text-sm text-muted-foreground">
                  Due in 3 days
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="rounded-full bg-accent/20 p-2">
                <Bell className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">School Announcement: Parent-Teacher meeting next Friday.</p>
                <p className="text-sm text-muted-foreground">1 day ago</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
