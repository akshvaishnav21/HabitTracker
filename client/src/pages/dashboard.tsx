import React, { useState, useEffect } from 'react';
import { formatShortDate, calculateDailyProgress, calculateWeeklyProgress, getTodayISODate } from '@/lib/utils';
import { loadHabits, getBestStreak } from '@/lib/habitStore';
import { Habit } from '@/lib/types';

import StatCard from '@/components/StatCard';
import HabitCard from '@/components/HabitCard';
import WeeklyProgress from '@/components/WeeklyProgress';
import HabitList from '@/components/HabitList';
import { Link } from 'wouter';
import { Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [todayProgress, setTodayProgress] = useState({ total: 0, completed: 0, percentage: 0 });
  const [weeklyProgress, setWeeklyProgress] = useState({ 
    days: [], 
    percentage: 0 
  });
  const [bestStreak, setBestStreak] = useState(0);
  
  // Refresh data
  const refreshData = () => {
    const allHabits = loadHabits();
    setHabits(allHabits);
    
    // Today's habits would be filtered here based on frequency if we had more complex scheduling
    setTodayHabits(allHabits);
    
    // Calculate stats
    setTodayProgress(calculateDailyProgress(allHabits));
    setWeeklyProgress(calculateWeeklyProgress(allHabits));
    setBestStreak(getBestStreak());
  };
  
  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);
  
  // Update completions
  const handleToggleCompletion = () => {
    refreshData();
  };
  
  const today = new Date();
  const formattedToday = formatShortDate(today);
  
  return (
    <div id="dashboard-view">
      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard title="Total Habits" value={habits.length} />
        <StatCard 
          title="Today's Progress" 
          value={`${todayProgress.completed}/${todayProgress.total}`} 
          suffix={`${todayProgress.percentage}%`} 
        />
        <StatCard title="Best Streak" value={bestStreak} suffix="days" />
        <StatCard title="Week Completion" value={`${weeklyProgress.percentage}%`} />
      </div>

      {/* Today's Habits */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Today's Habits</h2>
          <div className="text-sm text-gray-500">{formattedToday}</div>
        </div>
        
        <div className="space-y-3">
          {todayHabits.length > 0 ? (
            todayHabits.map(habit => {
              const isCompleted = Boolean(habit.history[getTodayISODate()]);
              return (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isCompleted}
                  onToggle={handleToggleCompletion}
                />
              );
            })
          ) : (
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
              <h3 className="text-lg font-medium text-gray-600 mb-2">No habits for today</h3>
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
          )}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Progress</h2>
        <WeeklyProgress weeklyProgress={weeklyProgress} />
      </div>

      {/* All Habits */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">All Habits</h2>
          <button className="text-sm text-primary hover:text-indigo-700 flex items-center">
            <Settings className="h-4 w-4 mr-1" />
            Manage
          </button>
        </div>
        
        <HabitList habits={habits} />
      </div>
    </div>
  );
};

export default Dashboard;
