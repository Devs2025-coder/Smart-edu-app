
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type FormData = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    // Simulate API call to send reset link
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Sending password reset link to:', data.email);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
            <CheckCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl pt-4">Reset Link Sent!</CardTitle>
          <CardDescription>
            If an account exists for {form.getValues('email')}, you will receive an email with instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Your Password?</CardTitle>
        <CardDescription>
          No problem. Enter your email address and we'll send you a link to reset it.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="e.g., user@example.com" className="pl-10" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
             <Button variant="outline" className="w-full" asChild>
                <Link href="/login">Back to Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
