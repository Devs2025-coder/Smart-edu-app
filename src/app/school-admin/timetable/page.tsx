
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { PlusCircle, Clock, MoreHorizontal, Edit, Trash2, Plus, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ClassScheduleDialog } from '@/components/school-admin/class-schedule-dialog';
import { useToast } from '@/hooks/use-toast';

const initialScheduleData = [
    { time: '09:00 - 10:00', M: { subject: 'Math', room: '101', teacher: 'Ms. Sharma' }, T: null, W: { subject: 'Math', room: '101', teacher: 'Ms. Sharma' }, Th: null, F: { subject: 'Math', room: '101', teacher: 'Ms. Sharma' } },
    { time: '10:00 - 11:00', M: { subject: 'Science', room: '203', teacher: 'Mr. Verma' }, T: { subject: 'English', room: '105', teacher: 'Ms. Singh' }, W: { subject: 'Science', room: '203', teacher: 'Mr. Verma' }, Th: { subject: 'English', room: '105', teacher: 'Ms. Singh' }, F: { subject: 'Science', room: '203', teacher: 'Mr. Verma' } },
    { time: '11:00 - 12:00', M: { subject: 'History', room: '102', teacher: 'Mr. Verma' }, T: null, W: { subject: 'History', room: '102', teacher: 'Mr. Verma' }, Th: { subject: 'Art Class', room: 'Art Room', teacher: 'Ms. Anjali' }, F: null },
];

const days = ['M', 'T', 'W', 'Th', 'F'];
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function TimetablePage() {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);
  const { toast } = useToast();

  const handleSavePeriod = (periodData) => {
    setScheduleData(currentSchedule => {
        const { day, time, ...rest } = periodData;
        const originalTime = editingPeriod?.time;
        let newScheduleData = [...currentSchedule];

        if (originalTime && originalTime !== time) {
            const oldTimeIndex = newScheduleData.findIndex(row => row.time === originalTime);
            if (oldTimeIndex !== -1) {
                newScheduleData[oldTimeIndex][editingPeriod.day] = null;
            }
        }

        const targetTimeIndex = newScheduleData.findIndex(row => row.time === time);

        if (targetTimeIndex !== -1) {
            newScheduleData[targetTimeIndex] = {
                ...newScheduleData[targetTimeIndex],
                [day]: { ...rest }
            };
        } else {
            const newRow = { time, M: null, T: null, W: null, Th: null, F: null };
            newRow[day] = { ...rest };
            newScheduleData.push(newRow);
            newScheduleData.sort((a, b) => a.time.localeCompare(b.time));
        }

        return newScheduleData;
    });
    setEditingPeriod(null);
  };

  const handleDeletePeriod = (day, time) => {
    const timeIndex = scheduleData.findIndex(row => row.time === time);
    if (timeIndex !== -1) {
        const newScheduleData = [...scheduleData];
        newScheduleData[timeIndex][day] = null;
        setScheduleData(newScheduleData);
    }
  };

  const handleOpenDialog = (period = null) => {
    setEditingPeriod(period);
    setIsDialogOpen(true);
  };
  
  const handlePublishTimetable = () => {
    toast({
      title: 'Timetable Published',
      description: 'The schedule is now visible to teachers and students.',
    });
  };

  const handleDownloadTimetable = () => {
    toast({
      title: 'Download Initiated',
      description: 'The timetable is being generated as a PDF.',
    });
  };

  const ClassCell = ({ period, day, time }) => {
    if (!period) {
        return (
            <TableCell className="p-2 h-20 text-center">
                <Button variant="ghost" size="icon" onClick={() => handleOpenDialog({ day, time })}>
                    <Plus className="h-4 w-4 text-muted-foreground"/>
                </Button>
            </TableCell>
        );
    }
    return (
      <TableCell className="p-2 h-20 align-top">
        <div className="bg-muted/50 p-2 rounded-lg h-full flex flex-col group relative">
            <p className="font-semibold text-sm">{period.subject}</p>
            <p className="text-xs text-muted-foreground">{period.teacher}</p>
            <div className="mt-auto flex justify-between items-center">
                <Badge variant="secondary" className="w-fit">Room: {period.room}</Badge>
            </div>
             <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleOpenDialog({ ...period, day, time })}>
                            <Edit className="mr-2 h-4 w-4"/> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeletePeriod(day, time)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
      </TableCell>
    );
  };

  return (
    <div className="grid gap-6">
       <Card>
          <CardHeader>
              <CardTitle>Timetable Builder</CardTitle>
              <CardDescription>Build or modify the schedule for a specific class.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Select>
                      <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Grade" /></SelectTrigger>
                      <SelectContent><SelectItem value="6">Grade 6</SelectItem></SelectContent>
                  </Select>
                  <Select>
                      <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Section" /></SelectTrigger>
                      <SelectContent><SelectItem value="a">Section A</SelectItem></SelectContent>
                  </Select>
                  <div className="flex-1" />
                  <Button onClick={() => handleOpenDialog()} variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Period</Button>
                  <Button onClick={handleDownloadTimetable} variant="outline"><Download className="mr-2 h-4 w-4"/>Download</Button>
                  <Button onClick={handlePublishTimetable}><Clock className="mr-2 h-4 w-4"/>Publish Timetable</Button>
              </div>
              <div className="border rounded-lg overflow-x-auto">
                  <Table>
                      <TableHeader>
                          <TableRow>
                          <TableHead className="w-[120px] min-w-[120px]"><Clock className="inline mr-1 h-4 w-4" />Time</TableHead>
                          {dayNames.map(day => <TableHead key={day} className="min-w-[170px]">{day}</TableHead>)}
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {scheduleData.map((row, index) => (
                              <TableRow key={index}>
                                  <TableCell className="font-medium text-muted-foreground">{row.time}</TableCell>
                                  {days.map(day => <ClassCell key={day} period={row[day]} day={day} time={row.time} />)}
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
       </Card>
       <ClassScheduleDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePeriod}
        periodData={editingPeriod}
      />
    </div>
  );
}
