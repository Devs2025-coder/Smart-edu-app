
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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const professorsData = [
  { id: 'P101', name: 'Dr. Evelyn Reed', department: 'Computer Science', classes: 'CS101, CS305', contact: 'e.reed@university.edu', avatar: 'ER' },
  { id: 'P102', name: 'Dr. Samuel Grant', department: 'Physics', classes: 'PH203, PH401', contact: 's.grant@university.edu', avatar: 'SG' },
  { id: 'P103', name: 'Dr. Clara Oswald', department: 'Mathematics', classes: 'MA305', contact: 'c.oswald@university.edu', avatar: 'CO' },
];

const studentsData = [
  { id: 'S201', name: 'John Doe', branch: 'CSE', semester: 3, section: 'A', status: 'Active' },
  { id: 'S202', name: 'Jane Smith', branch: 'ECE', semester: 1, section: 'B', status: 'Active' },
  { id: 'S203', name: 'Peter Jones', branch: 'CSE', semester: 3, section: 'A', status: 'Inactive' },
  { id: 'S204', name: 'Mary Johnson', branch: 'ME', semester: 5, section: 'C', status: 'Active' },
];

export default function ManageUsersPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>
            View, edit, or remove professors and students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="professors">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="professors">Professors</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
            </TabsList>
            
            <TabsContent value="professors" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Professor Roster</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Professor</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Assigned Classes</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {professorsData.map((prof) => (
                        <TableRow key={prof.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={`https://picsum.photos/seed/${prof.id}/40/40`} />
                                <AvatarFallback>{prof.avatar}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{prof.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{prof.id}</TableCell>
                          <TableCell>{prof.department}</TableCell>
                          <TableCell>{prof.classes}</TableCell>
                          <TableCell>{prof.contact}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Remove</DropdownMenuItem>
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

            <TabsContent value="students" className="mt-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Branch" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Branches</SelectItem>
                        <SelectItem value="cse">CSE</SelectItem>
                        <SelectItem value="ece">ECE</SelectItem>
                        <SelectItem value="me">ME</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select defaultValue="all">
                        <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Semester" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Semesters</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              <Card>
                <CardHeader>
                  <CardTitle>Student Roster</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Roll No.</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.branch}</TableCell>
                          <TableCell>{student.semester}</TableCell>
                          <TableCell>{student.section}</TableCell>
                          <TableCell>
                            <Badge variant={student.status === 'Active' ? 'default' : 'destructive'} className={student.status === 'Active' ? 'bg-green-500' : ''}>
                              {student.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Remove</DropdownMenuItem>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
