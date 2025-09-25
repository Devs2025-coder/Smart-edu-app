

'use client';

import { useState, useMemo } from 'react';
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
import { MoreHorizontal, Check, X, ShieldAlert, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const initialInstitutionsData = [
  { id: 'INST001', name: 'Northwood University', admin: 'Admin Name', users: 150, status: 'Active', avatar: 'NU' },
  { id: 'INST002', name: 'Crestwood University', admin: 'Dr. Emily Carter', users: 320, status: 'Active', avatar: 'CU' },
  { id: 'INST003', name: 'Lakeside College', admin: 'Jane Doe', users: 210, status: 'Suspended', avatar: 'LC' },
  { id: 'INST004', name: 'Greenfield Tech', admin: 'John Appleseed', users: 0, status: 'Pending', avatar: 'GT' },
];

type Institution = typeof initialInstitutionsData[0];
type InstitutionStatus = 'Active' | 'Pending' | 'Suspended';
type Action = 'Approve' | 'Reject' | 'Suspend' | 'Re-activate' | 'View Details';


export default function ManageInstitutionsPage() {
  const [institutions, setInstitutions] = useState(initialInstitutionsData);
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();

  const handleAction = (action: Action, institution: Institution) => {
    
    if (action === 'View Details') {
         toast({
            title: 'Action Triggered',
            description: `Viewing details for ${institution.name}.`,
        });
        return;
    }

    if (action === 'Reject') {
        setInstitutions(current => current.filter(inst => inst.id !== institution.id));
        toast({
            variant: 'destructive',
            title: 'Institution Rejected',
            description: `${institution.name} has been removed.`,
        });
        return;
    }

    let newStatus: InstitutionStatus | undefined;
    let toastTitle = '';
    let toastDescription = '';

    switch (action) {
        case 'Approve':
            newStatus = 'Active';
            toastTitle = 'Institution Approved';
            toastDescription = `${institution.name} is now active.`;
            break;
        case 'Suspend':
            newStatus = 'Suspended';
            toastTitle = 'Institution Suspended';
            toastDescription = `${institution.name} has been suspended.`;
            break;
        case 'Re-activate':
            newStatus = 'Active';
            toastTitle = 'Institution Re-activated';
            toastDescription = `${institution.name} is active again.`;
            break;
    }
    
    if (newStatus) {
        setInstitutions(current => 
            current.map(inst => 
                inst.id === institution.id ? { ...inst, status: newStatus as InstitutionStatus } : inst
            )
        );
        toast({
            title: toastTitle,
            description: toastDescription,
        });
    }
  };

  const filteredInstitutions = useMemo(() => {
    if (activeTab === 'all') return institutions;
    return institutions.filter(
      (inst) => inst.status.toLowerCase() === activeTab
    );
  }, [institutions, activeTab]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case 'Suspended':
        return <Badge variant="destructive">{status}</Badge>;
      case 'Pending':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
   const renderTable = (data: Institution[]) => (
    <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Institution</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Users</TableHead>
            <TableHead>Status</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((inst) => (
            <TableRow key={inst.id}>
                <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar>
                    <AvatarImage src={`https://picsum.photos/seed/${inst.id}/40/40`} />
                    <AvatarFallback>{inst.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{inst.name}</span>
                </div>
                </TableCell>
                <TableCell>{inst.admin}</TableCell>
                <TableCell>{inst.users}</TableCell>
                <TableCell>{getStatusBadge(inst.status)}</TableCell>
                <TableCell>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    {inst.status === 'Pending' && (
                        <>
                            <DropdownMenuItem onClick={() => handleAction('Approve', inst)}><Check className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Reject', inst)} className="text-destructive"><X className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                        </>
                    )}
                    {inst.status === 'Active' && (
                        <DropdownMenuItem onClick={() => handleAction('Suspend', inst)} className="text-destructive"><ShieldAlert className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                    )}
                        {inst.status === 'Suspended' && (
                        <DropdownMenuItem onClick={() => handleAction('Re-activate', inst)}><Check className="mr-2 h-4 w-4" /> Re-activate</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleAction('View Details', inst)}><Eye className="mr-2 h-4 w-4" /> View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
    </Table>
  );

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Institution Management</CardTitle>
          <CardDescription>
            Approve, manage, and monitor all institutions on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="suspended">Suspended</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTable(filteredInstitutions)}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="active" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTable(filteredInstitutions)}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="pending" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTable(filteredInstitutions)}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="suspended" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Suspended Institutions</CardTitle>
                </CardHeader>
                <CardContent>
                    {renderTable(filteredInstitutions)}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
