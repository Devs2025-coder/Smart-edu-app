

"use client";

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
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Bot, Lightbulb, BookOpenCheck, ClipboardList } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const taskFormSchema = z.object({
  title: z.string().min(1, "Task title is required."),
  instructions: z.string().min(1, "Instructions are required."),
  subject: z.string().min(1, "Subject is required."),
  assignTo: z.enum(['class', 'group', 'individual']).default('class'),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

export default function TeacherTasksPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      instructions: "",
      assignTo: 'class',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Assigning Task:", data);
    setIsSubmitting(false);
    toast({
      title: "Task Assigned!",
      description: `The task "${data.title}" has been assigned successfully.`,
    });
    form.reset();
  };

  return (
    <div className="grid gap-6">
        <Tabs defaultValue="create-task">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create-task">Create Task</TabsTrigger>
                <TabsTrigger value="suggested-tasks"><Bot className="mr-2"/>Suggested Tasks</TabsTrigger>
            </TabsList>
            <TabsContent value="create-task">
                <Card className="mt-6">
                    <CardHeader>
                    <CardTitle>Assign a New Task</CardTitle>
                    <CardDescription>
                        Fill out the details below to assign a task to your students.
                    </CardDescription>
                    </CardHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Task Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Reading Comprehension" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="instructions"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Provide detailed instructions for the task..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="science">Science</SelectItem>
                                    <SelectItem value="mathematics">Mathematics</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="history">History</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="assignTo"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Assign To</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select who to assign to" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="class">Entire Class</SelectItem>
                                        <SelectItem value="group">Group of Students</SelectItem>
                                        <SelectItem value="individual">Individual Student</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name="dueDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Due Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date < new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
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
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Assign Task
                        </Button>
                        </CardFooter>
                    </form>
                    </Form>
                </Card>
            </TabsContent>
            <TabsContent value="suggested-tasks">
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center"><Lightbulb className="mr-2 text-primary" /> System-Suggested Activities</CardTitle>
                        <CardDescription>
                            AI-powered suggestions to engage students who finish early or need extra practice.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="rounded-full bg-primary/10 p-2">
                                <BookOpenCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Reading Activity: "The Water Cycle"</p>
                                <p className="text-sm text-muted-foreground">
                                15 min | For students interested in science.
                                </p>
                            </div>
                            <Button variant="secondary" size="sm" className="ml-auto">Assign</Button>
                            </li>
                            <li className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                            <div className="rounded-full bg-accent/20 p-2">
                                <ClipboardList className="h-5 w-5 text-accent-foreground" />
                            </div>
                            <div>
                                <p className="font-medium">Quiz: "Multiplication Challenge"</p>
                                <p className="text-sm text-muted-foreground">
                                10 min | Reinforce concepts from today's math class.
                                </p>
                            </div>
                            <Button variant="secondary" size="sm" className="ml-auto">Assign</Button>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
