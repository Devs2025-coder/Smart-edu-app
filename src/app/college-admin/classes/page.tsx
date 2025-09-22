
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { PlusCircle, UserPlus, Clock, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ClassScheduleDialog } from '@/components/college-admin/class-schedule-dialog';

const existingClasses = [
  { id: 'C1', branch: 'Computer Science', semester: '3', section: 'A', professor: 'Dr. Evelyn Reed', students: 60 },
  { id: 'C2', branch: 'Computer Science', semester: '3', section: 'B', professor: 'Dr. Evelyn Reed', students: 60 },
  { id: 'C3', branch: 'Physics', semester: '1', section: 'A', professor: 'Dr. Samuel Grant', students: 55 },
  { id: 'C4', branch: 'Mathematics', semester: '5', section: 'A', professor: 'Dr. Clara Oswald', students: 50 },
];

const initialScheduleData = [
    { time: '09:00 - 10:00', M: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Reed' }, T: null, W: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Reed' }, Th: null, F: { subject: 'Data Structures', room: 'A-101', prof: 'Dr. Reed' } },
    { time: '10:00 - 11:00', M: { subject: 'Calculus II', room: 'C-105', prof: 'Dr. Oswald' }, T: { subject: 'Physics II', room: 'B-203', prof: 'Dr. Grant' }, W: { subject: 'Calculus II', room: 'C-105', prof: 'Dr. Oswald' }, Th: { subject: 'Physics II', room: 'B-203', prof: 'Dr. Grant' }, F: { subject: 'Calculus II', room: 'C-105', prof: 'Dr. Oswald' } },
    { time: '11:00 - 12:00', M: { subject: 'Discrete Maths', room: 'C-102', prof: 'Dr. Reed' }, T: null, W: { subject: 'Discrete Maths', room: 'C-102', prof: 'Dr. Reed' }, Th: { subject: 'DS Lab', room: 'A-Lab', prof: 'Dr. Reed' }, F: null },
];

const days = ['M', 'T', 'W', 'Th', 'F'];
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function ClassesPage() {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState(null);

  const handleSavePeriod = (periodData) => {
    // This is a simplified save function. In a real app, this would be more complex.
    const { day, time, ...rest } = periodData;
    const timeIndex = scheduleData.findIndex(row => row.time === time);

    if (timeIndex !== -1) {
      const newScheduleData = [...scheduleData];
      newScheduleData[timeIndex] = {
        ...newScheduleData[timeIndex],
        [day]: { ...rest }
      };
      setScheduleData(newScheduleData);
    }
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
            <p className="text-xs text-muted-foreground">{period.prof}</p>
            <div className="mt-auto flex justify-between items-center">
                <Badge variant="secondary" className="w-fit">{period.room}</Badge>
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
          <CardTitle>Classes & Timetables</CardTitle>
          <CardDescription>
            Manage academic classes, assign educators, and set up schedules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="management">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="management">Class Management</TabsTrigger>
              <TabsTrigger value="timetable">Timetable Builder</TabsTrigger>
            </TabsList>
            
            <TabsContent value="management" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Class</CardTitle>
                        <CardDescription>Define a new class by branch, semester, and section.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
                            <SelectContent><SelectItem value="cse">Computer Science</SelectItem></SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
                            <SelectContent><SelectItem value="3">Semester 3</SelectItem></SelectContent>
                        </Select>
                        <Input placeholder="Enter Section (e.g., A, B)"/>
                        <Button className="w-full md:w-auto"><PlusCircle className="mr-2 h-4 w-4"/>Create Class</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Existing Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Branch</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Section</TableHead>
                                    <TableHead>Assigned Professor</TableHead>
                                    <TableHead>No. of Students</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {existingClasses.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.branch}</TableCell>
                                        <TableCell>{c.semester}</TableCell>
                                        <TableCell>{c.section}</TableCell>
                                        <TableCell>{c.professor}</TableCell>
                                        <TableCell>{c.students}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4"/>Assign Professor</DropdownMenuItem>
                                                    <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4"/>Assign Students</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="timetable" className="mt-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Timetable Editor</CardTitle>
                        <CardDescription>Build or modify the schedule for a specific class.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <Select>
                                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Branch" /></SelectTrigger>
                                <SelectContent><SelectItem value="cse">Computer Science</SelectItem></SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Semester" /></SelectTrigger>
                                <SelectContent><SelectItem value="3">Semester 3</SelectItem></SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className="w-full md:w-[200px]"><SelectValue placeholder="Select Section" /></SelectTrigger>
                                <SelectContent><SelectItem value="a">Section A</SelectItem></SelectContent>
                            </Select>
                            <div className="flex-1" />
                            <Button onClick={() => handleOpenDialog()} variant="outline"><PlusCircle className="mr-2 h-4 w-4"/>Add Period</Button>
                            <Button><Clock className="mr-2 h-4 w-4"/>Publish Timetable</Button>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
       <ClassScheduleDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePeriod}
        periodData={editingPeriod}
        timeSlots={scheduleData.map(s => s.time)}
      />
    </div>
  );
}
