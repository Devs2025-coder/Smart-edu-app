

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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, CalendarDays, Users, TrendingDown, TrendingUp, CheckCircle2, ListTodo } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Papa from 'papaparse';

const allAttendanceData = {
    'cs101-3-a-month': [
      { student: { id: 'S001', name: 'Alice Johnson' }, total: 40, attended: 38 },
      { student: { id: 'S002', name: 'Bob Williams' }, total: 40, attended: 35 },
      { student: { id: 'S003', name: 'Charlie Brown' }, total: 40, attended: 25 },
      { student: { id: 'S004', name: 'Diana Miller' }, total: 40, attended: 39 },
      { student: { id: 'S005', name: 'Ethan Davis' }, total: 40, attended: 30 },
      { student: { id: 'S006', name: 'Fiona White' }, total: 40, attended: 36 },
    ],
    'ph203-1-a-month': [
      { student: { id: 'S101', name: 'Gary Oldman' }, total: 35, attended: 30 },
      { student: { id: 'S102', name: 'Helen Mirren' }, total: 35, attended: 32 },
    ]
};

const allTaskData = {
    'cs101-3-a-month': [
      { student: { id: 'S001', name: 'Alice Johnson' }, assigned: 5, completed: 5 },
      { student: { id: 'S002', name: 'Bob Williams' }, assigned: 5, completed: 4 },
      { student: { id: 'S003', name: 'Charlie Brown' }, assigned: 5, completed: 2 },
      { student: { id: 'S004', name: 'Diana Miller' }, assigned: 5, completed: 5 },
      { student: { id: 'S005', name: 'Ethan Davis' }, assigned: 5, completed: 3 },
      { student: { id: 'S006', name: 'Fiona White' }, assigned: 5, completed: 4 },
    ],
    'ph203-1-a-month': [
       { student: { id: 'S101', name: 'Gary Oldman' }, assigned: 4, completed: 3 },
       { student: { id: 'S102', name: 'Helen Mirren' }, assigned: 4, completed: 4 },
    ]
};


const attendanceChartConfig = {
  attended: { label: 'Attended', color: 'hsl(var(--primary))' },
  missed: { label: 'Missed', color: 'hsl(var(--destructive))' },
} satisfies ChartConfig;

const taskChartConfig = {
    completed: { label: 'Completed', color: 'hsl(var(--primary))' },
    pending: { label: 'Pending', color: 'hsl(var(--muted))' },
} satisfies ChartConfig;


