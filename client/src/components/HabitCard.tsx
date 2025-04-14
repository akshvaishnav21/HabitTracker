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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow card-gradient">
      <div className="p-4 sm:px-5 flex items-center justify-between">
        <div className="flex items-center flex-grow">
          <button 
            className={`w-8 h-8 rounded-full border-2 ${isCompleted 
              ? 'bg-gradient-success border-transparent' 
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
            <h3 className={`font-bold text-base line-clamp-1 ${isCompleted ? 'line-through opacity-60' : ''}`}
                title={habit.title}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-1" title={habit.description}>
                {habit.description}
              </p>
            )}
            <div className="flex items-center mt-2 flex-wrap gap-2">
              <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-primary text-white">
                {habit.frequency === 'custom' 
                  ? `${habit.frequencyCount}x ${habit.frequencyPeriod}` 
                  : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
              </div>
              <div className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                currentStreak > 0 ? 'bg-gradient-success text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Award className="h-3 w-3 mr-1" />
                {currentStreak > 0 ? `${currentStreak}-day streak` : 'No streak yet'}
              </div>
              {habit.reminderEnabled && habit.reminderTime && (
                <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  Reminder: {habit.reminderTime}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ml-4">
          <Link href={`/habits/${habit.id}/edit`}>
            <div className="p-2 rounded-full text-primary hover:bg-primary/10 cursor-pointer">
              <Edit2Icon className="h-5 w-5" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
