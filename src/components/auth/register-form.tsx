"use client";

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const formSchema = z
  .object({
    // Institution Details
    institutionName: z.string().min(1, 'Institution name is required.'),
    institutionType: z.enum(['College', 'School']),
    address: z.string().min(1, 'Address is required.'),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    contactNumber: z.string().optional(),
    logo: z.any().optional(),

    // Admin Details
    adminFullName: z.string().min(1, 'Admin name is required.'),
    email: z.string().email('Invalid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    confirmPassword: z.string(),
    mobileNumber: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof formSchema>;

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

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      institutionName: '',
      institutionType: undefined,
      address: '',
      city: '',
      state: '',
      zip: '',
      contactNumber: '',
      adminFullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      mobileNumber: '',
    },
  });
  
  const password = useWatch({ control: form.control, name: 'password' });


  const nextStep = async () => {
    const fieldsToValidate = ['institutionName', 'institutionType', 'address'];
    const isValid = await form.trigger(fieldsToValidate as (keyof FormData)[]);
    if (isValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
  };
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(data);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const onReset = () => {
    form.reset();
    setStep(1);
  };
  
  if (isSubmitted) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl pt-4">Registration Submitted!</CardTitle>
          <CardDescription>
            Thank you for registering! Your institution is pending approval. You will receive an email once approved by the Super Admin.
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
        <Progress value={(step / 2) * 100} className="mb-4 h-2" />
        <CardTitle className="text-2xl">
          {step === 1 ? 'Institution Details' : 'Admin Details'}
        </CardTitle>
        <CardDescription>
          {step === 1 ? 'Provide information about your institution.' : 'Create your administrator account.'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset} className="space-y-8">
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Institution Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Northwood High School" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="institutionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select institution type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="College">College</SelectItem>
                          <SelectItem value="School">School</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +1 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Full Postal Address*</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter the full address of your institution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Springfield" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Illinois" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP / Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 62704" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Institution Logo</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="adminFullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password*</FormLabel>
                       <FormControl>
                        <div className="relative">
                          <Input type={showPassword ? 'text' : 'password'} placeholder="Enter a secure password" {...field} />
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
                    <FormItem className="md:col-span-2">
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., +1 123 456 7890 (for OTP verification)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <>
                <Button type="reset" variant="outline">Reset</Button>
                <Button type="button" onClick={nextStep}>Next</Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                <div className="flex items-center gap-4">
                  <Button type="reset" variant="outline">Reset</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Registering...' : 'Submit'}
                  </Button>
                </div>
              </>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
