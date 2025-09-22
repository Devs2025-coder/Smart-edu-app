

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
import { User, KeyRound, Bell, Shield, Loader2, Eye, EyeOff, Building, Settings as SettingsIcon, FileUp, FileDown, PlusCircle, Trash2, School } from "lucide-react"
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

export default function SchoolAdminSettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [grades, setGrades] = useState([
        'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
        'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
    ]);
    const [newGrade, setNewGrade] = useState('');
    const [selectedYear, setSelectedYear] = useState('2024-2025');

    
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "School Admin",
            mobileNumber: "+91 99887 76655",
        },
    });

    const institutionForm = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionFormSchema),
        defaultValues: {
            institutionName: "Greenwood High",
            address: "456 Park Avenue, Greenfield, USA",
            contactNumber: "+91 98765 43210",
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

    const handleAddGrade = () => {
        if (newGrade.trim() === '') {
            toast({ variant: 'destructive', title: 'Error', description: 'Grade name cannot be empty.' });
            return;
        }
        if (grades.find(g => g.toLowerCase() === newGrade.toLowerCase())) {
            toast({ variant: 'destructive', title: 'Error', description: 'This grade already exists.' });
            return;
        }
        setGrades([...grades, newGrade.trim()]);
        setNewGrade('');
        toast({ title: 'Success', description: `Grade "${newGrade.trim()}" has been added.` });
    };

    const handleDeleteGrade = (gradeToDelete: string) => {
        setGrades(grades.filter(g => g !== gradeToDelete));
        toast({ title: 'Success', description: `Grade "${gradeToDelete}" has been removed.` });
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
                <CardDescription>Manage your administrator account and school settings.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
                        <TabsTrigger value="institution"><School className="mr-2 h-4 w-4"/>School</TabsTrigger>
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
                                                <AvatarImage src="https://picsum.photos/seed/school-admin/128/128" />
                                                <AvatarFallback>SA</AvatarFallback>
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
                            <form onSubmit={institutionForm.handleSubmit((data) => onSave('School', data))}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>School Details</CardTitle>
                                        <CardDescription>Manage your school's public information.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <FormField
                                                control={institutionForm.control}
                                                name="institutionName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                    <FormLabel>School Name</FormLabel>
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
                                                    <FormLabel>School Logo</FormLabel>
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
                                            Save School Info
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
                                        <Button variant="outline" onClick={() => handleDataAction('Import Teachers')}><FileUp className="mr-2 h-4 w-4"/> Import Teachers</Button>
                                        <Button variant="outline" onClick={() => handleDataAction('Export Teachers')}><FileDown className="mr-2 h-4 w-4"/> Export Teachers</Button>
                                    </CardContent>
                                </Card>
                                 <Card>
                                     <CardHeader>
                                        <CardTitle className="text-lg">Manage Grades & Sections</CardTitle>
                                        <CardDescription>Add or remove grades and sections available in the system.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Input 
                                                placeholder="Add new grade (e.g., Grade 13)"
                                                value={newGrade}
                                                onChange={(e) => setNewGrade(e.target.value)}
                                            />
                                            <Button size="icon" onClick={handleAddGrade}><PlusCircle className="h-4 w-4"/></Button>
                                        </div>
                                        {grades.map(grade => (
                                             <div key={grade} className="flex items-center justify-between p-2 bg-muted rounded-md">
                                                <span>{grade}</span>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteGrade(grade)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
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


