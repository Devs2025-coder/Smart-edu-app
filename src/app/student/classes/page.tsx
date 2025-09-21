
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const scheduleData = {
  cse: {
    '3': {
      a: [
        { time: '09:00 - 10:00', M: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Sattler' }, T: { subject: 'Physics II', room: 'B-203', prof: 'Dr. Grant' }, W: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Sattler' }, Th: { subject: 'Physics II', room: 'B-203', prof: 'Dr. Grant' }, F: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Sattler' } },
        { time: '10:00 - 11:00', M: { subject: 'Calculus II', room: 'C-105', prof: 'Dr. Malcolm' }, T: { subject: 'Discrete Maths', room: 'C-102', prof: 'Dr. Wu' }, W: { subject: 'Calculus II', room: 'C-105', prof: 'Dr. Malcolm' }, Th: { subject: 'Discrete Maths', room: 'C-102', prof: 'Dr. Wu' }, F: { subject: 'Calculus II', room: 'C-105', prof: 'Dr. Malcolm' } },
        { time: '11:00 - 12:00', M: { subject: 'Physics II', room: 'B-203', prof: 'Dr. Grant' }, T: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Sattler' }, W: { subject: 'Discrete Maths', room: 'C-102', prof: 'Dr. Wu' }, Th: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Sattler' }, F: { subject: 'Physics II Lab', room: 'B-Lab', prof: 'Dr. Grant' } },
        { time: '12:00 - 01:00', M: null, T: null, W: null, Th: null, F: null },
        { time: '01:00 - 02:00', M: { subject: 'DS Lab', room: 'A-Lab', prof: 'Dr. Sattler' }, T: null, W: { subject: 'DS Lab', room: 'A-Lab', prof: 'Dr. Sattler' }, Th: null, F: null },
      ],
      b: [ // Schedule for Section B
        { time: '09:00 - 10:00', M: { subject: 'Discrete Maths', room: 'C-103', prof: 'Dr. Wu' }, T: { subject: 'Calculus II', room: 'C-106', prof: 'Dr. Malcolm' }, W: { subject: 'Discrete Maths', room: 'C-103', prof: 'Dr. Wu' }, Th: { subject: 'Calculus II', room: 'C-106', prof: 'Dr. Malcolm' }, F: { subject: 'Discrete Maths', room: 'C-103', prof: 'Dr. Wu' } },
        { time: '10:00 - 11:00', M: { subject: 'Physics II', room: 'B-204', prof: 'Dr. Grant' }, T: { subject: 'Data Structures', room: 'A-102', prof: 'Dr. Sattler' }, W: { subject: 'Physics II', room: 'B-204', prof: 'Dr. Grant' }, Th: { subject: 'Data Structures', room: 'A-102', prof: 'Dr. Sattler' }, F: { subject: 'Physics II', room: 'B-204', prof: 'Dr. Grant' } },
        { time: '11:00 - 12:00', M: { subject: 'Data Structures', room: 'A-102', prof: 'Dr. Sattler' }, T: { subject: 'Discrete Maths', room: 'C-103', prof: 'Dr. Wu' }, W: { subject: 'Calculus II', room: 'C-106', prof: 'Dr. Malcolm' }, Th: { subject: 'DS Lab', room: 'A-Lab', prof: 'Dr. Sattler' }, F: null },
        { time: '12:00 - 01:00', M: null, T: null, W: null, Th: null, F: null },
        { time: '01:00 - 02:00', M: null, T: { subject: 'Physics II Lab', room: 'B-Lab', prof: 'Dr. Grant' }, W: null, Th: null, F: { subject: 'DS Lab', room: 'A-Lab', prof: 'Dr. Sattler' } },
      ]
    }
  }
};

const days = ['M', 'T', 'W', 'Th', 'F'];
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function StudentClassesPage() {
  const [filters, setFilters] = useState({
    department: 'cse',
    semester: '3',
    section: 'a',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const currentSchedule = scheduleData[filters.department]?.[filters.semester]?.[filters.section] || [];
  
  const ClassCell = ({ period }) => {
    if (!period) return <TableCell className="h-20"></TableCell>;
    return (
      <TableCell className="p-2 h-20">
        <div className="bg-muted/50 p-2 rounded-lg h-full flex flex-col justify-center">
            <p className="font-semibold text-sm">{period.subject}</p>
            <p className="text-xs text-muted-foreground">{period.prof}</p>
            <Badge variant="secondary" className="mt-1 w-fit">{period.room}</Badge>
        </div>
      </TableCell>
    );
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Weekly Schedule</CardTitle>
          <CardDescription>
            View your class timetable for the week. Your current selection is CSE, Semester 3, Section A.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Select onValueChange={(value) => handleFilterChange('department', value)} defaultValue={filters.department}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">Computer Science & Eng.</SelectItem>
                    <SelectItem value="ece" disabled>Electronics & Comm. Eng.</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => handleFilterChange('semester', value)} defaultValue={filters.semester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4" disabled>Semester 4</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => handleFilterChange('section', value)} defaultValue={filters.section}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Section A</SelectItem>
                    <SelectItem value="b">Section B</SelectItem>
                  </SelectContent>
                </Select>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]"><Clock className="inline mr-1 h-4 w-4" />Time</TableHead>
                  {dayNames.map(day => <TableHead key={day}>{day}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSchedule.length > 0 ? (
                  currentSchedule.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-muted-foreground">{row.time}</TableCell>
                      {days.map(day => <ClassCell key={day} period={row[day]} />)}
                    </TableRow>
                  ))
                ) : (
                   <TableRow>
                        <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                            No schedule available for the selected filters.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
