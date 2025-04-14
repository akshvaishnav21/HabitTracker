import React from 'react';
import { format, addDays, startOfWeek, eachDayOfInterval, subMonths, isSameDay } from 'date-fns';
import { Habit, HabitHistory } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ContributionMatrixProps {
  habits: Habit[];
  title: string;
  showMonths?: boolean;
  frequency?: 'daily' | 'weekly' | 'custom';
}

const ContributionMatrix: React.FC<ContributionMatrixProps> = ({ 
  habits, 
  title,
  showMonths = true,
  frequency
}) => {
  const today = new Date();
  const startDate = subMonths(today, 11);
  const startOfWeekDate = startOfWeek(startDate);
  
  // Generate an array of dates for the past 12 months
  const dateInterval = eachDayOfInterval({ start: startOfWeekDate, end: today });
  
  // Group dates by month
  const datesByMonth: { [month: string]: Date[] } = {};
  dateInterval.forEach(date => {
    const monthKey = format(date, 'MMM');
    if (!datesByMonth[monthKey]) {
      datesByMonth[monthKey] = [];
    }
    datesByMonth[monthKey].push(date);
  });
  
  // Filter habits based on frequency if specified
  const filteredHabits = frequency 
    ? habits.filter(habit => 
        frequency === 'custom' 
          ? habit.frequency === 'custom'
          : habit.frequency === frequency
      )
    : habits;
  
  // Calculate completion status for each date
  const getCompletionStatus = (date: Date): number => {
    if (date > today) return 0; // Future date
    
    const dateStr = format(date, 'yyyy-MM-dd');
    let completedCount = 0;
    let totalCount = 0;
    
    filteredHabits.forEach(habit => {
      // For custom frequency, check if this day of week is selected
      if (habit.frequency === 'custom' && habit.selectedDays) {
        const dayOfWeek = format(date, 'EEE').toLowerCase();
        if (!habit.selectedDays.includes(dayOfWeek as any)) {
          return; // Skip this habit for this day
        }
      }
      
      // For weekly habits, only count it on the first day of the week
      if (habit.frequency === 'weekly' && format(date, 'E') !== '1') {
        return; // Skip weekly habits except on Monday
      }
      
      totalCount++;
      if (habit.history[dateStr]) {
        completedCount++;
      }
    });
    
    if (totalCount === 0) return 0;
    return Math.round((completedCount / totalCount) * 4); // 0-4 scale for intensity
  };
  
  // Get color class based on completion status (0-4)
  const getColorClass = (status: number): string => {
    switch (status) {
      case 0: return 'bg-gray-200 dark:bg-gray-800';
      case 1: return 'bg-green-100 dark:bg-green-900';
      case 2: return 'bg-green-300 dark:bg-green-700';
      case 3: return 'bg-green-500 dark:bg-green-500';
      case 4: return 'bg-green-700 dark:bg-green-300';
      default: return 'bg-gray-200 dark:bg-gray-800';
    }
  };
  
  // Format date for tooltip
  const formatDateForTooltip = (date: Date, status: number): string => {
    const dateStr = format(date, 'MMM d, yyyy');
    if (status === 0) return `No habits completed on ${dateStr}`;
    if (status === 4) return `All habits completed on ${dateStr}`;
    return `Partially completed on ${dateStr}`;
  };
  
  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-base font-medium text-gray-700 mb-2">{title}</h3>
      <div className="w-full overflow-x-auto pb-2">
        <div className="flex flex-col">
          {/* Month labels */}
          {showMonths && (
            <div className="flex text-xs text-gray-500 mb-1">
              {Object.keys(datesByMonth).map((month, idx) => (
                <div 
                  key={`month-${idx}`} 
                  className="flex-shrink-0" 
                  style={{ width: `${datesByMonth[month].length * 15}px` }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}
          
          {/* Contribution squares */}
          <div className="flex">
            {Object.entries(datesByMonth).map(([month, dates]) => (
              <div key={`grid-${month}`} className="flex-shrink-0 flex">
                {dates.map((date, idx) => {
                  const status = getCompletionStatus(date);
                  return (
                    <TooltipProvider key={`day-${format(date, 'yyyy-MM-dd')}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div 
                            className={`w-3 h-3 m-0.5 rounded-sm ${getColorClass(status)}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{formatDateForTooltip(date, status)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end mt-1 text-xs text-gray-500">
        <span className="mr-1">Less</span>
        <div className={`w-3 h-3 mx-0.5 rounded-sm ${getColorClass(0)}`} />
        <div className={`w-3 h-3 mx-0.5 rounded-sm ${getColorClass(1)}`} />
        <div className={`w-3 h-3 mx-0.5 rounded-sm ${getColorClass(2)}`} />
        <div className={`w-3 h-3 mx-0.5 rounded-sm ${getColorClass(3)}`} />
        <div className={`w-3 h-3 mx-0.5 rounded-sm ${getColorClass(4)}`} />
        <span className="ml-1">More</span>
      </div>
    </div>
  );
};

export default ContributionMatrix;