

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
import { User, KeyRound, Bell, Shield, Loader2, Eye, EyeOff, Server, Mail } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const profileFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required."),
  email: z.string().email(),
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
    newRegistrations: z.boolean().default(true),
    systemErrors: z.boolean().default(true),
    emailNotifications: z.boolean().default(true),
});


type ProfileFormData = z.infer<typeof profileFormSchema>
type PasswordFormData = z.infer<typeof passwordFormSchema>
type NotificationsFormData = z.infer<typeof notificationsFormSchema>

export default function SuperAdminSettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            fullName: "Super Admin",
            email: "super.admin@edutrack.com",
        },
    });

    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    });
    
    const notificationsForm = useForm<NotificationsFormData>({
        resolver: zodResolver(notificationsFormSchema),
        defaultValues: {
            newRegistrations: true,
            systemErrors: true,
            emailNotifications: true,
        },
    });

    const onSave = async (formName: string, data: any) => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`${formName} data:`, data);
        setIsSaving(false);
        toast({ title: `${formName} Updated`, description: `Your ${formName.toLowerCase()} settings have been saved.` });
        if (formName === 'Password') {
            passwordForm.reset();
        }
    };

    const handleSystemAction = (action: string) => {
        toast({
            title: 'Action Triggered',
            description: `The "${action}" functionality is a placeholder and will be implemented in a future update.`,
        });
    };


  return (
    <div className="grid gap-6">
       <Card>
            <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Manage your super admin account and global platform configurations.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile"><User className="mr-2 h-4 w-4"/>Profile</TabsTrigger>
                        <TabsTrigger value="security"><KeyRound className="mr-2 h-4 w-4"/>Security</TabsTrigger>
                        <TabsTrigger value="system"><Server className="mr-2 h-4 w-4"/>System</TabsTrigger>
                        <TabsTrigger value="notifications"><Bell className="mr-2 h-4 w-4"/>Notifications</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="profile" className="mt-6">
                       <Form {...profileForm}>
                            <form onSubmit={profileForm.handleSubmit((data) => onSave('Profile', data))}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Super Admin Information</CardTitle>
                                        <CardDescription>Update your personal administrator details.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="flex items-center gap-6">
                                             <Avatar className="w-24 h-24">
                                                <AvatarImage src="https://picsum.photos/seed/super-admin/128/128" />
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
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                <FormLabel>Email Address</FormLabel>
                                                <FormControl><Input type="email" {...field} /></FormControl>
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
                    
                    <TabsContent value="system" className="mt-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>System Configuration</CardTitle>
                                <CardDescription>Manage global settings for the entire platform.</CardDescription>
                            </CardHeader>
                             <CardContent className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">API Keys & Integrations</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border rounded-md">
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-5 w-5"/>
                                                <div>
                                                    <p className="font-semibold">Email Service (SMTP)</p>
                                                    <p className="text-sm text-muted-foreground">Used for sending transactional emails.</p>
                                                </div>
                                            </div>
                                            <Button variant="secondary" onClick={() => handleSystemAction('SMTP Configuration')}>Configure</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                                 <Card>
                                     <CardHeader>
                                        <CardTitle className="text-lg">Application Logs</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="outline" onClick={() => handleSystemAction('View Application Logs')}>View Application Logs</Button>
                                         <p className="text-sm text-muted-foreground mt-2">Access detailed system logs for debugging and monitoring.</p>
                                    </CardContent>
                                </Card>
                             </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-6">
                       <Form {...notificationsForm}>
                           <form onSubmit={notificationsForm.handleSubmit((data) => onSave('Notification', data))}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notification Preferences</CardTitle>
                                        <CardDescription>Manage how you receive critical platform notifications.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <FormField
                                            control={notificationsForm.control}
                                            name="newRegistrations"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">New Institution Registrations</FormLabel>
                                                        <FormDescription>Get an alert when a new institution registers for approval.</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={notificationsForm.control}
                                            name="systemErrors"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-base">Critical System Errors</FormLabel>
                                                        <FormDescription>Receive alerts for major system failures or errors.</FormDescription>
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
                                                        <FormLabel className="text-base">Email Summaries</FormLabel>
                                                        <FormDescription>Receive daily or weekly email summaries of platform activity.</FormDescription>
                                                    </div>
                                                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter className="flex justify-end">
                                        <Button type="submit" disabled={isSaving}>
                                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                            Save Preferences
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

