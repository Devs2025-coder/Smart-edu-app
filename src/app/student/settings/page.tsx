
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
import { User, Mail, Phone, Building, Briefcase, Calendar, KeyRound, Bell, Shield, Loader2, Eye, EyeOff, Laptop, Smartphone } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const profileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  mobileNumber: z.string().optional(),
  profilePhoto: z.any().optional(),
})

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
})

const notificationsFormSchema = z.object({
    attendanceAlerts: z.boolean().default(false),
    newTasks: z.boolean().default(true),
    deadlineReminders: z.boolean().default(true),
    emailNotifications: z.boolean().default(true),
});


type ProfileFormData = z.infer<typeof profileFormSchema>
type PasswordFormData = z.infer<typeof passwordFormSchema>
type NotificationsFormData = z.infer<typeof notificationsFormSchema>

export default function StudentSettingsPage() {
    const { toast } = useToast();
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "Sarah Miller",
            mobileNumber: "+1 987 654 3210",
            profilePhoto: undefined,
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });
    
    const notificationsForm = useForm<NotificationsFormData>({
        resolver: zodResolver(notificationsFormSchema),
        defaultValues: {
            attendanceAlerts: true,
            newTasks: true,
            deadlineReminders: true,
            emailNotifications: true,
        },
    });

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const file = e.target.files ? e.target.files[0] : null;
        field.onChange(file);
        if (file) {
            setProfilePhotoPreview(URL.createObjectURL(file));
        } else {
            setProfilePhotoPreview(null);
        }
    };
    
    const onProfileSubmit = async (data: ProfileFormData) => {
        setIsSavingProfile(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Profile data:", data);
        setIsSavingProfile(false);
        toast({ title: "Profile Updated", description: "Your profile information has been saved." });
    };
    
    const onPasswordSubmit = async (data: PasswordFormData) => {
        setIsSavingPassword(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Password data:", data);
        setIsSavingPassword(false);
        passwordForm.reset();
        toast({ title: "Password Changed", description: "Your password has been successfully updated." });
    };

    const onNotificationsSubmit = async (data: NotificationsFormData) => {
        setIsSavingNotifications(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Notifications data:", data);
        setIsSavingNotifications(false);
        toast({ title: "Preferences Saved", description: "Your notification settings have been updated." });
    };


  return (
    <div className="grid gap-6">
       <Card>
            <CardHeader>
                <CardTitle>Profile & Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="profile">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                        <TabsTrigger value="profile"><User className="mr-2"/>Profile</TabsTrigger>
                        <TabsTrigger value="password"><KeyRound className="mr-2"/>Password</TabsTrigger>
                        <TabsTrigger value="notifications"><Bell className="mr-2"/>Reminders</TabsTrigger>
                        <TabsTrigger value="privacy"><Shield className="mr-2"/>Privacy</TabsTrigger>
                    </TabsList>
                    
                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                            <div className="lg:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader className="items-center text-center">
                                        <Avatar className="w-24 h-24 mb-4">
                                            <AvatarImage src="https://picsum.photos/seed/student/128/128" />
                                            <AvatarFallback>SM</AvatarFallback>
                                        </Avatar>
                                        <CardTitle>Sarah Miller</CardTitle>
                                        <CardDescription>Student</CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground space-y-4">
                                        <div className="flex items-center gap-3"><Mail /><span className="truncate">sarah.miller@university.edu</span></div>
                                        <div className="flex items-center gap-3"><Phone /><span>+1 987 654 3210</span></div>
                                        <div className="flex items-center gap-3"><Building /><span>Computer Science</span></div>
                                        <div className="flex items-center gap-3"><Calendar /><span>Joined: Aug 20, 2023</span></div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="lg:col-span-2">
                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Edit Personal Information</CardTitle>
                                                <CardDescription>Update your personal details here.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
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
                                                <FormField
                                                  control={profileForm.control}
                                                  name="profilePhoto"
                                                  render={({ field }) => (
                                                    <FormItem>
                                                      <FormLabel>Profile Photo</FormLabel>
                                                        {profilePhotoPreview && (
                                                            <div className="w-24 h-24 rounded-full overflow-hidden">
                                                                <Image src={profilePhotoPreview} alt="Profile preview" width={96} height={96} className="object-cover" />
                                                            </div>
                                                        )}
                                                      <FormControl><Input type="file" accept="image/*" onChange={(e) => handleProfilePhotoChange(e, field)} /></FormControl>
                                                      <FormDescription>Upload a new profile picture. Recommended size: 200x200px.</FormDescription>
                                                      <FormMessage />
                                                    </FormItem>
                                                  )}
                                                />
                                            </CardContent>
                                            <CardFooter className="flex justify-end">
                                                <Button type="submit" disabled={isSavingProfile}>
                                                    {isSavingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                                    Save Changes
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </TabsContent>

                     {/* Password Tab */}
                    <TabsContent value="password">
                        <Form {...passwordForm}>
                             <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                                <Card className="mt-6 max-w-2xl mx-auto">
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
                                                  <Input type={showCurrentPassword ? 'text' : 'password'} {...field} />
                                                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                                                    {showCurrentPassword ? <EyeOff /> : <Eye />}
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
                                                  <Input type={showNewPassword ? 'text' : 'password'} {...field} />
                                                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowNewPassword(!showNewPassword)}>
                                                    {showNewPassword ? <EyeOff /> : <Eye />}
                                                  </Button>
                                                </div>
                                              </FormControl>
                                              <FormDescription>Must be at least 8 characters long, include an uppercase letter and a number.</FormDescription>
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
                                                  <Input type={showConfirmPassword ? 'text' : 'password'} {...field} />
                                                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                                  </Button>
                                                </div>
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={isSavingPassword}>
                                           {isSavingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                           Update Password
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Form {...notificationsForm}>
                           <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}>
                                <Card className="mt-6 max-w-2xl mx-auto">
                                    <CardHeader>
                                        <CardTitle>Reminder Preferences</CardTitle>
                                        <CardDescription>Manage how you receive reminders from the platform.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <FormField
                                            control={notificationsForm.control}
                                            name="attendanceAlerts"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Attendance Alerts</FormLabel>
                                                        <FormDescription>Get notified when your attendance is marked.</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={notificationsForm.control}
                                            name="newTasks"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">New Task Alerts</FormLabel>
                                                        <FormDescription>Get notified when a new task is assigned to you.</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                         <FormField
                                            control={notificationsForm.control}
                                            name="deadlineReminders"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Deadline Reminders</FormLabel>
                                                        <FormDescription>Receive reminders for upcoming task deadlines.</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Separator />
                                         <FormField
                                            control={notificationsForm.control}
                                            name="emailNotifications"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Email Notifications</FormLabel>
                                                        <FormDescription>Enable or disable all email alerts.</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={isSavingNotifications}>
                                            {isSavingNotifications && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                            Save Preferences
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </form>
                        </Form>
                    </TabsContent>

                    {/* Privacy Tab */}
                    <TabsContent value="privacy">
                        <Card className="mt-6 max-w-2xl mx-auto">
                            <CardHeader>
                                <CardTitle>Privacy & Security</CardTitle>
                                <CardDescription>Manage your account security and data privacy.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <p className="text-base font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                    </div>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button>Enable</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Feature Unavailable</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Two-Factor Authentication requires backend server configuration and cannot be enabled from this interface. Please contact your administrator for assistance.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogAction>OK</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                                 <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <p className="text-base font-medium">Active Sessions</p>
                                        <p className="text-sm text-muted-foreground">You can only be logged in on one device at a time.</p>
                                    </div>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary">View Session</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Active Session</DialogTitle>
                                                <DialogDescription>
                                                    This is the device currently logged into your account.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <Laptop className="h-6 w-6 text-foreground" />
                                                        <div>
                                                            <p className="font-medium">Chrome on Windows</p>
                                                            <p className="text-sm text-muted-foreground">Current session</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="link" className="text-primary pr-0">Sign out</Button>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <p className="text-base font-medium">Data & Privacy</p>
                                        <p className="text-sm text-muted-foreground">Read our policies on data handling and privacy.</p>
                                    </div>
                                    <Button variant="link" asChild>
                                        <Link href="/privacy">View Policy</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
       </Card>
    </div>
  );
}
