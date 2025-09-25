
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect } from 'react';
import { Input } from '../ui/input';

const formSchema = z.object({
  value: z.string().min(1, 'Please select a value.'),
});

type FormData = z.infer<typeof formSchema>;

const professors = [
    'Dr. Evelyn Reed',
    'Dr. Samuel Grant',
    'Dr. Clara Oswald',
    'Dr. Aris Thorne',
];

export function AssignDialog({ isOpen, onOpenChange, onSave, type, classId, className, currentProfessor }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: '',
    },
  });

  useEffect(() => {
    if (type === 'Professor') {
        form.reset({ value: currentProfessor !== 'Unassigned' ? currentProfessor : '' });
    } else {
        form.reset({ value: '' });
    }
  }, [isOpen, type, currentProfessor, form]);

  const handleSubmit = (data: FormData) => {
    onSave({type, classId, value: data.value});
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign {type}</DialogTitle>
          <DialogDescription>
            Assign {type.toLowerCase()} to class: {className}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            {type === 'Professor' ? (
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Select Professor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a professor to assign" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {professors.map(prof => (
                                    <SelectItem key={prof} value={prof}>{prof}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            ) : (
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Select Students</FormLabel>
                            <FormControl>
                                <Input type="file" accept=".csv" />
                            </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">Assign</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
