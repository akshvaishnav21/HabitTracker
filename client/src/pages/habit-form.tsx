import React, { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Habit, HabitFormData, DayOfWeek } from '@/lib/types';
import { getHabit, createHabit, updateHabit } from '@/lib/habitStore';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "custom"]),
  frequencyCount: z.number().min(1).max(99).optional(),
  frequencyPeriod: z.enum(["weekly", "monthly"]).optional(),
  selectedDays: z.array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"])).optional(),
  reminderEnabled: z.boolean().default(false),
  reminderTime: z.string().optional()
});

const HabitForm: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute('/habits/:id/edit');
  const [isEditing, setIsEditing] = useState(false);
  const [habitId, setHabitId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<HabitFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "daily",
      frequencyCount: 1,
      frequencyPeriod: "weekly",
      selectedDays: ["mon", "tue", "wed", "thu", "fri"],
      reminderEnabled: false,
      reminderTime: "08:00"
    }
  });
  
  // Load habit data if editing
  useEffect(() => {
    if (params && params.id) {
      const habit = getHabit(params.id);
      if (habit) {
        setIsEditing(true);
        setHabitId(params.id);
        
        form.reset({
          title: habit.title,
          description: habit.description,
          frequency: habit.frequency,
          frequencyCount: habit.frequencyCount,
          frequencyPeriod: habit.frequencyPeriod,
          selectedDays: habit.selectedDays || ["mon", "tue", "wed", "thu", "fri"],
          reminderEnabled: habit.reminderEnabled,
          reminderTime: habit.reminderTime
        });
      } else {
        // Habit not found, redirect to dashboard
        setLocation('/');
      }
    }
  }, [params, form, setLocation]);
  
  // Watch frequency to show/hide custom frequency inputs
  const watchFrequency = form.watch("frequency");
  const watchReminderEnabled = form.watch("reminderEnabled");
  
  const onSubmit = (data: HabitFormData) => {
    try {
      if (isEditing && habitId) {
        updateHabit(habitId, data);
        toast({
          title: "Success",
          description: "Habit updated successfully",
        });
      } else {
        createHabit(data);
        toast({
          title: "Success",
          description: "Habit created successfully",
        });
      }
      setLocation('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save habit",
        variant: "destructive",
      });
    }
  };

  return (
    <div id="habit-form-view">
      <div className="flex items-center mb-4">
        <Link href="/">
          <div className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </div>
        </Link>
        <h2 className="text-lg font-semibold text-gray-800 ml-1">
          {isEditing ? "Edit Habit" : "Add New Habit"}
        </h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {isEditing && (
              <input type="hidden" id="habit-id" value={habitId || ''} />
            )}
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Habit Name*
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Drink Water" 
                      {...field} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Description (Optional)
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="e.g., Drink 8 cups of water throughout the day" 
                      {...field} 
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">Frequency</FormLabel>
                  <div className="grid grid-cols-3 gap-3">
                    <RadioGroup 
                      {...field} 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-3"
                    >
                      <div className="relative flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem id="daily" value="daily" className="sr-only" />
                        <Label htmlFor="daily" className="text-sm">Daily</Label>
                        {field.value === "daily" && (
                          <span className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-2 ring-primary"></span>
                        )}
                      </div>
                      
                      <div className="relative flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem id="weekly" value="weekly" className="sr-only" />
                        <Label htmlFor="weekly" className="text-sm">Weekly</Label>
                        {field.value === "weekly" && (
                          <span className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-2 ring-primary"></span>
                        )}
                      </div>
                      
                      <div className="relative flex items-center justify-center p-3 border border-gray-300 rounded-md shadow-sm bg-white cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem id="custom" value="custom" className="sr-only" />
                        <Label htmlFor="custom" className="text-sm">Custom</Label>
                        {field.value === "custom" && (
                          <span className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-2 ring-primary"></span>
                        )}
                      </div>
                    </RadioGroup>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchFrequency === "custom" && (
              <div id="custom-frequency" className="space-y-4">
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Custom Frequency</FormLabel>
                <div className="flex items-center">
                  <FormField
                    control={form.control}
                    name="frequencyCount"
                    render={({ field }) => (
                      <FormItem className="w-16 mr-2">
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            max={99} 
                            {...field}
                            value={field.value?.toString()}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-16 px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <span className="mr-2 text-gray-600">times</span>
                  
                  <FormField
                    control={form.control}
                    name="frequencyPeriod"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weekly">per week</SelectItem>
                            <SelectItem value="monthly">per month</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-2">
                    Select Days
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="selectedDays"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-7 gap-2">
                          {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => {
                            const isSelected = field.value?.includes(day as DayOfWeek);
                            return (
                              <div 
                                key={day}
                                className={`flex flex-col items-center justify-center py-2 px-1 rounded-md cursor-pointer border ${
                                  isSelected 
                                    ? 'border-primary bg-primary/10 text-primary' 
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                onClick={() => {
                                  const currentValue = field.value || [];
                                  if (isSelected) {
                                    // Remove day
                                    field.onChange(currentValue.filter(d => d !== day));
                                  } else {
                                    // Add day
                                    field.onChange([...currentValue, day as DayOfWeek]);
                                  }
                                }}
                              >
                                <span className="text-xs font-semibold uppercase">{day.substring(0, 1)}</span>
                                <span className="text-xs mt-1 capitalize">{day}</span>
                              </div>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    Select the days when you want to perform this habit.
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">Reminder (Optional)</FormLabel>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="reminderEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                          id="enable-reminder"
                        />
                      </FormControl>
                      <Label htmlFor="enable-reminder" className="text-sm text-gray-600">
                        Enable reminder
                      </Label>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminderTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          disabled={!watchReminderEnabled}
                          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Reminders use browser notifications and only work when your browser is open.</p>
            </div>
            
            <div className="pt-3">
              <Button type="submit" className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                    clipRule="evenodd" 
                  />
                </svg>
                {isEditing ? "Save Changes" : "Save Habit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default HabitForm;
