
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required.'),
  prof: z.string().min(1, 'Professor is required.'),
  room: z.string().min(1, 'Room/Lab is required.'),
  day: z.string().min(1, 'Day is required.'),
  time: z.string().min(1, 'Time slot is required.').regex(/^\d{2}:\d{2} - \d{2}:\d{2}$/, 'Time must be in HH:mm - HH:mm format.'),
});

type FormData = z.infer<typeof formSchema>;

const daysOfWeek = [
  { value: 'M', label: 'Monday' },
  { value: 'T', label: 'Tuesday' },
  { value: 'W', label: 'Wednesday' },
  { value: 'Th', label: 'Thursday' },
  { value: 'F', label: 'Friday' },
];

export function ClassScheduleDialog({ isOpen, onOpenChange, onSave, periodData }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      prof: '',
      room: '',
      day: '',
      time: '',
    },
  });

  useEffect(() => {
    if (periodData) {
      form.reset(periodData);
    } else {
      form.reset({
        subject: '',
        prof: '',
        room: '',
        day: '',
        time: '',
      });
    }
  }, [periodData, form]);

  const handleSubmit = (data: FormData) => {
    onSave(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{periodData?.subject ? 'Edit' : 'Add'} Class Period</DialogTitle>
          <DialogDescription>
            {periodData?.subject ? 'Update the details for this class period.' : 'Fill in the details to add a new class period to the timetable.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Data Structures" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prof"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Dr. Reed" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room / Lab</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., A-101" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="day"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Day</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {daysOfWeek.map(day => (
                            <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 09:00 - 10:00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Save Period</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
