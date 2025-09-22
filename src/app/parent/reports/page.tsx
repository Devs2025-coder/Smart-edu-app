
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, TrendingUp, XCircle, Bot, Lightbulb } from 'lucide-react';

const attendanceData = [
  { subject: 'Science', attended: 28, total: 30 },
  { subject: 'Math', attended: 22, total: 30 },
  { subject: 'English', attended: 30, total: 30 },
  { subject: 'History', attended: 27, total: 30 },
];

const taskData = [
  { week: 'Week 1', completed: 3 },
  { week: 'Week 2', completed: 5 },
  { week: 'Week 3', completed: 4 },
  { week: 'Week 4', completed: 6 },
];

const chartConfig = {
  attendance: {
    label: 'Attendance',
    color: 'hsl(var(--primary))',
  },
  tasks: {
    label: 'Tasks Completed',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;


export default function ParentReportsPage() {
  const totalAttended = attendanceData.reduce((acc, a) => acc + a.attended, 0);
  const totalClasses = attendanceData.reduce((acc, a) => acc + a.total, 0);
  const overallAttendance = Math.round((totalAttended / totalClasses) * 100);

  const totalTasksCompleted = taskData.reduce((acc, t) => acc + t.completed, 0);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Child's Progress Reports</CardTitle>
          <CardDescription>
            Analyze attendance and task performance at a glance.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="attendance">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="attendance"><BookOpen className="mr-2"/>Attendance Analytics</TabsTrigger>
                    <TabsTrigger value="task-completion"><CheckCircle className="mr-2"/>Task Completion</TabsTrigger>
                </TabsList>
                
                {/* Attendance Tab */}
                <TabsContent value="attendance" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                             <CardHeader>
                                <CardTitle>Attendance by Subject</CardTitle>
                                <CardDescription>Your child's attendance percentage for each subject this term.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-64">
                                     <BarChart 
                                        data={attendanceData.map(item => ({...item, percentage: (item.attended / item.total) * 100}))}
                                        margin={{ top: 20, right: 20, bottom: 5, left: -10 }}
                                    >
                                        <CartesianGrid vertical={false} />
                                        <XAxis dataKey="subject" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis unit="%" />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="percentage" name="Attendance" fill="var(--color-attendance)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                        <div className="space-y-6">
                             <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">Overall Attendance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-bold">{overallAttendance}%</div>
                                    <Progress value={overallAttendance} className="mt-2 h-2" />
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Classes Missed</CardTitle>
                                    <XCircle className="h-4 w-4 text-destructive" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalClasses - totalAttended}</div>
                                    <p className="text-xs text-muted-foreground">this term</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
                
                {/* Task Completion Tab */}
                <TabsContent value="task-completion" className="mt-6">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="md:col-span-2">
                             <CardHeader>
                                <CardTitle>Weekly Task Completion</CardTitle>
                                <CardDescription>Number of tasks your child has completed over the last 4 weeks.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <ChartContainer config={chartConfig} className="h-64">
                                    <LineChart data={taskData} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="week" tickLine={false} tickMargin={10} axisLine={false} />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Line type="monotone" dataKey="completed" name="Tasks Completed" stroke="var(--color-tasks)" strokeWidth={2} />
                                    </LineChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                         <div className="space-y-6">
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Tasks Completed</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{totalTasksCompleted}</div>
                                    <p className="text-xs text-muted-foreground">in the last month</p>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
                                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
                                    <p className="text-xs text-muted-foreground">across all subjects</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
       <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center"><Bot className="mr-2 text-primary"/> AI Insights for Your Child</CardTitle>
                <CardDescription>
                    Personalized suggestions to help them improve.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-start gap-4 p-4 rounded-lg bg-background">
                    <Lightbulb className="w-5 h-5 mt-1 text-yellow-500" />
                    <div>
                        <h4 className="font-semibold">Opportunity in Math</h4>
                        <p className="text-sm text-muted-foreground">
                            Your child's attendance in Math is a bit lower than other subjects. This might be a great opportunity to check in with them and see if they need extra support.
                        </p>
                    </div>
                </div>
                 <div className="flex items-start gap-4 p-4 rounded-lg bg-background">
                     <Lightbulb className="w-5 h-5 mt-1 text-yellow-500" />
                     <div>
                        <h4 className="font-semibold">Keep Up the Great Work in English!</h4>
                        <p className="text-sm text-muted-foreground">
                            With perfect attendance in English, your child is showing great commitment. Praising their effort can help reinforce this positive habit.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
