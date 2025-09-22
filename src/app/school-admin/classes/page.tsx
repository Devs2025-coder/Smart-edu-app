
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle, UserPlus, Users, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialClassesData = [
  { id: 'Cls1', name: 'Class 6', sections: 'A, B', teacher: 'Ms. Priya Sharma', strength: 60 },
  { id: 'Cls2', name: 'Class 7', sections: 'A, B', teacher: 'Mr. Rohan Verma', strength: 58 },
  { id: 'Cls3', name: 'Class 8', sections: 'A', teacher: 'Unassigned', strength: 32 },
];

export default function SchoolClassesPage() {
  const [classes, setClasses] = useState(initialClassesData);
  const [newClassName, setNewClassName] = useState('');
  const [newSections, setNewSections] = useState('');
  const { toast } = useToast();

  const handleCreateClass = () => {
    if (!newClassName.trim() || !newSections.trim()) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both a class name and at least one section.',
      });
      return;
    }
    const newClass = {
      id: `Cls${classes.length + 1}`,
      name: newClassName,
      sections: newSections,
      teacher: 'Unassigned',
      strength: 0,
    };
    setClasses([...classes, newClass]);
    setNewClassName('');
    setNewSections('');
    toast({
      title: 'Class Created',
      description: `${newClass.name} with sections ${newClass.sections} has been added.`,
    });
  };

  const handleAction = (action: string, className: string) => {
    toast({
      title: `${action} Triggered`,
      description: `The action to ${action.toLowerCase()} for ${className} has been initiated.`,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Class & Section Management</CardTitle>
          <CardDescription>
            Create new classes and manage existing ones for your school.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Class</CardTitle>
              <CardDescription>
                Define a new class and its sections (e.g., A, B, C).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input 
                placeholder="Enter Class Name (e.g., Class 9)" 
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="md:col-span-2"
              />
              <Input 
                placeholder="Enter Sections (comma-separated, e.g., A, B, C)" 
                value={newSections}
                onChange={(e) => setNewSections(e.target.value)}
                className="md:col-span-1"
              />
              <Button className="w-full md:w-auto" onClick={handleCreateClass}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Class
              </Button>
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
                    <TableHead>Class Name</TableHead>
                    <TableHead>Sections</TableHead>
                    <TableHead>Assigned Class Teacher</TableHead>
                    <TableHead>Student Strength</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.sections}</TableCell>
                      <TableCell>{c.teacher}</TableCell>
                      <TableCell>{c.strength}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleAction('Assign Teacher', c.name)}>
                              <UserPlus className="mr-2 h-4 w-4" />Assign Class Teacher
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('View Students', c.name)}>
                              <Users className="mr-2 h-4 w-4" />View Students
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
