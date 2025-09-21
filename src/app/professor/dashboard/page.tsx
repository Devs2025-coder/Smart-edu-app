import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Book, Calendar, Users } from 'lucide-react';
import Link from 'next/link';

export default function ProfessorDashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Courses
            </CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              Courses assigned for this semester
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              Across all your courses
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Classes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Classes scheduled for today
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
          <Link href="/professor/attendance">
            <Button className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Take Attendance
            </Button>
          </Link>
          <Link href="/professor/courses">
            <Button variant="secondary" className="w-full justify-start">
              <Book className="mr-2 h-4 w-4" />
              View My Courses
            </Button>
          </Link>
          <Link href="/professor/students">
            <Button variant="secondary" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Students
            </Button>
          </Link>
          <Link href="/professor/settings">
            <Button variant="secondary" className="w-full justify-start">
               <ArrowRight className="mr-2 h-4 w-4" />
               View All Activities
            </Button>
          </Link>
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
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Attendance marked for CS101</p>
                <p className="text-sm text-muted-foreground">
                  95% present - 2 hours ago
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="rounded-full bg-accent/20 p-2">
                <Users className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="font-medium">New student enrolled in PH203</p>
                <p className="text-sm text-muted-foreground">1 day ago</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
