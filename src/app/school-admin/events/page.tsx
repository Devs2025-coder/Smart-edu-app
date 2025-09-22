
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { EventDialog } from '@/components/school-admin/event-dialog';
import { useToast } from '@/hooks/use-toast';

const initialEvents = {
  '2024-10-25': [{ title: 'Parent-Teacher Meeting', type: 'meeting' }],
  '2024-10-30': [{ title: 'Annual Sports Day', type: 'event' }],
  '2024-11-14': [{ title: 'Diwali Holiday', type: 'holiday' }],
  '2024-11-15': [{ title: 'Diwali Holiday', type: 'holiday' }],
};

const getEventTypeBadge = (type) => {
  switch (type) {
    case 'meeting':
      return <Badge>Meeting</Badge>;
    case 'event':
      return <Badge variant="secondary">Event</Badge>;
    case 'holiday':
      return <Badge variant="outline">Holiday</Badge>;
    default:
      return <Badge variant="destructive">Exam</Badge>;
  }
};

export default function EventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveEvent = (eventData) => {
    const dateString = format(eventData.date, 'yyyy-MM-dd');
    setEvents(currentEvents => {
      const newEvents = { ...currentEvents };
      if (newEvents[dateString]) {
        newEvents[dateString].push({ title: eventData.title, type: eventData.type });
      } else {
        newEvents[dateString] = [{ title: eventData.title, type: eventData.type }];
      }
      return newEvents;
    });
    toast({
      title: 'Event Created',
      description: `The event "${eventData.title}" has been added to the calendar.`,
    });
  };

  const DayContent = ({ date }) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const dayEvents = events[dateString];

    return (
      <div className="relative h-full w-full">
        <span>{format(date, 'd')}</span>
        {dayEvents && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            {dayEvents.map((event, i) => (
              <div
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${
                  event.type === 'holiday' ? 'bg-green-500' : 
                  event.type === 'meeting' ? 'bg-primary' : 'bg-accent'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const selectedDayEvents = selectedDate ? events[format(selectedDate, 'yyyy-MM-dd')] : [];

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Events Calendar</CardTitle>
            <CardDescription>
              Manage school holidays, exams, and parent-teacher meetings.
            </CardDescription>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Event
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             <Card>
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="w-full p-0"
                        classNames={{
                            months: "w-full",
                            month: "w-full",
                            table: "w-full",
                            head_row: "grid grid-cols-7",
                            row: "grid grid-cols-7",
                            cell: "h-20 text-left p-1 align-top",
                        }}
                        components={{ DayContent }}
                    />
                </CardContent>
             </Card>
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Events for {selectedDate ? format(selectedDate, 'PPP') : ''}</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDayEvents && selectedDayEvents.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedDayEvents.map((event, i) => (
                      <li key={i} className="flex items-center justify-between">
                        <span className="text-sm">{event.title}</span>
                        {getEventTypeBadge(event.type)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No events scheduled for this day.</p>
                )}
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Event Types</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-primary" /> Meeting</div>
                    <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-accent" /> Event</div>
                    <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-green-500" /> Holiday</div>
                    <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded-full bg-destructive" /> Exam</div>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      <EventDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
}
