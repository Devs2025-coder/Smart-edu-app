
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
import { Bell, Check, ClipboardCheck, MessageSquare, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const notifications = [
  {
    id: 1,
    type: 'admin',
    title: "Admin Message: School will be closed for a staff meeting on Friday.",
    description: 'Please ensure all assignments are posted before Thursday.',
    date: '30 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'parent',
    title: "Parent Query from Mr. Patel (Advik's Parent)",
    description: "He's asking about Advik's recent performance in Math. C...",
    date: '2 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'task',
    title: '5 students submitted the "History Chapter 4" assignment',
    description: 'You have 15 submissions pending review for this task.',
    date: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'announcement',
    title: 'Reminder: Parent-Teacher meetings next week',
    description: 'Please update your availability slots in the portal.',
    date: '3 days ago',
    read: true,
  },
   {
    id: 5,
    type: 'parent',
    title: "Parent Query from Mrs. Reddy (Myra's Parent)",
    description: 'She sent a message regarding the upcoming field trip.',
    date: '4 days ago',
    read: true,
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'task':
      return <ClipboardCheck className="h-5 w-5 text-primary" />;
    case 'admin':
    case 'announcement':
      return <Shield className="h-5 w-5 text-accent-foreground" />;
    case 'parent':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};


export default function TeacherNotificationsPage() {
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
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="parent">Parent Queries</SelectItem>
                                <SelectItem value="task">Tasks</SelectItem>
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