export default function ReportsPage() {
    const [filters, setFilters] = useState({
        class: 'cs101',
        semester: '3',
        section: 'a',
        range: 'month'
    });
    
    const filterKey = `${filters.class}-${filters.semester}-${filters.section}-${filters.range}`;
    
    const attendanceData = allAttendanceData[filterKey] || allAttendanceData['cs101-3-a-month'];
    const taskData = allTaskData[filterKey] || allTaskData['cs101-3-a-month'];


    const handleFilterChange = (filterName: string, value: string) => {
        setFilters(prev => ({...prev, [filterName]: value}));
    }

    const processedAttendance = useMemo(() => {
        return attendanceData.map(d => ({
            ...d,
            missed: d.total - d.attended,
            percentage: (d.attended / d.total) * 100
        }));
    }, [attendanceData]);
    
    const processedTasks = useMemo(() => {
        return taskData.map(d => ({
            ...d,
            pending: d.assigned - d.completed,
            percentage: (d.completed / d.assigned) * 100
        }));
    }, [taskData]);

    const avgAttendance = useMemo(() => {
        if (processedAttendance.length === 0) return 0;
        const total = processedAttendance.reduce((acc, curr) => acc + curr.percentage, 0);
        return Math.round(total / processedAttendance.length);
    }, [processedAttendance]);
    
    const studentsAtRisk = useMemo(() => {
        return processedAttendance.filter(s => s.percentage < 75).length;
    }, [processedAttendance]);
    
    const overallCompletionRate = useMemo(() => {
        if (taskData.length === 0) return 0;
        const totalAssigned = taskData.reduce((acc, curr) => acc + curr.assigned, 0);
        const totalCompleted = taskData.reduce((acc, curr) => acc + curr.completed, 0);
        if (totalAssigned === 0) return 0;
        return Math.round((totalCompleted / totalAssigned) * 100);
    }, [taskData]);

    const getStatusBadge = (percentage: number) => {
        if (percentage >= 90) return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Excellent</Badge>;
        if (percentage >= 75) return <Badge variant="secondary">Good</Badge>;
        if (percentage >= 50) return <Badge variant="outline" className="text-yellow-600 border-yellow-500">Warning</Badge>;
        return <Badge variant="destructive">At Risk</Badge>;
    };

    const handleExport = (reportType: 'attendance' | 'tasks') => {
        let dataToExport;
        let filename;

        if (reportType === 'attendance') {
            dataToExport = processedAttendance.map(item => ({
                'Student Name': item.student.name,
                'Student ID': item.student.id,
                'Attended': item.attended,
                'Missed': item.missed,
                'Total Classes': item.total,
                'Attendance %': item.percentage.toFixed(0),
            }));
            filename = 'attendance-report.csv';
        } else {
            dataToExport = processedTasks.map(item => ({
                'Student Name': item.student.name,
                'Student ID': item.student.id,
                'Assigned': item.assigned,
                'Completed': item.completed,
                'Pending': item.pending,
                'Completion %': item.percentage.toFixed(0),
            }));
            filename = 'task-performance-report.csv';
        }
        
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <div>
                        <CardTitle>Reports &amp; Analytics</CardTitle>
                        <CardDescription>
                            Analyze class performance for Computer Science 101.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col md:flex-row gap-4 mb-6">
                         <Select value={filters.class} onValueChange={(value) => handleFilterChange('class', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cs101">CS 101</SelectItem>
                                <SelectItem value="ph203">Physics 203</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Semester 1</SelectItem>
                                <SelectItem value="2">Semester 2</SelectItem>
                                <SelectItem value="3">Semester 3</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={filters.section} onValueChange={(value) => handleFilterChange('section', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="a">Section A</SelectItem>
                                <SelectItem value="b">Section B</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={filters.range} onValueChange={(value) => handleFilterChange('range', value)}>
                            <SelectTrigger className="w-full md:w-[180px]">
                                <SelectValue placeholder="Select Date Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="semester">This Semester</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex-1" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full md:w-auto">
                                    <Download className="mr-2 h-4 w-4" /> Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleExport('attendance')}>
                                    Export Attendance as CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExport('tasks')}>
                                    Export Tasks as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                     <Tabs defaultValue="attendance">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="attendance">Attendance Report</TabsTrigger>
                            <TabsTrigger value="tasks">Task Performance</TabsTrigger>
                        </TabsList>
                        
                        {/* Attendance Tab */}
                        <TabsContent value="attendance" className="mt-6 space-y-6">
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{avgAttendance}%</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{attendanceData.length}</div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Students At Risk (&lt;75%)</CardTitle>
                                        <TrendingDown className="h-4 w-4 text-destructive" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-destructive">{studentsAtRisk}</div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{attendanceData[0]?.total || 0}</div>
                                    </CardContent>
                                </Card>
                           </div>
                           <Card>
                               <CardHeader>
                                    <CardTitle>Student-wise Attendance</CardTitle>
                                </CardHeader>
                               <CardContent>
                                    <ChartContainer config={attendanceChartConfig} className="h-64">
                                        <BarChart accessibilityLayer data={processedAttendance} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="student.name" tickLine={false} tickMargin={10} axisLine={false} />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="attended" stackId="a" fill="var(--color-attended)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="missed" stackId="a" fill="var(--color-missed)" radius={[0, 0, 0, 0]} />
                                        </BarChart>
                                    </ChartContainer>
                               </CardContent>
                           </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detailed Attendance Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead className="text-center">Attended</TableHead>
                                            <TableHead className="text-center">Missed</TableHead>
                                            <TableHead className="text-center">Attendance %</TableHead>
                                            <TableHead className="text-center">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {processedAttendance.map((item) => (
                                        <TableRow key={item.student.id}>
                                            <TableCell className="font-medium">{item.student.name}</TableCell>
                                            <TableCell>{item.student.id}</TableCell>
                                            <TableCell className="text-center">{item.attended}</TableCell>
                                            <TableCell className="text-center">{item.missed}</TableCell>
                                            <TableCell className="text-center font-bold">{item.percentage.toFixed(0)}%</TableCell>
                                            <TableCell className="text-center">{getStatusBadge(item.percentage)}</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Task Performance Tab */}
                        <TabsContent value="tasks" className="mt-6 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Overall Completion Rate</CardTitle>
                                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{overallCompletionRate}%</div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Tasks Assigned</CardTitle>
                                        <ListTodo className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{taskData[0]?.assigned || 0}</div>
                                    </CardContent>
                                </Card>
                            </div>
                             <Card>
                               <CardHeader>
                                    <CardTitle>Student-wise Task Completion</CardTitle>
                                </CardHeader>
                               <CardContent>
                                    <ChartContainer config={taskChartConfig} className="h-64">
                                        <BarChart accessibilityLayer data={processedTasks} margin={{ top: 20, right: 20, bottom: 5, left: -10 }}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis dataKey="student.name" tickLine={false} tickMargin={10} axisLine={false} />
                                            <YAxis />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="completed" stackId="a" fill="var(--color-completed)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="pending" stackId="a" fill="var(--color-pending)" radius={[0, 0, 0, 0]} />
                                        </BarChart>
                                    </ChartContainer>
                               </CardContent>
                           </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Detailed Task Submission Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                     <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Student ID</TableHead>
                                            <TableHead className="text-center">Assigned</TableHead>
                                            <TableHead className="text-center">Completed</TableHead>
                                            <TableHead className="text-center">Completion %</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {processedTasks.map((item) => (
                                        <TableRow key={item.student.id}>
                                            <TableCell className="font-medium">{item.student.name}</TableCell>
                                            <TableCell>{item.student.id}</TableCell>
                                            <TableCell className="text-center">{item.assigned}</TableCell>
                                            <TableCell className="text-center">{item.completed}</TableCell>
                                            <TableCell className="text-center font-bold">{item.percentage.toFixed(0)}%</TableCell>
                                        </TableRow>
                                        ))}
                                    </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                     </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
