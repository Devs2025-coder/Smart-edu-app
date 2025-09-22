
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Download, UserCheck, UserX, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

const attendanceData = {
    'cs-3-a': {
        '2024-10-21': [
            { id: 'S201', name: 'John Doe', status: 'Present', markedBy: 'Dr. Evelyn Reed' },
            { id: 'S203', name: 'Peter Jones', status: 'Absent', markedBy: 'Dr. Evelyn Reed' },
            { id: 'S204', name: 'Mary Johnson', status: 'Present', markedBy: 'Dr. Evelyn Reed' },
        ]
    },
    'math-5-a': {
        '2024-10-21': [
            { id: 'S401', name: 'Test Student', status: 'Late', markedBy: 'Dr. Clara Oswald' },
        ]
    }
};


export default function AttendanceMonitoringPage() {
    const [selectedClass, setSelectedClass] = useState('cs-3-a');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-10-21'));
    const { toast } = useToast();
    
    const currentData = selectedDate ? attendanceData[selectedClass]?.[format(selectedDate, 'yyyy-MM-dd')] || [] : [];
    
    const presentCount = currentData.filter(s => s.status === 'Present').length;
    const absentCount = currentData.filter(s => s.status === 'Absent').length;
    const lateCount = currentData.filter(s => s.status === 'Late').length;
    const totalStudents = currentData.length;
    const overallPercentage = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 0;
    
     const getStatusBadge = (status: string) => {
        switch (status) {
          case 'Present':
            return <Badge variant="default" className="bg-green-500 hover:bg-green-600">{status}</Badge>;
          case 'Absent':
            return <Badge variant="destructive">{status}</Badge>;
          case 'Late':
            return <Badge variant="outline" className="text-yellow-600 border-yellow-500">{status}</Badge>;
          default:
            return <Badge variant="secondary">{status}</Badge>;
        }
    };
    
    const handleExport = () => {
        if (!currentData || currentData.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data to Export',
                description: 'There is no attendance data for the selected class and date.',
            });
            return;
        }

        const dataToExport = currentData.map(item => ({
            'Student Name': item.name,
            'Roll No': item.id,
            'Status': item.status,
            'Marked By': item.markedBy,
        }));
        
        const csv = Papa.unparse(dataToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance-report-${selectedClass}-${format(selectedDate!, 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
         toast({
            title: 'Export Successful',
            description: 'The attendance report has been downloaded.',
        });
    };

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <CardTitle>Attendance Monitoring</CardTitle>
                        <CardDescription>
                            Review attendance records submitted by professors.
                        </CardDescription>
                    </div>
                    <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full md:w-[240px]">
                                <SelectValue placeholder="Select Class"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cs-3-a">Computer Science - Sem 3, Sec A</SelectItem>
                                <SelectItem value="phy-1-a">Physics - Sem 1, Sec A</SelectItem>
                                <SelectItem value="math-5-a">Mathematics - Sem 5, Sec A</SelectItem>
                            </SelectContent>
                        </Select>
                         <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-full md:w-[240px] justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{overallPercentage}%</div>
                                <Progress value={overallPercentage} className="mt-2 h-2" />
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Present</CardTitle>
                                <UserCheck className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{presentCount}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
                                <UserX className="h-4 w-4 text-destructive" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-destructive">{absentCount}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Late</CardTitle>
                                <Clock className="h-4 w-4 text-yellow-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-yellow-600">{lateCount}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Details</CardTitle>
                            <CardDescription>
                                Showing records for the selected class and date.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Roll No</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Marked By</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentData.length > 0 ? currentData.map(student => (
                                        <TableRow key={student.id}>
                                            <TableCell className="font-medium">{student.name}</TableCell>
                                            <TableCell>{student.id}</TableCell>
                                            <TableCell>{getStatusBadge(student.status)}</TableCell>
                                            <TableCell className="text-muted-foreground">{student.markedBy}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No attendance data found for the selected class and date.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </div>
    );
}

