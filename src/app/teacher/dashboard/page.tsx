

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ClipboardList, Users, MessageSquare, Bell, BookOpen, Lightbulb, UserCheck, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function TeacherDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 remaining today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Status
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              for today's classes
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
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              2 tasks due today
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 from Admin, 2 from parents
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump right into your most common tasks.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild>
            <Link href="/teacher/attendance">
              <UserCheck className="mr-2 h-4 w-4" />
              Mark Attendance
            </Link>
          </Button>
           <Button asChild variant="secondary">
            <Link href="/teacher/tasks">
                <PlusCircle className="mr-2 h-4 w-4" />
                Assign Task
            </Link>
          </Button>
          <Button asChild variant="secondary">
             <Link href="/teacher/parent-communication">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Parent Note
            </Link>
          </Button>
           <Button asChild variant="secondary">
             <Link href="/teacher/reports">
                <ClipboardList className="mr-2 h-4 w-4" />
                View Reports
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-primary" /> Suggested Activities</CardTitle>
          <CardDescription>
            AI-powered suggestions to engage students who finish early.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Reading Activity: "The Solar System"</p>
                <p className="text-sm text-muted-foreground">
                  15 min | For students interested in space.
                </p>
              </div>
               <Button variant="ghost" size="sm" className="ml-auto">Assign</Button>
            </li>
            <li className="flex items-start gap-4">
              <div className="rounded-full bg-accent/20 p-2">
                <ClipboardList className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">Quiz: "Fractions Challenge"</p>
                <p className="text-sm text-muted-foreground">
                  20 min | Reinforce concepts from today's math class.
                </p>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">Assign</Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
