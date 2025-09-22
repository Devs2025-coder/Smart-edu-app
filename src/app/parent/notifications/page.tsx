
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Bell, CalendarCheck, Check, ClipboardList, Settings, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const notifications = [
  {
    id: 1,
    type: 'task',
    title: "New Task Assigned: 'Science - Chapter 5 Quiz'",
    description: 'Dr. Jones has assigned a new quiz for your child. Due in 3 days.',
    date: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'announcement',
    title: 'School Announcement: Parent-Teacher meeting next Friday.',
    description: 'The quarterly parent-teacher meeting is scheduled for next week. Please book your slot.',
    date: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'attendance',
    title: 'Attendance Alert: Your child was marked absent today.',
    description: 'Your child was marked absent for the Math class on Oct 10, 2024.',
    date: '2 days ago',
    read: true,
  },
  {
    id: 4,
    type: 'deadline',
    title: 'Deadline Reminder: History Essay',
    description: 'The submission deadline for the Roman Empire essay is tomorrow.',
    date: '3 days ago',
    read: true,
  },
   {
    id: 5,
    type: 'announcement',
    title: 'Library hours extended during exams',
    description: 'The main library will be open 24/7 from next week for exam preparation.',
    date: '4 days ago',
    read: true,
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'task':
    case 'deadline':
      return <ClipboardList className="h-5 w-5 text-primary" />;
    case 'announcement':
      return <Bell className="h-5 w-5 text-accent-foreground" />;
    case 'attendance':
      return <CalendarCheck className="h-5 w-5 text-destructive" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};


export default function ParentNotificationsPage() {
    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>
                            You have {notifications.filter(n => !n.read).length} unread messages.
                        </CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Check className="mr-2 h-4 w-4"/>
                            Mark all as read
                        </Button>
                         <Select defaultValue="all">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter notifications" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Notifications</SelectItem>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="task">Tasks & Deadlines</SelectItem>
                                <SelectItem value="announcement">Announcements</SelectItem>
                                <SelectItem value="attendance">Attendance</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {notifications.map((notification, index) => (
                           <li key={notification.id}>
                                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="rounded-full bg-primary/10 p-2">
                                        <NotificationIcon type={notification.type} />
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>{notification.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                        {notification.description}
                                        </p>
                                         <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                                    </div>
                                    {!notification.read && <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>}
                                </div>
                                {index < notifications.length - 1 && <Separator />}
                           </li>
                        ))}
                    </ul>
                </CardContent>
                 <CardFooter className="flex justify-center">
                    <Button variant="ghost">Load more</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
