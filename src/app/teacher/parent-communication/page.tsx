
'use client';

import { useState } from 'react';
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
import { Search, Send, Paperclip } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const parents = [
  { id: 1, name: 'Mr. & Mrs. Sharma', child: 'Aarav', avatar: 'AS', lastMessage: "Thank you for the update!", online: true },
  { id: 2, name: 'Ms. Gupta', child: 'Saanvi', avatar: 'SG', lastMessage: "Okay, I'll check on it.", online: false },
  { id: 3, name: 'Mr. Singh', child: 'Vihaan', avatar: 'VS', lastMessage: "He's feeling much better...", online: true },
  { id: 4, name: 'Mrs. Reddy', child: 'Myra', avatar: 'MR', lastMessage: "Sounds great!", online: false },
  { id: 5, name: 'Mr. Patel', child: 'Advik', avatar: 'AP', lastMessage: "Can we schedule a meeting?", online: false },
];

const messages = [
    { sender: 'teacher', text: "Hi Mr. & Mrs. Sharma, just a reminder that Aarav's science project is due this Friday. He's made great progress in class!", timestamp: "10:30 AM" },
    { sender: 'parent', text: "Thank you for the update! We'll make sure he completes it on time.", timestamp: "10:32 AM" },
];


export default function TeacherParentCommunicationPage() {
    const [selectedParent, setSelectedParent] = useState(parents[0]);

  return (
    <div className="grid gap-6">
        <Tabs defaultValue="direct-message">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="direct-message">Direct Message</TabsTrigger>
                <TabsTrigger value="announcements">Broadcast Announcements</TabsTrigger>
            </TabsList>
            <TabsContent value="direct-message">
                 <Card className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-200px)]">
                        {/* Parent List */}
                        <div className="md:col-span-1 lg:col-span-1 border-r flex flex-col">
                            <div className="p-4">
                                <h2 className="text-lg font-semibold">Parents</h2>
                                <div className="relative mt-2">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search parents..." className="pl-8" />
                                </div>
                            </div>
                            <Separator />
                            <ScrollArea className="flex-1">
                                <div className="p-2">
                                {parents.map((parent) => (
                                    <div
                                        key={parent.id}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${selectedParent.id === parent.id ? 'bg-primary/10' : 'hover:bg-muted/50'}`}
                                        onClick={() => setSelectedParent(parent)}
                                    >
                                        <Avatar className="relative">
                                            <AvatarImage src={`https://picsum.photos/seed/${parent.child}/40/40`} />
                                            <AvatarFallback>{parent.avatar}</AvatarFallback>
                                            {parent.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
                                        </Avatar>
                                        <div className="flex-1 truncate">
                                            <p className="font-semibold text-sm">{parent.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">Child: {parent.child}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Chat Area */}
                        <div className="md:col-span-2 lg:col-span-3 flex flex-col">
                            <div className="p-4 border-b flex items-center gap-3">
                                 <Avatar>
                                    <AvatarImage src={`https://picsum.photos/seed/${selectedParent.child}/40/40`} />
                                    <AvatarFallback>{selectedParent.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selectedParent.name}</p>
                                    <p className="text-sm text-muted-foreground">Parent of {selectedParent.child}</p>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-6 bg-muted/20">
                                <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex items-end gap-2 ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${message.sender === 'teacher' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                                            <p className="text-sm">{message.text}</p>
                                             <p className={`text-xs mt-1 ${message.sender === 'teacher' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{message.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>

                            <div className="p-4 border-t">
                                <div className="relative">
                                    <Textarea placeholder="Type a message..." className="pr-24"/>
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <Button variant="ghost" size="icon">
                                            <Paperclip className="h-5 w-5"/>
                                            <span className="sr-only">Attach file</span>
                                        </Button>
                                        <Button size="sm">
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
                        <CardTitle>Broadcast an Announcement</CardTitle>
                        <CardDescription>Send a message to all parents in the selected class.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <label htmlFor="announcement-subject" className="text-sm font-medium">Subject</label>
                            <Input id="announcement-subject" placeholder="e.g., Upcoming Field Trip" className="mt-1" />
                        </div>
                        <div>
                             <label htmlFor="announcement-message" className="text-sm font-medium">Message</label>
                            <Textarea id="announcement-message" placeholder="Compose your announcement..." className="min-h-[200px] mt-1"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button>Send to All Parents</Button>
                    </CardFooter>
                </Card>
            </TabsContent>
        </Tabs>
    </div>
  );
}
