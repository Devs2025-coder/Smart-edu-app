
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

const allTasks = [
  {
    id: 1,
    title: 'Science - Chapter 5 Quiz',
    subject: 'Science',
    professor: 'Mr. Jones',
    dueDate: '2024-10-25',
    status: 'Pending',
    description: 'Complete the quiz on Chapter 5: "Ecosystems". The quiz consists of 20 multiple-choice questions.',
  },
  {
    id: 2,
    title: 'Math Homework: Algebra II',
    subject: 'Mathematics',
    professor: 'Ms. Davis',
    dueDate: '2024-10-22',
    status: 'Pending',
    description: 'Solve the problems from section 3.4 in the textbook. Show all your work.',
  },
    {
    id: 3,
    title: 'History Essay: The Roman Empire',
    subject: 'History',
    professor: 'Mr. Smith',
    dueDate: '2024-10-18',
    status: 'Overdue',
    description: 'Write a 500-word essay on the rise and fall of the Roman Empire.',
  },
  {
    id: 4,
    title: 'English Reading: "To Kill a Mockingbird"',
    subject: 'English',
    professor: 'Mrs. Williams',
    dueDate: '2024-10-15',
    status: 'Completed',
    description: 'Read chapters 1-5 and write a short summary.',
  },
   {
    id: 5,
    title: 'Art Project: Landscape Painting',
    subject: 'Art',
    professor: 'Ms. Taylor',
    dueDate: '2024-10-11',
    status: 'Completed',
    description: 'Create a landscape painting using watercolors. Submit a photo of your work.',
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

const TaskCard = ({ task }: { task: (typeof allTasks)[0] }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <Badge variant="outline" className="mb-2">{task.subject}</Badge>
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <CardDescription>
            Due: {task.dueDate} | Prof. {task.professor}
          </CardDescription>
        </div>
        <Badge variant={getStatusBadgeVariant(task.status)}>
          {task.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">View Details</Button>
    </CardFooter>
  </Card>
);

export default function ParentTasksPage() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredTasks = allTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return task.status === 'Pending' || task.status === 'Overdue';
    if (activeTab === 'completed') return task.status === 'Completed';
    return false;
  });

  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Your Child's Tasks</CardTitle>
                <CardDescription>View all assigned tasks and their current status.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="all">All Tasks</TabsTrigger>
                        <TabsTrigger value="pending">Pending & Overdue</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
                        ) : (
                            <p className="md:col-span-3 text-center text-muted-foreground py-10">
                                No tasks in this category.
                            </p>
                        )}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    </div>
  );
}
