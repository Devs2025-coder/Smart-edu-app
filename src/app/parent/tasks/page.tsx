
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Lightbulb,
  Loader2,
  BookOpen,
  Search,
  BookOpenCheck,
} from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import {
  getPersonalizedTaskSuggestions,
  PersonalizedTaskSuggestionsOutput,
} from '@/ai/flows/personalized-task-suggestions';
import { useToast } from '@/hooks/use-toast';

const allTasks = [
  {
    id: 1,
    title: 'Science - Chapter 5 Quiz',
    subject: 'Science',
    professor: 'Mr. Jones',
    dueDate: '2024-10-25',
    status: 'Pending',
    description:
      'Complete the quiz on Chapter 5: "Ecosystems". The quiz consists of 20 multiple-choice questions.',
  },
  {
    id: 2,
    title: 'Math Homework: Algebra II',
    subject: 'Mathematics',
    professor: 'Ms. Davis',
    dueDate: '2024-10-22',
    status: 'Pending',
    description:
      'Solve the problems from section 3.4 in the textbook. Show all your work.',
  },
  {
    id: 3,
    title: 'History Essay: The Roman Empire',
    subject: 'History',
    professor: 'Mr. Smith',
    dueDate: '2024-10-18',
    status: 'Overdue',
    description:
      'Write a 500-word essay on the rise and fall of the Roman Empire.',
  },
  {
    id: 4,
    title: 'English Reading: "To Kill a Mockingbird"',
    subject: 'English',
    professor: 'Mrs. Williams',
    dueDate: '2024-10-15',
    status: 'Completed',
    description: 'Read chapters 1-5 and write a short summary.',
  },
  {
    id: 5,
    title: 'Art Project: Landscape Painting',
    subject: 'Art',
    professor: 'Ms. Taylor',
    dueDate: '2024-10-11',
    status: 'Completed',
    description:
      'Create a landscape painting using watercolors. Submit a photo of your work.',
  },
];

const aiSuggestionSchema = z.object({
  interests: z.string().min(1, 'Please tell us your child\'s interests.'),
  careerGoals: z.string().min(1, 'Please tell us your child\'s career goals.'),
  weaknesses: z
    .string()
    .min(1, 'Please tell us which subjects your child needs to improve on.'),
});

type AiSuggestionFormData = z.infer<typeof aiSuggestionSchema>;

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Overdue':
      return 'destructive';
    default:
      return 'outline';
  }
};

const TaskCard = ({ task }: { task: (typeof allTasks)[0] }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <Badge variant="outline" className="mb-2">
            {task.subject}
          </Badge>
          <CardTitle className="text-lg">{task.title}</CardTitle>
          <CardDescription>
            Due: {task.dueDate} | Prof. {task.professor}
          </CardDescription>
        </div>
        <Badge variant={getStatusBadgeVariant(task.status)}>
          {task.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">
        {task.description}
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        View Details
      </Button>
    </CardFooter>
  </Card>
);

export default function ParentTasksPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] =
    useState<PersonalizedTaskSuggestionsOutput | null>(null);

  const form = useForm<AiSuggestionFormData>({
    resolver: zodResolver(aiSuggestionSchema),
    defaultValues: {
      interests: '',
      careerGoals: '',
      weaknesses: '',
    },
  });

  const onAiSubmit = async (data: AiSuggestionFormData) => {
    setIsLoading(true);
    setAiSuggestions(null);
    try {
      const result = await getPersonalizedTaskSuggestions({
        studentProfile: `Interests: ${data.interests}. Career Goals: ${data.careerGoals}.`,
        curriculumProgress: `Weaknesses in: ${data.weaknesses}. Currently in semester 3 of computer science.`,
        recentActivities:
          'Has high attendance in Computer Science, average in Physics.',
      });
      setAiSuggestions(result);
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get AI suggestions. Please try again later.',
      });
    }
    setIsLoading(false);
  };

  const filteredTasks = allTasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending')
      return task.status === 'Pending' || task.status === 'Overdue';
    if (activeTab === 'completed') return task.status === 'Completed';
    return false;
  });

  return (
    <div className="grid gap-6">
      <Tabs defaultValue="assigned-tasks">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned-tasks">
            <BookOpen className="mr-2 h-4 w-4" />
            Assigned Tasks
          </TabsTrigger>
          <TabsTrigger value="ai-suggestions">
            <Bot className="mr-2 h-4 w-4" />
            AI-Powered Suggestions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="assigned-tasks">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Child's Tasks</CardTitle>
              <CardDescription>
                View all assigned tasks and their current status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Tasks</TabsTrigger>
                  <TabsTrigger value="pending">Pending & Overdue</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  ) : (
                    <p className="md:col-span-3 text-center text-muted-foreground py-10">
                      No tasks in this category.
                    </p>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai-suggestions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Personalize Suggestions</CardTitle>
                  <CardDescription>
                    Tell us about your child so we can suggest relevant tasks.
                  </CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onAiSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child's Interests</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Space, Dinosaurs, Art"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="careerGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Child's Career Goals</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Scientist, Astronaut"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="weaknesses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjects to Improve</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Mathematics, History"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Which subjects do they need help with?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Lightbulb className="mr-2 h-4 w-4" />
                        )}
                        Generate Tasks
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card className="min-h-full">
                <CardHeader>
                  <CardTitle>Personalized Tasks for Your Child</CardTitle>
                  <CardDescription>
                    Here are some tasks suggested by our AI to help them grow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading && (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  )}
                  {!isLoading && !aiSuggestions && (
                    <div className="text-center text-muted-foreground h-64 flex flex-col justify-center items-center">
                      <Bot className="h-16 w-16 mb-4" />
                      <p>AI-suggested tasks will appear here.</p>
                      <p className="text-sm">
                        Fill out the form to get started!
                      </p>
                    </div>
                  )}
                  {aiSuggestions && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center">
                          <Search className="mr-2 h-5 w-5 text-primary" />
                          Reasoning
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1">
                          {aiSuggestions.reasoning}
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <h3 className="font-semibold text-lg flex items-center">
                          <BookOpenCheck className="mr-2 h-5 w-5 text-primary" />
                          Suggestions
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">
                          {aiSuggestions.taskSuggestions}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    