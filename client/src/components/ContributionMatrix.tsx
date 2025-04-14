import React, { useState } from 'react';
import { Habit } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, addDays, subMonths, getDay, getWeek, getYear, addWeeks } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContributionMatrixProps {
  habits: Habit[];
  title: string;
  frequency?: 'daily' | 'weekly' | 'custom';
}

const ContributionMatrix: React.FC<ContributionMatrixProps> = ({ 
  habits,
  title, 
  frequency = 'daily'
}) => {
  const [showAll, setShowAll] = useState(false);
  const maxHabitsInitially = 10;
  // Filter habits by frequency
  let filteredHabits = habits;
  if (frequency !== 'custom') {
    filteredHabits = habits.filter(habit => habit.frequency === frequency);
  } else {
    // For custom, include habits with custom frequency
    filteredHabits = habits.filter(habit => habit.frequency === 'custom');
  }
  
  if (filteredHabits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          No {frequency} habits to display
        </div>
      </div>
    );
  }
  
  // Calculate date range for the matrix
  const today = new Date();
  
  if (frequency === 'daily' || frequency === 'custom') {
    // For daily and custom habits, show last 30 days
    const daysToShow = 30;
    const startDate = addDays(today, -daysToShow + 1);
    const days: Date[] = [];
    
    // Generate array of dates
    for (let i = 0; i < daysToShow; i++) {
      days.push(addDays(startDate, i));
    }
    
    // Function to check if a habit should be completed on a specific date
    const shouldComplete = (habit: Habit, date: Date): boolean => {
      if (habit.frequency === 'daily') return true;
      
      if (habit.frequency === 'custom' && habit.selectedDays) {
        const dayOfWeek = format(date, 'EEE').toLowerCase();
        return habit.selectedDays.includes(dayOfWeek as any);
      }
      
      return false;
    };
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">{title}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[200px] px-2 py-1 text-left text-xs font-medium text-gray-500">Habit</th>
                {days.map((day, i) => (
                  <th key={i} className="px-1 py-1 text-center">
                    <div className="text-xs font-medium text-gray-500">
                      {format(day, 'dd')}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {format(day, 'MMM')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredHabits
                .slice(0, showAll ? undefined : maxHabitsInitially)
                .map((habit, habitIndex) => (
                  <tr key={habitIndex} className={habitIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-2 py-2 text-sm font-medium text-gray-700">
                      <div className="max-w-[180px] truncate" title={habit.title}>
                        {habit.title}
                      </div>
                    </td>
                    
                    {days.map((day, dayIndex) => {
                      const dateStr = format(day, 'yyyy-MM-dd');
                      const isCompleted = habit.history[dateStr];
                      const shouldShow = shouldComplete(habit, day);
                      
                      let bgColorClass = 'bg-gray-100'; // Default (not applicable)
                      
                      if (shouldShow) {
                        bgColorClass = isCompleted ? 'bg-emerald-500' : 'bg-gray-200';
                      }
                      
                      return (
                        <td key={dayIndex} className="px-1 py-1 text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="mx-auto">
                                  <div 
                                    className={cn(
                                      "w-5 h-5 rounded-sm mx-auto", 
                                      bgColorClass,
                                      // If it's today, add a ring
                                      format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && 
                                      "ring-2 ring-primary ring-offset-1"
                                    )}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>{format(day, 'MMM d, yyyy')}: {isCompleted ? 'Completed' : 'Not completed'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {filteredHabits.length > maxHabitsInitially && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAll(!showAll)}
              className="text-sm"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show All {filteredHabits.length} Habits
                </>
              )}
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-end mt-4 text-xs text-gray-500">
          <span className="mr-2">Not Applicable</span>
          <div className="w-3 h-3 rounded-sm bg-gray-100 mr-3"></div>
          
          <span className="mr-2">Not Completed</span>
          <div className="w-3 h-3 rounded-sm bg-gray-200 mr-3"></div>
          
          <span className="mr-2">Completed</span>
          <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
        </div>
      </div>
    );
  } else if (frequency === 'weekly') {
    // For weekly habits, show last 12 weeks
    const weeksToShow = 12;
    const currentWeekNumber = getWeek(today);
    const currentYear = getYear(today);
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">{title}</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="w-[200px] px-2 py-1 text-left text-xs font-medium text-gray-500">Habit</th>
                {Array.from({ length: weeksToShow }).map((_, i) => {
                  // Calculate the date range for this week (Monday - Sunday)
                  // Instead of going backwards, let's calculate weeks going forward
                  // We'll start with dates from weeksToShow-1 weeks ago and go forward
                  const weekOffset = i - (weeksToShow - 1);
                  const monday = addDays(today, -getDay(today) + 1 + (weekOffset * 7));
                  const sunday = addDays(monday, 6);
                  
                  // Get the year for display
                  const yearNum = getYear(monday);
                  
                  // Format: "16-22 Mar"
                  const dateRangeText = `${format(monday, 'd')}-${format(sunday, 'd')} ${format(monday, 'MMM')}`;
                  
                  return (
                    <th key={i} className="px-1 py-1 text-center">
                      <div className="text-xs font-medium text-gray-500">
                        {dateRangeText}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {yearNum}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {filteredHabits
                .slice(0, showAll ? undefined : maxHabitsInitially)
                .map((habit, habitIndex) => (
                  <tr key={habitIndex} className={habitIndex % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="px-2 py-2 text-sm font-medium text-gray-700">
                      <div className="max-w-[180px] truncate" title={habit.title}>
                        {habit.title}
                      </div>
                    </td>
                    
                    {Array.from({ length: weeksToShow }).map((_, i) => {
                      // Get date for the Monday of this week
                      const weekOffset = i - (weeksToShow - 1);
                      const monday = addDays(today, -getDay(today) + 1 + (weekOffset * 7));
                      
                      // Check for completions throughout the week rather than just Monday
                      let isCompleted = false;
                      
                      // Check each day of the week for this habit
                      for (let day = 0; day < 7; day++) {
                        const dayDate = addDays(monday, day);
                        const dayDateStr = format(dayDate, 'yyyy-MM-dd');
                        if (habit.history[dayDateStr]) {
                          isCompleted = true;
                          break;
                        }
                      }
                      
                      let bgColorClass = isCompleted ? 'bg-emerald-500' : 'bg-gray-200';
                      
                      return (
                        <td key={i} className="px-1 py-1 text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="mx-auto">
                                  <div 
                                    className={cn(
                                      "w-5 h-5 rounded-sm mx-auto", 
                                      bgColorClass
                                    )}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top">
                                <p>Week of {format(monday, 'MMM d, yyyy')}: {isCompleted ? 'Completed' : 'Not completed'}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        
        {filteredHabits.length > maxHabitsInitially && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAll(!showAll)}
              className="text-sm"
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show All {filteredHabits.length} Habits
                </>
              )}
            </Button>
          </div>
        )}
        
        <div className="flex items-center justify-end mt-4 text-xs text-gray-500">
          <span className="mr-2">Not Completed</span>
          <div className="w-3 h-3 rounded-sm bg-gray-200 mr-3"></div>
          
          <span className="mr-2">Completed</span>
          <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default ContributionMatrix;