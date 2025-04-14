import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Habit } from "@/lib/types";
import { toggleHabitCompletion, getHabit } from "@/lib/habitStore";
import { getStreakText, calculateHabitStats } from "@/lib/utils";
import { CheckIcon, XIcon, Award, Edit2Icon } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onToggle }) => {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const stats = calculateHabitStats(habit);
  const currentStreak = stats.currentStreak;
  
  const handleToggle = () => {
    const newStatus = toggleHabitCompletion(habit.id);
    
    if (newStatus) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
      
      toast({
        title: "Success!",
        description: "Habit marked as complete!",
        variant: "default",
      });
    } else {
      toast({
        title: "Updated",
        description: "Habit marked as incomplete",
        variant: "default",
      });
    }
    
    onToggle();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4 sm:px-5 flex items-center justify-between">
        <div className="flex items-center flex-grow">
          <button 
            className={`w-8 h-8 rounded-full border-2 ${isCompleted 
              ? 'border-green-500 bg-green-500' 
              : 'border-gray-300 hover:border-primary'} flex items-center justify-center mr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isAnimating ? 'animate-bounce' : ''
            }`}
            onClick={handleToggle}
            aria-label={isCompleted ? "Mark incomplete" : "Mark complete"}
          >
            {isCompleted ? (
              <CheckIcon className="h-5 w-5 text-white" />
            ) : (
              <XIcon className="h-5 w-5 text-gray-300 opacity-0 group-hover:opacity-100" />
            )}
          </button>
          <div className="flex-grow">
            <h3 className={`font-medium text-gray-800 text-base ${isCompleted ? 'line-through text-gray-500' : ''}`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500 mt-1">{habit.description}</p>
            )}
            <div className="flex items-center mt-2">
              <div className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 mr-2">
                {habit.frequency === 'custom' 
                  ? `${habit.frequencyCount}x ${habit.frequencyPeriod}` 
                  : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
              </div>
              <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                <Award className="h-3 w-3 mr-1" />
                {currentStreak > 0 ? `${currentStreak}-day streak` : 'No streak yet'}
              </div>
            </div>
          </div>
        </div>
        <div className="ml-4">
          <Link href={`/habits/${habit.id}/edit`}>
            <div className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer">
              <Edit2Icon className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
