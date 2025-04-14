import React, { useState, useEffect } from 'react';
import { useRoute, Link, useLocation } from 'wouter';
import { ArrowLeft, Edit3, Trash } from 'lucide-react';
import { getHabit, deleteHabit } from '@/lib/habitStore';
import { calculateHabitStats, generateCalendarDays, formatShortDate } from '@/lib/utils';
import { Habit } from '@/lib/types';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useToast } from '@/hooks/use-toast';

const HabitDetails: React.FC = () => {
  const [_, setLocation] = useLocation();
  const [match, params] = useRoute('/habits/:id');
  const [habit, setHabit] = useState<Habit | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (params && params.id) {
      const habitData = getHabit(params.id);
      if (habitData) {
        setHabit(habitData);
      } else {
        // Habit not found, redirect to dashboard
        setLocation('/');
      }
    }
  }, [params, setLocation]);
  
  if (!habit) {
    return <div className="p-4 text-center">Loading...</div>;
  }
  
  const stats = calculateHabitStats(habit);
  const currentMonth = new Date();
  const calendarDays = generateCalendarDays(currentMonth, habit.history);
  
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (habit) {
      deleteHabit(habit.id);
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
      setLocation('/');
    }
    setShowDeleteDialog(false);
  };
  
  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };
  
  const frequencyText = habit.frequency === 'custom'
    ? `${habit.frequencyCount}x ${habit.frequencyPeriod}`
    : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1);
  
  const createdAtDate = new Date(habit.createdAt);
  
  // Activity entries (for history timeline)
  const completedDates = Object.entries(habit.history)
    .filter(([_, completed]) => completed)
    .map(([date]) => ({
      date,
      timestamp: new Date(date).getTime()
    }))
    .sort((a, b) => b.timestamp - a.timestamp) // Sort most recent first
    .slice(0, 5); // Show only the 5 most recent completions

  return (
    <div id="habit-detail-view">
      <div className="flex items-center mb-4">
        <Link href="/">
          <div className="p-2 -ml-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </div>
        </Link>
        <h2 className="text-lg font-semibold text-gray-800 ml-1">Habit Details</h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6 overflow-hidden">
        {/* Habit Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{habit.title}</h3>
            {habit.description && <p className="text-gray-600 mt-1">{habit.description}</p>}
            <div className="flex items-center mt-3">
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 mr-2">
                {frequencyText}
              </div>
              <div className="text-sm text-gray-500">
                Created on {formatShortDate(createdAtDate)}
              </div>
            </div>
          </div>
          <div className="flex">
            <Link href={`/habits/${habit.id}/edit`}>
              <div className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full mr-1 cursor-pointer">
                <Edit3 className="h-5 w-5" />
              </div>
            </Link>
            <button 
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
              onClick={handleDelete}
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Habit Stats */}
        <div className="p-4 grid grid-cols-3 gap-4 bg-gray-50 border-b border-gray-100">
          <div className="text-center">
            <div className="text-sm text-gray-500">Current Streak</div>
            <div className="mt-1 text-2xl font-bold text-primary">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500">days</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Best Streak</div>
            <div className="mt-1 text-2xl font-bold text-primary">{stats.bestStreak}</div>
            <div className="text-xs text-gray-500">days</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Completion Rate</div>
            <div className="mt-1 text-2xl font-bold text-primary">{stats.completionRate}%</div>
            <div className="text-xs text-gray-500">all time</div>
          </div>
        </div>
        
        {/* Monthly Calendar View */}
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">{format(currentMonth, 'MMMM yyyy')}</h4>
          <div className="grid grid-cols-7 gap-1">
            <div className="text-xs text-center text-gray-400 font-medium">Mo</div>
            <div className="text-xs text-center text-gray-400 font-medium">Tu</div>
            <div className="text-xs text-center text-gray-400 font-medium">We</div>
            <div className="text-xs text-center text-gray-400 font-medium">Th</div>
            <div className="text-xs text-center text-gray-400 font-medium">Fr</div>
            <div className="text-xs text-center text-gray-400 font-medium">Sa</div>
            <div className="text-xs text-center text-gray-400 font-medium">Su</div>
            
            {calendarDays.map((day, index) => (
              <div 
                key={index}
                className={`h-8 rounded-full flex items-center justify-center text-xs
                  ${day.isToday 
                    ? 'bg-primary text-white ring-2 ring-primary ring-offset-2' 
                    : day.isCompleted === true 
                      ? 'bg-green-100 text-green-800' 
                      : day.isCompleted === false 
                        ? 'bg-red-100 text-red-800'
                        : 'text-gray-400 bg-gray-100'
                  }
                `}
              >
                {day.day}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-4 text-sm">
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
              <span className="text-gray-600">Completed</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
              <span className="text-gray-600">Missed</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
              <span className="text-gray-600">Today</span>
            </div>
          </div>
        </div>
        
        {/* History Timeline */}
        <div className="p-4 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {completedDates.length > 0 ? (
              completedDates.map((activity, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 w-10 flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className={`w-0.5 h-full bg-gray-200 ${index === completedDates.length - 1 ? 'hidden' : ''}`}></div>
                  </div>
                  <div className="flex-grow pb-4">
                    <div className="text-sm font-medium text-gray-800">Completed</div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">No activity recorded yet</div>
            )}
          </div>
        </div>
      </div>
      
      <DeleteConfirmationDialog 
        isOpen={showDeleteDialog}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

function format(date: Date, formatStr: string): string {
  return formatShortDate(date);
}

export default HabitDetails;
