
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, Legend } from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { School, Users, BarChart2, Activity, TrendingUp, PieChart as PieIcon, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const userGrowthData = [
  { month: 'Jan', students: 400, professors: 50 },
  { month: 'Feb', students: 600, professors: 60 },
  { month: 'Mar', students: 850, professors: 75 },
  { month: 'Apr', students: 1100, professors: 90 },
  { month: 'May', students: 1300, professors: 110 },
  { month: 'Jun', students: 1588, professors: 125 },
];

const institutionStatusData = [
  { name: 'Active', value: 12, fill: 'hsl(var(--primary))' },
  { name: 'Pending', value: 3, fill: 'hsl(var(--secondary))' },
  { name: 'Suspended', value: 1, fill: 'hsl(var(--destructive))' },
];

const stateData = [
  { state: 'Maharashtra', institutions: 5, users: 800 },
  { state: 'Karnataka', institutions: 3, users: 450 },
  { state: 'Delhi', institutions: 2, users: 300 },
  { state: 'Tamil Nadu', institutions: 2, users: 300 },
];

const chartConfig = {
  students: { label: 'Students', color: 'hsl(var(--primary))' },
  professors: { label: 'Professors', color: 'hsl(var(--accent))' },
} satisfies ChartConfig;


export default function AnalyticsPage() {

  return (
    <div className="grid gap-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Institutions</CardTitle>
                    <School className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">Currently active on the platform</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,850</div>
                    <p className="text-xs text-muted-foreground">Students, Professors, and Admins</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+12%</div>
                    <p className="text-xs text-muted-foreground">User growth this month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">985</div>
                    <p className="text-xs text-muted-foreground">Average in the last 7 days</p>
                </CardContent>
            </Card>
       </div>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>User Growth Over Time</CardTitle>
                    <CardDescription>Total number of students and professors on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-72 w-full">
                        <LineChart accessibilityLayer data={userGrowthData}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line dataKey="students" type="monotone" stroke="var(--color-students)" strokeWidth={2} dot={false} />
                            <Line dataKey="professors" type="monotone" stroke="var(--color-professors)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
           </Card>
           <Card>
                <CardHeader>
                    <CardTitle>Institution Status</CardTitle>
                    <CardDescription>Distribution of all registered institutions.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                     <ChartContainer config={{}} className="h-72 w-full">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                            <Pie data={institutionStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                {institutionStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
           </Card>
       </div>
       <Card>
           <CardHeader>
                <CardTitle className="flex items-center"><Map className="mr-2"/>Distribution by State (India)</CardTitle>
                <CardDescription>Breakdown of institutions and users by state/union territory.</CardDescription>
           </CardHeader>
           <CardContent>
               <Table>
                   <TableHeader>
                       <TableRow>
                           <TableHead>State/Union Territory</TableHead>
                           <TableHead>No. of Institutions</TableHead>
                           <TableHead>Total Users</TableHead>
                       </TableRow>
                   </TableHeader>
                   <TableBody>
                       {stateData.map(data => (
                           <TableRow key={data.state}>
                               <TableCell className="font-medium">{data.state}</TableCell>
                               <TableCell>{data.institutions}</TableCell>
                               <TableCell>{data.users}</TableCell>
                           </TableRow>
                       ))}
                   </TableBody>
               </Table>
           </CardContent>
       </Card>
    </div>
  );
}
