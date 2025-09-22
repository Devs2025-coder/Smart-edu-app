
"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, KeyRound, Bell, Shield, Loader2, Eye, EyeOff, Building, Settings as SettingsIcon, FileUp, FileDown, PlusCircle, Trash2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const profileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  mobileNumber: z.string().optional(),
  profilePhoto: z.any().optional(),
})

const institutionFormSchema = z.object({
  institutionName: z.string().min(1, 'Institution name is required.'),
  address: z.string().min(1, 'Address is required.'),
  contactNumber: z.string().optional(),
  logo: z.any().optional(),
})

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
})

type ProfileFormData = z.infer<typeof profileFormSchema>
type InstitutionFormData = z.infer<typeof institutionFormSchema>
type PasswordFormData = z.infer<typeof passwordFormSchema>

export default function CollegeAdminSettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [branches, setBranches] = useState([
        'Computer Science & Engineering',
        'Mechanical Engineering',
    ]);
    const [newBranch, setNewBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('2024-2025');

    
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "Admin Name",
            mobileNumber: "+1 555 123 4567",
        },
    });

    const institutionForm = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionFormSchema),
        defaultValues: {
            institutionName: "Northwood University",
            address: "123 University Drive, Northwood, USA",
            contactNumber: "+1 555 987 6543",
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });

    const onSave = async (formName: string, data: any) => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`${formName} data:`, data);
        setIsSaving(false);
        toast({ title: `${formName} Updated`, description: `Your ${formName.toLowerCase()} information has been saved.` });
        if (formName === 'Password') {
            passwordForm.reset();
        }
    };
    
    const handleDataAction = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `The "${action}" functionality will be implemented in a future update.`,
        });
    };

    const handleAddBranch = () => {
        if (newBranch.trim() === '') {
            toast({ variant: 'destructive', title: 'Error', description: 'Branch name cannot be empty.' });
            return;
        }
        if (branches.find(b => b.toLowerCase() === newBranch.toLowerCase())) {
            toast({ variant: 'destructive', title: 'Error', description: 'This branch already exists.' });
            return;
        }
        setBranches([...branches, newBranch.trim()]);
        setNewBranch('');
        toast({ title: 'Success', description: `Branch "${newBranch.trim()}" has been added.` });
    };

    const handleDeleteBranch = (branchToDelete: string) => {
        setBranches(branches.filter(b => b !== branchToDelete));
        toast({ title: 'Success', description: `Branch "${branchToDelete}" has been removed.` });
    };

    const handleSetActiveYear = () => {
        toast({
            title: 'Academic Year Updated',
            description: `The active academic year has been set to ${selectedYear}.`,
        });
    };


  return (
    <div className="grid gap-6">
       <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Manage your administrator account and institution settings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
                        <TabsTrigger value="institution"><Building className="mr-2 h-4 w-4"/>Institution</TabsTrigger>
                        <TabsTrigger value="system"><SettingsIcon className="mr-2 h-4 w-4"/>System</TabsTrigger>
                        <TabsTrigger value="security"><KeyRound className="mr-2 h-4 w-4"/>Security</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="mt-6">
                       <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit((data) => onSave('Profile', data))}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Admin Information</CardTitle>
                                        <CardDescription>Update your personal administrator details here.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-6">
                                             <Avatar className="w-24 h-24">
                                                <AvatarImage src="https://picsum.photos/seed/admin/128/128" />
                                                <AvatarFallback>AN</AvatarFallback>
                                            </Avatar>
                                            <FormField
                                            control={profileForm.control}
                                            name="profilePhoto"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                <FormLabel>Update Profile Photo</FormLabel>
                                                <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        </div>
                                        <Separator/>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                            control={profileForm.control}
                                            name="fullName"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                            <FormField
                                            control={profileForm.control}
                                            name="mobileNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Mobile Number</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                                </FormItem>
                                            )}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                            Save Changes
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="institution" className="mt-6">
                       <Form {...institutionForm}>
                            <form onSubmit={institutionForm.handleSubmit((data) => onSave('Institution', data))}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Institution Details</CardTitle>
                                        <CardDescription>Manage your college or university's public information.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={institutionForm.control}
                                                name="institutionName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Institution Name</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                             <FormField
                                                control={institutionForm.control}
                                                name="contactNumber"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>Contact Number</FormLabel>
                                                    <FormControl><Input {...field} /></FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={institutionForm.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                    <FormLabel>Full Address</FormLabel>
                                                    <FormControl><Textarea {...field} /></FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                             <FormField
                                                control={institutionForm.control}
                                                name="logo"
                                                render={({ field }) => (
                                                    <FormItem className="md:col-span-2">
                                                    <FormLabel>Institution Logo</FormLabel>
                                                    <FormControl><Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} /></FormControl>
                                                    <FormMessage />
                                                    </FormItem>
                                                )}
                                                />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                            Save Institution Info
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    </TabsContent>
                    
                    <TabsContent value="system" className="mt-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>System Settings</CardTitle>
                                <CardDescription>Manage academic configurations and data.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Academic Year</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center gap-4">
                                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="2024-2025">2024-2025</SelectItem>
                                                <SelectItem value="2023-2024">2023-2024</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button onClick={handleSetActiveYear}>Set Active Year</Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                     <CardHeader>
                                        <CardTitle className="text-lg">Data Management</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-4">
                                        <Button variant="outline" onClick={() => handleDataAction('Import Students')}><FileUp className="mr-2 h-4 w-4"/> Import Students</Button>
                                        <Button variant="outline" onClick={() => handleDataAction('Export Students')}><FileDown className="mr-2 h-4 w-4"/> Export Students</Button>
                                        <Button variant="outline" onClick={() => handleDataAction('Import Professors')}><FileUp className="mr-2 h-4 w-4"/> Import Professors</Button>
                                        <Button variant="outline" onClick={() => handleDataAction('Export Professors')}><FileDown className="mr-2 h-4 w-4"/> Export Professors</Button>
                                    </CardContent>
                                </Card>
                                 <Card>
                                     <CardHeader>
                                        <CardTitle className="text-lg">Manage Branches & Semesters</CardTitle>
                                        <CardDescription>Add or remove academic branches and semesters available in the system.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Input 
                                                placeholder="Add new branch (e.g., Electrical Engineering)"
                                                value={newBranch}
                                                onChange={(e) => setNewBranch(e.target.value)}
                                            />
                                            <Button size="icon" onClick={handleAddBranch}><PlusCircle className="h-4 w-4"/></Button>
                                        </div>
                                        {branches.map(branch => (
                                             <div key={branch} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                <span>{branch}</span>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteBranch(branch)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                             </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="security" className="mt-6">
                       <Form {...passwordForm}>
                             <form onSubmit={passwordForm.handleSubmit((data) => onSave('Password', data))}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Change Password</CardTitle>
                                        <CardDescription>For security, please choose a strong password.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <FormField
                                          control={passwordForm.control}
                                          name="currentPassword"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Current Password</FormLabel>
                                              <FormControl>
                                                <div className="relative">
                                                  <Input type={showPassword ? 'text' : 'password'} {...field} />
                                                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                  </Button>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={passwordForm.control}
                                          name="newPassword"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>New Password</FormLabel>
                                              <FormControl>
                                                 <div className="relative">
                                                  <Input type={showPassword ? 'text' : 'password'} {...field} />
                                                </div>
                                              </FormControl>
                                              <FormDescription>Must be at least 8 characters long.</FormDescription>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={passwordForm.control}
                                          name="confirmPassword"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Confirm New Password</FormLabel>
                                               <FormControl>
                                                 <div className="relative">
                                                  <Input type={showPassword ? 'text' : 'password'} {...field} />
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                           {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                           Update Password
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>
            </CardContent>
       </Card>
    </div>
  );
}
