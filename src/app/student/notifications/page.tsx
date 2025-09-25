
'use client';

import { useState, useMemo } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const initialNotifications = [
  {
    id: 1,
    type: 'task',
    title: "New Task Assigned: 'Quantum Mechanics Worksheet'",
    description: 'Dr. Alan Grant has assigned a new worksheet. Due in 2 days.',
    date: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'announcement',
    title: 'Campus event this Friday: Tech Fest 2024',
    description: 'The annual technology festival will be held this Friday. All students are encouraged to attend.',
    date: '1 day ago',
    read: false,
  },
  {
    id: 3,
    type: 'attendance',
    title: 'Attendance marked for Physics 101',
    description: 'You have been marked present for the class on Oct 10, 2024.',
    date: '2 days ago',
    read: true,
  },
  {
    id: 4,
    type: 'deadline',
    title: 'Deadline Reminder: Calculus Problem Set',
    description: 'The submission deadline for your calculus assignment is tomorrow.',
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
      return <CalendarCheck className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};


export default function StudentNotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState('all');
    const { toast } = useToast();

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        toast({
            title: 'All notifications marked as read',
        });
    };

    const filteredNotifications = useMemo(() => {
        if (filter === 'all') {
            return notifications;
        }
        if (filter === 'unread') {
            return notifications.filter(n => !n.read);
        }
        if (filter === 'task') {
            return notifications.filter(n => n.type === 'task' || n.type === 'deadline');
        }
        return notifications.filter(n => n.type === filter);
    }, [notifications, filter]);

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
                        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                            <Check className="mr-2 h-4 w-4"/>
                            Mark all as read
                        </Button>
                         <Select value={filter} onValueChange={setFilter}>
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
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification, index) => (
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
                                    {index < filteredNotifications.length - 1 && <Separator />}
                               </li>
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>No notifications match the current filter.</p>
                            </div>
                        )}
                    </ul>
                </CardContent>
                 {notifications.length > 5 && (
                    <CardFooter className="flex justify-center">
                        <Button variant="ghost">Load more</Button>
                    </CardFooter>
                 )}
            </Card>
        </div>
    );
}
