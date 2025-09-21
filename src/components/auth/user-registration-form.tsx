"use client";

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '../ui/progress';
import { cn } from '@/lib/utils';

const PasswordStrength = ({ password }: { password?: string }) => {
  if (!password) return null;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="flex items-center gap-2 mt-1">
      <Progress value={(strength / 4) * 100} className={cn('h-2 w-full', strengthColors[strength - 1] || 'bg-muted')} />
      <span className="text-xs text-muted-foreground w-12 text-right">{strength > 0 ? strengthLabels[strength - 1] : ''}</span>
    </div>
  );
};

const formSchema = z
  .object({
    institutionCode: z.string().min(1, 'Institution code is required.'),
    fullName: z.string().min(1, 'Full name is required.'),
    email: z.string().email('Invalid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    confirmPassword: z.string(),
    department: z.string().optional(), // For Professor/Student
    childsName: z.string().optional(), // For Parent
    childsId: z.string().optional(), // For Parent
    mobileNumber: z.string().optional(),
    profilePhoto: z.any().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

interface UserRegistrationFormProps {
  role: string;
}

export function UserRegistrationForm({ role }: UserRegistrationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionCode: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      department: '',
      childsName: '',
      childsId: '',
      mobileNumber: '',
    },
  });

  const password = useWatch({ control: form.control, name: 'password' });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log({ ...data, role });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const getTitle = () => {
    switch (role) {
      case 'professor':
      case 'teacher':
        return 'Professor/Teacher Registration';
      case 'student':
        return 'Student Registration';
      case 'parent':
        return 'Parent Registration';
      default:
        return 'User Registration';
    }
  };
  
  const getDescription = () => {
     return "Create your account. Registration is subject to admin approval.";
  }

  if (isSubmitted) {
    return (
       <Card className="shadow-lg">
        <CardHeader className="text-center">
           <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl pt-4">Registration Submitted!</CardTitle>
          <CardDescription>
            Your registration is pending approval. You will receive an email once your account is activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{getTitle()}</CardTitle>
        <CardDescription>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="institutionCode"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Institution Code*</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the code provided by your institution" {...field} />
                      </FormControl>
                      <FormDescription>This code connects you to your school or college.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={role === 'parent' ? "md:col-span-2" : ""}>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., john.smith@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {(role === 'professor' || role === 'teacher' || role === 'student') && (
                  <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{role === 'student' ? 'Class / Grade*' : 'Department*'}</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Computer Science or Grade 10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === 'parent' && (
                  <>
                    <FormField
                      control={form.control}
                      name="childsName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child's Full Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your child's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="childsId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child's Student ID*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your child's student ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                 <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                       <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} placeholder="Create a secure password" {...field} />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                       <PasswordStrength password={password} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" {...field} />
                           <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="profilePhoto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => form.reset()}>Reset</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Register'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
