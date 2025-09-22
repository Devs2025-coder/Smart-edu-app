
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
import { Calendar as CalendarIcon, Download, UserCheck, UserX, Clock, Loader2, Save } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import Papa from 'papaparse';
import { useToast } from '@/hooks/use-toast';

const initialAttendanceData = {
    'grade6a': {
        '2024-10-21': [
            { id: 'S201', name: 'Aarav Sharma', status: 'Present', markedBy: 'Ms. Priya Sharma' },
            { id: 'S202', name: 'Saanvi Gupta', status: 'Present', markedBy: 'Ms. Priya Sharma' },
            { id: 'S203', name: 'Vihaan Singh', status: 'Absent', markedBy: 'Ms. Priya Sharma' },
            { id: 'S204', name: 'Myra Reddy', status: 'Late', markedBy: 'Ms. Priya Sharma' },
        ]
    },
    'grade7b': {
        '2024-10-21': [
            { id: 'S301', name: 'Test Student', status: 'Present', markedBy: 'Mr. Rohan Verma' },
        ]
    }
};

export default function AttendanceMonitoringPage() {
    const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
    const [selectedClass, setSelectedClass] = useState('grade6a');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-10-21'));
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    
    const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    const currentData = attendanceData[selectedClass]?.[formattedDate] || [];

    const presentCount = currentData.filter(s => s.status === 'Present').length;
    const absentCount = currentData.filter(s => s.status === 'Absent').length;
    const lateCount = currentData.filter(s => s.status === 'Late').length;
    const totalStudents = currentData.length;
    const overallPercentage = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 0;

    const handleStatusChange = (studentId: string, newStatus: string) => {
        const updatedData = { ...attendanceData };
        const classData = updatedData[selectedClass]?.[formattedDate];
        if (classData) {
            const studentIndex = classData.findIndex(s => s.id === studentId);
            if (studentIndex !== -1) {
                classData[studentIndex].status = newStatus;
                classData[studentIndex].markedBy = 'Admin Override';
                setAttendanceData(updatedData);
            }
        }
    };
    
    const handleSaveChanges = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Saving changes:', currentData);
        setIsSaving(false);
        toast({
            title: 'Changes Saved!',
            description: `Attendance overrides for ${selectedClass} on ${formattedDate} have been saved.`,
        });
    };

    const handleExport = () => {
        if (!currentData || currentData.length === 0) {
            toast({
                variant: 'destructive',
                title: 'No Data to Export',
                description: 'There is no attendance data for the selected filters.',
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
        link.setAttribute('download', `attendance-report-${selectedClass}-${formattedDate}.csv`);
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
                            Review attendance records and make manual corrections if needed.
                        </CardDescription>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger className="w-full md:w-[240px]">
                                <SelectValue placeholder="Select Class"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="grade6a">Grade 6 - Section A</SelectItem>
                                <SelectItem value="grade7b">Grade 7 - Section B</SelectItem>
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
                            <CardTitle>Manual Attendance Correction</CardTitle>
                            <CardDescription>
                                Showing records for the selected class and date. Changes will be marked as 'Admin Override'.
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
                                            <TableCell>
                                                <Select value={student.status} onValueChange={(value) => handleStatusChange(student.id, value)}>
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Present">Present</SelectItem>
                                                        <SelectItem value="Absent">Absent</SelectItem>
                                                        <SelectItem value="Late">Late</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">{student.markedBy}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No attendance data found for the selected filters.
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
