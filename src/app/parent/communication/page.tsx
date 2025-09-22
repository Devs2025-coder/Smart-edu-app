
'use client';

import { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Paperclip, Loader2, Megaphone, MessageSquare, Edit } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


const initialMessages = [
    { sender: 'teacher', text: "Hi Mr. Patel, just a reminder that Aarav's science project is due this Friday. He's made great progress in class!", timestamp: "10:30 AM" },
    { sender: 'parent', text: "Thank you for the update! We'll make sure he completes it on time.", timestamp: "10:32 AM" },
];

const announcements = [
    { id: 1, title: "Parent-Teacher Meeting Scheduled", content: "The quarterly Parent-Teacher meeting will be held on the 25th of this month. Please book your slots.", date: "2 days ago" },
    { id:2, title: "Annual Sports Day", content: "The Annual Sports Day will be on the 30th. All parents are welcome to cheer for our young athletes!", date: "5 days ago" },
];


export default function ParentCommunicationPage() {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const [feedbackCategory, setFeedbackCategory] = useState('');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const message = {
            sender: 'parent',
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, message]);
        setNewMessage('');
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            toast({
                title: 'File Attached',
                description: `${file.name} is ready to be sent.`,
            });
        }
    };
    
    const handleAttachClick = () => {
        fileInputRef.current?.click();
    };

    const handleSendFeedback = async () => {
      if (!feedbackCategory.trim() || !feedbackMessage.trim()) {
          toast({
              variant: 'destructive',
              title: 'Error',
              description: 'Please select a category and write a message.',
          });
          return;
      }
      setIsSending(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Sending feedback:", { category: feedbackCategory, message: feedbackMessage });
      setIsSending(false);
      setFeedbackCategory('');
      setFeedbackMessage('');
      toast({
          title: 'Feedback Sent!',
          description: 'Thank you for your feedback. We have received your message.',
      });
  };

  return (
    <div className="grid gap-6">
        <Tabs defaultValue="direct-message">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="direct-message"><MessageSquare className="mr-2 h-4 w-4"/>Direct Message</TabsTrigger>
                <TabsTrigger value="announcements"><Megaphone className="mr-2 h-4 w-4"/>Announcements</TabsTrigger>
                <TabsTrigger value="feedback"><Edit className="mr-2 h-4 w-4"/>Submit Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="direct-message">
                 <Card className="mt-6">
                    <div className="grid grid-cols-1 h-[calc(100vh-250px)]">
                       <div className="flex flex-col">
                            <div className="p-4 border-b flex items-center gap-3">
                                 <Avatar>
                                    <AvatarImage src="https://picsum.photos/seed/teacher/40/40" />
                                    <AvatarFallback>PS</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">Ms. Priya Sharma</p>
                                    <p className="text-sm text-muted-foreground">Class Teacher, Grade 6A</p>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-6 bg-muted/20">
                                <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex items-end gap-2 ${message.sender === 'parent' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${message.sender === 'parent' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                                            <p className="text-sm">{message.text}</p>
                                             <p className={`text-xs mt-1 ${message.sender === 'parent' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{message.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t">
                                <div className="relative">
                                    <Textarea 
                                        placeholder="Type a message to Ms. Priya Sharma..." 
                                        className="pr-24"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                     <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        onChange={handleFileSelect}
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <Button variant="ghost" size="icon" onClick={handleAttachClick}>
                                            <Paperclip className="h-5 w-5"/>
                                            <span className="sr-only">Attach file</span>
                                        </Button>
                                        <Button size="sm" onClick={handleSendMessage}>
                                            <Send className="h-4 w-4 mr-2"/> Send
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </TabsContent>

             <TabsContent value="announcements">
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>School & Teacher Announcements</CardTitle>
                        <CardDescription>Stay updated with the latest notices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {announcements.map(announcement => (
                           <Card key={announcement.id}>
                               <CardHeader>
                                   <CardTitle className="text-lg">{announcement.title}</CardTitle>
                                   <CardDescription>{announcement.date}</CardDescription>
                               </CardHeader>
                               <CardContent>
                                   <p className="text-muted-foreground">{announcement.content}</p>
                               </CardContent>
                           </Card>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
            
             <TabsContent value="feedback">
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Submit Feedback</CardTitle>
                        <CardDescription>Have a suggestion or concern? Let us know.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <label htmlFor="feedback-category" className="text-sm font-medium">Category</label>
                            <Select onValueChange={setFeedbackCategory} value={feedbackCategory}>
                                <SelectTrigger id="feedback-category" className="mt-1">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Inquiry</SelectItem>
                                    <SelectItem value="technical">Technical Issue</SelectItem>
                                    <SelectItem value="curriculum">Curriculum Feedback</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                             <label htmlFor="feedback-message" className="text-sm font-medium">Message</label>
                            <Textarea 
                              id="feedback-message" 
                              placeholder="Please describe your feedback in detail..." 
                              className="min-h-[200px] mt-1"
                              value={feedbackMessage}
                              onChange={(e) => setFeedbackMessage(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSendFeedback} disabled={isSending}>
                          {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isSending ? 'Sending...' : 'Submit Feedback'}
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
