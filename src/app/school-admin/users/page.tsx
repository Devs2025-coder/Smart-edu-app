
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
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, UserPlus, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const teachersData = [
  { id: 'T101', name: 'Ms. Priya Sharma', subject: 'Math, Science', class: '6A', contact: 'p.sharma@school.edu', status: 'Active', avatar: 'PS' },
  { id: 'T102', name: 'Mr. Rohan Verma', subject: 'English, History', class: '7B', contact: 'r.verma@school.edu', status: 'Active', avatar: 'RV' },
  { id: 'T103', name: 'Ms. Anjali Singh', subject: 'Art, Music', class: 'All', contact: 'a.singh@school.edu', status: 'Inactive', avatar: 'AS' },
];

const studentsData = [
  { id: 'S201', name: 'Aarav Sharma', class: '6A', parentLinked: true, attendance: '95%', performance: 'Good' },
  { id: 'S202', name: 'Saanvi Gupta', class: '6A', parentLinked: true, attendance: '98%', performance: 'Excellent' },
  { id: 'S203', name: 'Vihaan Singh', class: '7B', parentLinked: false, attendance: '82%', performance: 'Average' },
];

const parentsData = [
    { id: 'P301', name: 'Mr. Patel', children: 'Advik Patel (6A)', contact: 'p.patel@email.com', status: 'Active' },
    { id: 'P302', name: 'Mrs. Gupta', children: 'Saanvi Gupta (6A)', contact: 'p.gupta@email.com', status: 'Active' },
];

export default function ManageUsersPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'teachers';
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>
              View, add, edit, or remove users from your institution.
            </CardDescription>
          </div>
          <Button asChild>
            <Link href="/register/user?role=teacher">
              <UserPlus className="mr-2 h-4 w-4" /> Add New User
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="teachers">Teachers</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="parents">Parents</TabsTrigger>
            </TabsList>
            
            <TabsContent value="teachers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Roster</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Teacher</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead>Subject(s)</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teachersData.map((prof) => (
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
                          <TableCell>{prof.subject}</TableCell>
                          <TableCell>{prof.class}</TableCell>
                          <TableCell>{prof.contact}</TableCell>
                          <TableCell>
                            <Badge variant={prof.status === 'Active' ? 'default' : 'destructive'} className={prof.status === 'Active' ? 'bg-green-500' : ''}>
                              {prof.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
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
                        <TableHead>Class</TableHead>
                        <TableHead>Parent Linked</TableHead>
                        <TableHead>Attendance</TableHead>
                        <TableHead>Performance</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsData.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.class}</TableCell>
                          <TableCell>
                            <Badge variant={student.parentLinked ? 'default' : 'outline'} className={student.parentLinked ? 'bg-green-500' : ''}>
                              {student.parentLinked ? 'Yes' : 'No'}
                            </Badge>
                          </TableCell>
                           <TableCell>{student.attendance}</TableCell>
                           <TableCell>{student.performance}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
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

             <TabsContent value="parents" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Parent Roster</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Child(ren) Linked</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parentsData.map((parent) => (
                        <TableRow key={parent.id}>
                          <TableCell className="font-medium">{parent.name}</TableCell>
                          <TableCell>{parent.children}</TableCell>
                          <TableCell>{parent.contact}</TableCell>
                           <TableCell>
                            <Badge variant={parent.status === 'Active' ? 'default' : 'destructive'} className={parent.status === 'Active' ? 'bg-green-500' : ''}>
                              {parent.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                <DropdownMenuItem><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
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
