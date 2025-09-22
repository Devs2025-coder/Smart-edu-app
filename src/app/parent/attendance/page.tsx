
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const attendanceData: { [key: string]: { status: 'present' | 'absent' | 'late', details?: any[] } } = {
  '2024-10-01': { status: 'present' },
  '2024-10-02': { status: 'present' },
  '2024-10-03': { 
    status: 'absent',
    details: [
        { subject: 'Math', time: '09:00 AM', status: 'absent', note: 'Family event' },
        { subject: 'Science', time: '10:00 AM', status: 'absent', note: 'Family event' },
        { subject: 'English', time: '11:00 AM', status: 'absent', note: 'Family event' },
    ]
  },
  '2024-10-04': { status: 'present' },
  '2024-10-07': { 
    status: 'late',
    details: [
        { subject: 'Math', time: '09:00 AM', status: 'late', note: 'Arrived at 9:15 AM' },
        { subject: 'Science', time: '10:00 AM', status: 'present', note: null },
        { subject: 'English', time: '11:00 AM', status: 'present', note: null },
    ]
  },
  '2024-10-08': { status: 'present' },
  '2024-10-09': { status: 'present' },
  '2024-10-10': { status: 'present' },
  '2024-10-11': { status: 'present' },
  '2024-10-14': { status: 'present' },
  '2024-10-15': { status: 'present' },
  '2024-10-16': { status: 'present' },
};

const totalClassesInMonth = 60;
const attendedClasses = 55;
const overallPercentage = Math.round((attendedClasses / totalClassesInMonth) * 100);

export default function ParentAttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date('2024-10-07'));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const selectedDayData = selectedDate ? attendanceData[format(selectedDate, 'yyyy-MM-dd')] : null;

  const getStatusBadge = (status: 'present' | 'absent' | 'late') => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Present</Badge>;
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>;
      case 'late':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-500">Late</Badge>;
      default:
        return <Badge variant="secondary">N/A</Badge>;
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
          <CardDescription>
            View your child's attendance record. Click on a date to see details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-2 flex justify-center">
                   <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    className="rounded-md"
                    defaultMonth={new Date('2024-10-01')}
                    modifiers={{
                      present: (date) => attendanceData[format(date, 'yyyy-MM-dd')]?.status === 'present',
                      absent: (date) => attendanceData[format(date, 'yyyy-MM-dd')]?.status === 'absent',
                      late: (date) => attendanceData[format(date, 'yyyy-MM-dd')]?.status === 'late',
                    }}
                    modifiersClassNames={{
                      present: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
                      absent: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
                      late: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
                    }}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{overallPercentage}%</div>
                  <Progress value={overallPercentage} className="mt-2 h-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Classes Missed</CardTitle>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{totalClassesInMonth - attendedClasses}</div>
                  <p className="text-xs text-muted-foreground">this semester</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedDayData && selectedDayData.details ? (
        <Card>
            <CardHeader>
                <CardTitle>Attendance for {selectedDate ? format(selectedDate, 'PPP') : ''}</CardTitle>
                 <CardDescription>
                    Subject-wise breakdown for the selected day.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Notes from Teacher</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {selectedDayData.details.map((detail: any, index: number) => (
                           <TableRow key={index}>
                               <TableCell className="font-medium">{detail.subject}</TableCell>
                               <TableCell>{detail.time}</TableCell>
                               <TableCell>{getStatusBadge(detail.status)}</TableCell>
                               <TableCell className="text-muted-foreground">{detail.note || '—'}</TableCell>
                           </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      ) : (
         <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12" />
                <p className="mt-4">
                    {selectedDate ? `No specific details for ${format(selectedDate, 'PPP')}. The student was marked ${selectedDayData?.status || 'present'}.` : 'Select a date to view attendance details.'}
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

