
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Book,
  Bot,
  Filter,
  Lightbulb,
  Loader2,
  Search,
  BookOpenCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getPersonalizedTaskSuggestions, PersonalizedTaskSuggestionsOutput } from '@/ai/flows/personalized-task-suggestions';
import { useToast } from '@/hooks/use-toast';

const assignedTasks = [
  {
    id: 1,
    title: 'Quantum Mechanics Worksheet',
    subject: 'Physics',
    professor: 'Dr. Alan Grant',
    dueDate: '2024-10-15',
    status: 'Pending',
    branch: 'cse',
    semester: '3',
    section: 'a',
  },
  {
    id: 2,
    title: 'Calculus Problem Set',
    subject: 'Mathematics',
    professor: 'Dr. Ian Malcolm',
    dueDate: '2024-10-12',
    status: 'Submitted',
    branch: 'cse',
    semester: '3',
    section: 'a',
  },
  {
    id: 3,
    title: 'Data Structures Lab',
    subject: 'Computer Science',
    professor: 'Dr. Ellie Sattler',
    dueDate: '2024-10-20',
    status: 'Pending',
    branch: 'cse',
    semester: '3',
    section: 'b',
  },
];

const aiSuggestionSchema = z.object({
  interests: z.string().min(1, 'Please tell us your interests.'),
  careerGoals: z.string().min(1, 'Please tell us your career goals.'),
  weaknesses: z
    .string()
    .min(1, 'Please tell us which subjects you want to improve on.'),
});

type AiSuggestionFormData = z.infer<typeof aiSuggestionSchema>;

const TaskCard = ({ task }: { task: (typeof assignedTasks)[0] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">{task.title}</CardTitle>
      <CardDescription>
        Due: {task.dueDate} | Prof. {task.professor}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <div>
          <Badge variant="secondary">{task.subject}</Badge>
        </div>
        <Badge variant={task.status === 'Pending' ? 'destructive' : 'default'}>
          {task.status}
        </Badge>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full">View Details</Button>
    </CardFooter>
  </Card>
);

export default function StudentTasksPage() {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    department: 'all',
    semester: 'all',
    section: 'all',
  });
  
  const [filteredTasks, setFilteredTasks] = useState(assignedTasks);

  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<PersonalizedTaskSuggestionsOutput | null>(null);

  const form = useForm<AiSuggestionFormData>({
    resolver: zodResolver(aiSuggestionSchema),
    defaultValues: {
        interests: "",
        careerGoals: "",
        weaknesses: "",
    }
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    const newFilteredTasks = assignedTasks.filter(task => {
      return (
        (filters.department === 'all' || task.branch === filters.department) &&
        (filters.semester === 'all' || task.semester === filters.semester) &&
        (filters.section === 'all' || task.section === filters.section)
      );
    });
    setFilteredTasks(newFilteredTasks);
  };
  
  const onAiSubmit = async (data: AiSuggestionFormData) => {
    setIsLoading(true);
    setAiSuggestions(null);
    try {
      const result = await getPersonalizedTaskSuggestions({
        studentProfile: `Interests: ${data.interests}. Career Goals: ${data.careerGoals}.`,
        curriculumProgress: `Weaknesses in: ${data.weaknesses}. Currently in semester 3 of computer science.`,
        recentActivities: "Has high attendance in Computer Science, average in Physics."
      });
      setAiSuggestions(result);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI suggestions. Please try again later.",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold font-headline mb-2">My Tasks</h1>
      <p className="text-lg text-muted-foreground mb-6">
        View your assigned tasks and personalized suggestions.
      </p>

      <Tabs defaultValue="assigned">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assigned">
            <Book className="mr-2" /> Assigned by Professor
          </TabsTrigger>
          <TabsTrigger value="suggestions">
            <Bot className="mr-2" /> AI-Powered Suggestions
          </TabsTrigger>
        </TabsList>

        {/* Assigned Tasks Tab */}
        <TabsContent value="assigned">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Filter Tasks</CardTitle>
              <CardDescription>
                Narrow down tasks by department, semester, or section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select onValueChange={(value) => handleFilterChange('department', value)} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="cse">Computer Science & Eng.</SelectItem>
                    <SelectItem value="ece">Electronics & Comm. Eng.</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => handleFilterChange('semester', value)} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    <SelectItem value="3">Semester 3</SelectItem>
                    <SelectItem value="4">Semester 4</SelectItem>
                  </SelectContent>
                </Select>
                <Select onValueChange={(value) => handleFilterChange('section', value)} defaultValue="all">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    <SelectItem value="a">Section A</SelectItem>
                    <SelectItem value="b">Section B</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleApplyFilters}>
                  <Filter className="mr-2 h-4 w-4" /> Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <p className="md:col-span-3 text-center text-muted-foreground">
                No tasks match the current filters.
              </p>
            )}
          </div>
        </TabsContent>

        {/* AI Suggestions Tab */}
        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Personalize Your Suggestions</CardTitle>
                  <CardDescription>
                    Tell us about yourself so we can suggest relevant tasks.
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
                            <FormLabel>Your Interests</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., AI, Machine Learning, Web Dev"
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
                            <FormLabel>Your Career Goals</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Become a Software Engineer"
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
                                placeholder="e.g., Advanced Algorithms, Physics"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Which subjects do you want to get better at?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Lightbulb className="mr-2 h-4 w-4" />
                        )}
                        Generate My Tasks
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="min-h-full">
                <CardHeader>
                  <CardTitle>Your Personalized Tasks</CardTitle>
                  <CardDescription>
                    Here are some tasks suggested by our AI to help you grow.
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
                      <p>Your AI-suggested tasks will appear here.</p>
                      <p className="text-sm">Fill out the form to get started!</p>
                    </div>
                  )}
                  
                  {aiSuggestions && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center"><Search className="mr-2 h-5 w-5 text-primary"/>Reasoning</h3>
                        <p className="text-muted-foreground text-sm mt-1">{aiSuggestions.reasoning}</p>
                      </div>
                      <Separator />
                       <div>
                        <h3 className="font-semibold text-lg flex items-center"><BookOpenCheck className="mr-2 h-5 w-5 text-primary"/>Suggestions</h3>
                        <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">{aiSuggestions.taskSuggestions}</p>
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
