import React, { useState } from 'react';
import { Link } from 'wouter';
import { Habit } from '@/lib/types';
import { calculateHabitStats } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { EyeIcon, Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteHabit } from '@/lib/habitStore';
import { useToast } from '@/hooks/use-toast';

interface HabitListProps {
  habits: Habit[];
  onDelete?: () => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onDelete }) => {
  const { toast } = useToast();
  
  const handleDeleteHabit = (id: string) => {
    try {
      deleteHabit(id);
      toast({
        title: "Success",
        description: "Habit deleted successfully",
      });
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete habit",
        variant: "destructive",
      });
    }
  };
  if (habits.length === 0) {
    return (
      <div id="no-habits" className="py-12 text-center bg-white rounded-lg border border-gray-200 shadow-sm">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 mx-auto text-gray-300 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No habits found</h3>
        <p className="text-gray-500 mb-6">Add your first habit to start tracking your progress</p>
        <Link href="/habits/new">
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Habit
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map((habit, index) => {
        const stats = calculateHabitStats(habit);
        const progressColor = stats.completionRate >= 80 
          ? "bg-green-500" 
          : stats.completionRate >= 50 
            ? "bg-amber-500" 
            : "bg-red-400";

        return (
          <div 
            key={habit.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex flex-wrap md:flex-nowrap items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center w-full md:w-auto">
              <div className="text-gray-500 font-medium w-7 mr-3 text-center">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{habit.title}</h3>
                <div className="flex items-center mt-1">
                  <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 mr-2">
                    {habit.frequency === 'custom' 
                      ? `${habit.frequencyCount}x ${habit.frequencyPeriod}`
                      : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mt-3 md:mt-0 w-full md:w-auto">
              <div className="text-sm text-gray-600 mr-3">{stats.completionRate}% completed</div>
              <div className="flex-grow max-w-[150px] mr-4">
                <Progress 
                  value={stats.completionRate} 
                  className="h-2" 
                  indicatorClassName={progressColor}
                />
              </div>
              <div className="flex space-x-1">
                <Link href={`/habits/${habit.id}`}>
                  <div className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer">
                    <EyeIcon className="h-5 w-5" />
                  </div>
                </Link>
                <Link href={`/habits/${habit.id}/edit`}>
                  <div className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full cursor-pointer">
                    <Edit2Icon className="h-5 w-5" />
                  </div>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="p-2 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-full cursor-pointer">
                      <Trash2Icon className="h-5 w-5" />
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Habit</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this habit? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteHabit(habit.id)} className="bg-red-500 hover:bg-red-600">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;
