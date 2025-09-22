
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
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Check, X, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const studentsData = [
  { id: '201', name: 'Aarav Sharma', status: 'present' },
  { id: '202', name: 'Saanvi Gupta', status: 'present' },
  { id: '203', name: 'Vihaan Singh', status: 'absent' },
  { id: '204', name: 'Myra Reddy', status: 'present' },
  { id: '205', name: 'Advik Patel', status: 'late' },
  { id: '206', name: 'Anika Desai', status: 'present' },
];

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState('grade6a');
  const [students, setStudents] = useState(studentsData);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(
      students.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  };
  
  const handleSelectAll = (checked: boolean | string) => {
    const newStatus = checked ? 'present' : 'absent';
    setStudents(students.map(s => ({ ...s, status: newStatus })));
  };
  
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Saving attendance:", students);
    setIsSaving(false);
    toast({
      title: 'Attendance Saved',
      description: `Attendance for Grade 6 - Section A has been successfully recorded.`,
    });
  }

  const allPresent = students.every(s => s.status === 'present');
  const somePresent = students.some(s => s.status === 'present') && !allPresent;

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>
            Select a class and manually mark student attendance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select defaultValue="grade6a" onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grade6a">Grade 6 - Section A</SelectItem>
                <SelectItem value="grade7b">Grade 7 - Section B</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <div className="flex gap-4 items-center text-sm">
                <span>Present: <span className="font-bold">{presentCount}</span></span>
                <span>Absent: <span className="font-bold text-destructive">{absentCount}</span></span>
                <span>Late: <span className="font-bold text-yellow-600">{lateCount}</span></span>
            </div>
          </div>
          <div className="border rounded-lg">
             <Table>
              <TableHeader>
                <TableRow>
                   <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={allPresent ? true : (somePresent ? 'indeterminate' : false)}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll No.</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox 
                        checked={student.status === 'present'}
                        onCheckedChange={(checked) => handleStatusChange(student.id, checked ? 'present' : 'absent')}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell className="text-center">
                       <Select 
                          value={student.status}
                          onValueChange={(value: 'present' | 'absent' | 'late') => handleStatusChange(student.id, value)}
                        >
                          <SelectTrigger className="w-32 mx-auto">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="present"><div className="flex items-center"><Check className="mr-2 h-4 w-4 text-green-500" /> Present</div></SelectItem>
                            <SelectItem value="absent"><div className="flex items-center"><X className="mr-2 h-4 w-4 text-red-500" /> Absent</div></SelectItem>
                            <SelectItem value="late"><div className="flex items-center"><Minus className="mr-2 h-4 w-4 text-yellow-500" /> Late</div></SelectItem>
                          </SelectContent>
                        </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
            <div className="flex justify-between mt-6">
                 <div>
                    <Button variant="outline" onClick={() => handleSelectAll(false)}>Mark All Absent</Button>
                </div>
                <Button onClick={handleSaveAttendance} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Attendance
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
