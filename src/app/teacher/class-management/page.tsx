

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const studentsData = [
  { id: '201', name: 'Aarav Sharma', parentContact: 'p.sharma@email.com', attendance: '95%', performance: 'Good', avatar: 'AS' },
  { id: '202', name: 'Saanvi Gupta', parentContact: 'p.gupta@email.com', attendance: '98%', performance: 'Excellent', avatar: 'SG' },
  { id: '203', name: 'Vihaan Singh', parentContact: 'p.singh@email.com', attendance: '82%', performance: 'Average', avatar: 'VS' },
  { id: '204', name: 'Myra Reddy', parentContact: 'p.reddy@email.com', attendance: '99%', performance: 'Excellent', avatar: 'MR' },
  { id: '205', name: 'Advik Patel', parentContact: 'p.patel@email.com', attendance: '88%', performance: 'Good', avatar: 'AP' },
];


export default function TeacherClassManagementPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>
            View student roster and their performance snapshot.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select defaultValue="grade6a">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grade6a">Grade 6 - Section A</SelectItem>
                <SelectItem value="grade7b">Grade 7 - Section B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Card>
            <CardHeader>
                <CardTitle>Student Roster: Grade 6 - Section A</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Parent Contact</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Performance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentsData.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={`https://picsum.photos/seed/${student.id}/40/40`} />
                                        <AvatarFallback>{student.avatar}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{student.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.parentContact}</TableCell>
                            <TableCell>
                                <Badge variant={parseInt(student.attendance) > 90 ? 'default' : 'secondary'}>{student.attendance}</Badge>
                            </TableCell>
                            <TableCell>
                                 <Badge variant={student.performance === 'Excellent' ? 'default' : (student.performance === 'Good' ? 'secondary' : 'destructive')}>{student.performance}</Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

