import React from 'react';
import { Habit } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, addDays, subMonths, getDay } from 'date-fns';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ContributionMatrixProps {
  habits: Habit[];
  title: string;
  showMonths?: boolean;
  frequency?: 'daily' | 'weekly' | 'custom';
}

const ContributionMatrix: React.FC<ContributionMatrixProps> = ({ 
  habits,
  title, 
  showMonths = false,
  frequency = 'daily'
}) => {
  // Filter habits by frequency
  const filteredHabits = habits.filter(habit => habit.frequency === frequency);
  
  if (filteredHabits.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-md font-semibold text-gray-700 mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          No {frequency} habits to display
        </div>
      </div>
    );
  }
  
  // Calculate date range for the matrix (last 3 months)
  const today = new Date();
  const monthsAgo = subMonths(today, 3);
  const startDate = startOfMonth(monthsAgo);
  const endDate = endOfMonth(today);
  
  // Generate weeks for the matrix
  const weeks = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
  
  // Generate days of the week labels
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Function to calculate cell color based on completion status
  const getCompletionStatus = (date: Date): number => {
    // Count how many of the filtered habits were completed on this date
    const dateStr = format(date, 'yyyy-MM-dd');
    let completedCount = 0;
    let totalCount = 0;
    
    // For each habit, check if it was completed on this date
    for (const habit of filteredHabits) {
      // For 'daily' frequency, check every day
      if (habit.frequency === 'daily') {
        totalCount++;
        if (habit.history[dateStr]) {
          completedCount++;
        }
      } 
      // For 'weekly' frequency, only check Mondays
      else if (habit.frequency === 'weekly' && getDay(date) === 1) {
        totalCount++;
        if (habit.history[dateStr]) {
          completedCount++;
        }
      }
      // For 'custom' frequency, check if the date matches one of the selected days
      else if (habit.frequency === 'custom' && habit.selectedDays) {
        const dayOfWeek = format(date, 'EEE').toLowerCase();
        if (habit.selectedDays.includes(dayOfWeek as any)) {
          totalCount++;
          if (habit.history[dateStr]) {
            completedCount++;
          }
        }
      }
    }
    
    // Calculate percentage of completion
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 100);
  };
  
  // Format date for tooltip display
  const formatDateForTooltip = (date: Date, status: number): string => {
    const dateStr = format(date, 'MMM d, yyyy');
    if (status === 0) return `${dateStr}: No habits completed`;
    if (status === 100) return `${dateStr}: All habits completed`;
    return `${dateStr}: ${status}% completed`;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-md font-semibold text-gray-700 mb-4">{title}</h3>
      
      <div className="overflow-x-auto">
        <div className="flex">
          {/* Day of week labels */}
          <div className="flex flex-col mr-2">
            <div className="h-5"></div> {/* Empty space for alignment */}
            {daysOfWeek.map((day, i) => (
              <div key={i} className="h-5 text-xs text-gray-500 pr-1 py-0.5">{day}</div>
            ))}
          </div>
          
          {/* Contribution cells */}
          <div className="flex">
            {weeks.map((week, weekIndex) => {
              const days = eachDayOfInterval({
                start: week,
                end: addDays(week, 6)
              });
              
              return (
                <div key={weekIndex} className="flex flex-col mr-1">
                  {/* Month label */}
                  {showMonths && weekIndex % 4 === 0 && (
                    <div className="h-5 text-xs text-gray-500 text-center mb-1">
                      {format(week, 'MMM')}
                    </div>
                  )}
                  
                  {/* Days */}
                  {days.map((day, dayIndex) => {
                    const completionStatus = getCompletionStatus(day);
                    let bgColorClass = 'bg-gray-100'; // Default (no data)
                    
                    if (completionStatus > 0) {
                      if (completionStatus < 25) bgColorClass = 'bg-emerald-100';
                      else if (completionStatus < 50) bgColorClass = 'bg-emerald-200';
                      else if (completionStatus < 75) bgColorClass = 'bg-emerald-300';
                      else if (completionStatus < 100) bgColorClass = 'bg-emerald-400';
                      else bgColorClass = 'bg-emerald-500';
                    }
                    
                    return (
                      <TooltipProvider key={dayIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "w-5 h-5 rounded-sm my-0.5", 
                                bgColorClass,
                                // If it's today, add a ring
                                format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd') && 
                                "ring-2 ring-primary ring-offset-1"
                              )}
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>{formatDateForTooltip(day, completionStatus)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end mt-4 text-xs text-gray-500">
        <span className="mr-1">Less</span>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-sm bg-gray-100 mr-0.5"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-100 mr-0.5"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-200 mr-0.5"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-300 mr-0.5"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-400 mr-0.5"></div>
          <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
        </div>
        <span className="ml-1">More</span>
      </div>
    </div>
  );
};

export default ContributionMatrix;