import React, { useState, useEffect } from 'react';
import { formatShortDate, calculateDailyProgress, calculateWeeklyProgress, getTodayISODate } from '@/lib/utils';
import { loadHabits, getBestStreak } from '@/lib/habitStore';
import { Habit, WeeklyProgress as WeeklyProgressType } from '@/lib/types';

import StatCard from '@/components/StatCard';
import HabitCard from '@/components/HabitCard';
import WeeklyProgress from '@/components/WeeklyProgress';
import ContributionMatrix from '@/components/ContributionMatrix';
import HabitList from '@/components/HabitList';
import { Link } from 'wouter';
import { Settings, PlusIcon, Calendar, ListChecks, BarChart2 } from 'lucide-react';
import AddHabitButton from '@/components/AddHabitButton';

const Dashboard: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayHabits, setTodayHabits] = useState<Habit[]>([]);
  const [todayProgress, setTodayProgress] = useState({ total: 0, completed: 0, percentage: 0 });
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressType>({ 
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
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Total Habits" value={habits.length} icon="habits" />
        <StatCard 
          title="Today's Progress" 
          value={`${todayProgress.completed}/${todayProgress.total}`} 
          suffix={`${todayProgress.percentage}%`}
          icon="progress"
        />
        <StatCard 
          title="Best Streak" 
          value={bestStreak} 
          suffix="days" 
          icon="streak"
        />
        <StatCard 
          title="Week Completion" 
          value={`${weeklyProgress.percentage}%`} 
          icon="completion"
        />
      </div>

      {/* Today's Habits */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-primary mr-2 flex items-center justify-center shadow-sm">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            Today's Habits
          </h2>
          <div className="text-sm bg-gray-100 px-3 py-1.5 rounded-full font-medium text-gray-600">{formattedToday}</div>
        </div>
        
        <div className="space-y-4">
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
            <div id="no-habits" className="py-16 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">No habits for today</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">Start tracking your daily habits to build consistency and achieve your goals</p>
              <Link href="/habits/new">
                <div className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer transform transition-transform hover:scale-105">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Your First Habit
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Habit Progress */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 flex items-center mb-5">
          <div className="h-8 w-8 rounded-full bg-gradient-success mr-2 flex items-center justify-center shadow-sm">
            <BarChart2 className="h-4 w-4 text-white" />
          </div>
          Habit Progress
        </h2>
        <div className="space-y-8">
          <ContributionMatrix 
            habits={habits} 
            title="Daily Habits" 
            frequency="daily"
          />
          
          <ContributionMatrix 
            habits={habits} 
            title="Weekly Habits" 
            frequency="weekly"
          />
          
          <ContributionMatrix 
            habits={habits} 
            title="Custom Habits" 
            frequency="custom"
          />
        </div>
      </div>

      {/* All Habits */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 flex items-center mb-5">
          <div className="h-8 w-8 rounded-full bg-gradient-warning mr-2 flex items-center justify-center shadow-sm">
            <ListChecks className="h-4 w-4 text-white" />
          </div>
          All Habits
        </h2>
        
        <HabitList habits={habits} onDelete={refreshData} />
      </div>
      
      {/* Add Habit floating button */}
      <AddHabitButton />
    </div>
  );
};

export default Dashboard;
