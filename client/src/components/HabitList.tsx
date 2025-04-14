import React from 'react';
import { Link } from 'wouter';
import { Habit } from '@/lib/types';
import { calculateHabitStats, getStreakText } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { EyeIcon } from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => {
  if (habits.length === 0) {
    return (
      <div id="no-habits" className="py-12 text-center">
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
          <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Add Your First Habit
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {habits.map(habit => {
        const stats = calculateHabitStats(habit);
        const completionText = stats.currentStreak === 1 
          ? "1 day streak" 
          : stats.currentStreak > 1 
            ? `${stats.currentStreak} day streak` 
            : "No streak";

        return (
          <div 
            key={habit.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium text-gray-800">{habit.title}</h3>
              <div className="flex items-center mt-1">
                <div className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 mr-2">
                  {habit.frequency === 'custom' 
                    ? `${habit.frequencyCount}x ${habit.frequencyPeriod}`
                    : habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3.5 w-3.5 mr-1 text-green-500" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  <span>{completionText}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-xs text-gray-500 mr-3 hidden sm:block">{stats.completionRate}% completed</div>
              <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mr-3 hidden sm:block">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <Link href={`/habits/${habit.id}`}>
                <a className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                  <EyeIcon className="h-5 w-5" />
                </a>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HabitList;
