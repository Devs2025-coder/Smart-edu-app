
'use client';

import { useForm } from 'react-hook-form';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const announcementSchema = z.object({
  target: z.string().min(1, 'Please select a target audience.'),
  grade: z.string().optional(),
  section: z.string().optional(),
  subject: z.string().min(1, 'Subject is required.'),
  message: z.string().min(1, 'Message is required.'),
  attachment: z.any().optional(),
});

type AnnouncementFormData = z.infer<typeof announcementSchema>;

export default function AnnouncementsPage() {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      target: 'everyone',
      subject: '',
      message: '',
    },
  });

  const watchTarget = form.watch('target');

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Sending announcement:', data);
    setIsSending(false);
    toast({
      title: 'Announcement Sent!',
      description: `Your message "${data.subject}" has been successfully broadcast.`,
    });
    form.reset({
      target: 'everyone',
      subject: '',
      message: '',
      grade: '',
      section: '',
      attachment: null,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
          <CardDescription>
            Broadcast messages to teachers, parents, or specific classes.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="target"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Send To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="everyone">Everyone</SelectItem>
                          <SelectItem value="teachers">All Teachers</SelectItem>
                          <SelectItem value="parents">All Parents</SelectItem>
                          <SelectItem value="specific_class">Specific Class</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchTarget === 'specific_class' && (
                  <>
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[...Array(12)].map((_, i) => (
                                <SelectItem key={i + 1} value={`grade-${i + 1}`}>
                                  Grade {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="All Sections" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="all_sections">All Sections</SelectItem>
                                <SelectItem value="a">Section A</SelectItem>
                                <SelectItem value="b">Section B</SelectItem>
                                <SelectItem value="c">Section C</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                </div>
                 <div className="space-y-6">
                 <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Important: Holiday Schedule Update" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Compose your announcement here..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="attachment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachment (Optional)</FormLabel>
                      <FormControl>
                         <div className="relative">
                            <Input
                            type="file"
                            className="pr-16"
                            onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                            />
                             <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                <Paperclip className="h-5 w-5 text-muted-foreground"/>
                            </div>
                        </div>
                      </FormControl>
                      <FormDescription>You can attach a PDF, image, or document.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSending}>
                {isSending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                {isSending ? 'Sending...' : 'Send Announcement'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
