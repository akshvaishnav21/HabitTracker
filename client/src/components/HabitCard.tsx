import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Habit } from "@/lib/types";
import { toggleHabitCompletion, getHabit } from "@/lib/habitStore";
import { getStreakText } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, isCompleted, onToggle }) => {
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const currentStreak = getStreakText(habit.history ? Object.values(habit.history).filter(Boolean).length : 0);
  
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
    }
    
    onToggle();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className={`w-6 h-6 rounded-full border-2 ${isCompleted 
              ? 'border-green-500 bg-green-500' 
              : 'border-primary'} flex items-center justify-center mr-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
              isAnimating ? 'animate-bounce' : ''
            }`}
            onClick={handleToggle}
          >
            {isCompleted && (
              <CheckIcon className="h-4 w-4 text-white" />
            )}
          </button>
          <div>
            <h3 className={`font-medium text-gray-800 ${isCompleted ? 'line-through' : ''}`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-gray-500">{habit.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 mr-2">
            {habit.frequency === 'custom' 
              ? `${habit.frequencyCount}x ${habit.frequencyPeriod}` 
              : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
          </div>
          <Link href={`/habits/${habit.id}/edit`}>
            <a className="text-gray-400 hover:text-gray-600 p-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                />
              </svg>
            </a>
          </Link>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
        <div className="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1 text-green-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
              clipRule="evenodd" 
            />
          </svg>
          <span>{currentStreak}</span>
        </div>
        <div>Since {new Date(habit.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
};

export default HabitCard;
