
'use client';

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
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const scheduleData = [
    { time: '09:00 - 10:00', M: { subject: 'Data Structures', details: 'Sem 3, Sec A', room: 'A-101' }, T: null, W: { subject: 'Data Structures', details: 'Sem 3, Sec A', room: 'A-101' }, Th: null, F: { subject: 'Data Structures', details: 'Sem 3, Sec A', room: 'A-101' } },
    { time: '10:00 - 11:00', M: { subject: 'Calculus II', details: 'Sem 3, Sec A', room: 'C-105' }, T: { subject: 'Data Structures', details: 'Sem 3, Sec B', room: 'A-102' }, W: { subject: 'Calculus II', details: 'Sem 3, Sec A', room: 'C-105' }, Th: { subject: 'Data Structures', details: 'Sem 3, Sec B', room: 'A-102' }, F: { subject: 'Calculus II', details: 'Sem 3, Sec A', room: 'C-105' } },
    { time: '11:00 - 12:00', M: { subject: 'Data Structures', details: 'Sem 3, Sec B', room: 'A-102' }, T: null, W: { subject: 'Calculus II', details: 'Sem 3, Sec B', room: 'C-106' }, Th: { subject: 'DS Lab', details: 'Sem 3, Sec B', room: 'A-Lab' }, F: null },
    { time: '12:00 - 01:00', M: null, T: null, W: null, Th: null, F: null },
    { time: '01:00 - 02:00', M: { subject: 'DS Lab', details: 'Sem 3, Sec A', room: 'A-Lab' }, T: null, W: { subject: 'DS Lab', details: 'Sem 3, Sec A', room: 'A-Lab' }, Th: null, F: { subject: 'DS Lab', details: 'Sem 3, Sec B', room: 'A-Lab' } },
];

const days = ['M', 'T', 'W', 'Th', 'F'];
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ProfessorClassesPage() {
  
  const ClassCell = ({ period }: { period: { subject: string, details: string, room: string } | null }) => {
    if (!period) return <TableCell className="h-20"></TableCell>;
    return (
      <TableCell className="p-2 h-20 align-top">
        <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg h-full flex flex-col">
            <p className="font-semibold text-sm text-primary">{period.subject}</p>
            <p className="text-xs text-foreground/80">{period.details}</p>
            <div className="mt-auto">
                <Badge variant="secondary" className="w-fit">{period.room}</Badge>
            </div>
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
            Here is your teaching schedule for the current week.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] min-w-[120px]"><Clock className="inline mr-1 h-4 w-4" />Time</TableHead>
                  {dayNames.map(day => <TableHead key={day} className="min-w-[150px]">{day}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-muted-foreground">{row.time}</TableCell>
                      {days.map(day => <ClassCell key={day} period={row[day]} />)}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
