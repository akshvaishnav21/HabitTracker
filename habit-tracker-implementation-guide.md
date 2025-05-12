# Habit Tracker Implementation Guide

This guide provides specific code snippets and implementation details to help you transform the conceptual redesign into actual React components using your existing tech stack.

## 1. Dashboard Metrics with Circular Progress

### Circular Progress Component

```tsx
// CircularProgress.tsx
import React from 'react';

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 80,
  strokeWidth = 6,
  color = 'var(--color-primary)',
  label,
  sublabel,
  icon,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke="var(--color-border)"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={color}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        
        {/* Center icon or text */}
        <div className="absolute inset-0 flex items-center justify-center">
          {icon ? (
            icon
          ) : (
            <span className="text-lg font-bold">{`${Math.round(value)}%`}</span>
          )}
        </div>
      </div>
      
      {label && <div className="mt-2 text-sm font-medium">{label}</div>}
      {sublabel && <div className="text-xs text-gray-500">{sublabel}</div>}
    </div>
  );
};
```

### Dashboard Metrics Grid

```tsx
// DashboardMetrics.tsx
import { CircularProgress } from './CircularProgress';
import { Calendar, BarChart2, CheckCircle, Award, Target } from 'lucide-react';

interface DashboardMetricsProps {
  todaysHabits: number;
  completedToday: number;
  todayProgress: number;
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  todaysHabits,
  completedToday,
  todayProgress,
  currentStreak,
  bestStreak,
  completionRate,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Daily Snapshot Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Daily Snapshot
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <CircularProgress 
              value={todayProgress} 
              color="#4F46E5"
              icon={<CheckCircle className="w-6 h-6 text-primary" />}
            />
            <span className="mt-2 text-sm">{`${completedToday}/${todaysHabits} Completed`}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-primary flex items-end">
              {currentStreak}
              <span className="text-sm text-gray-500 ml-1 mb-1">days</span>
            </div>
            <span className="text-sm mt-2">Current Streak</span>
          </div>
        </div>
      </div>
      
      {/* Overall Progress Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-primary" />
          Overall Progress
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <CircularProgress 
              value={completionRate} 
              color="#10B981"
            />
            <span className="mt-2 text-sm">Completion Rate</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-emerald-500 flex items-end">
              {bestStreak}
              <span className="text-sm text-gray-500 ml-1 mb-1">days</span>
            </div>
            <span className="text-sm mt-2">Best Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 2. Enhanced Habit Card Component

```tsx
// HabitCard.tsx
import React from 'react';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Habit } from '@/lib/types';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompleted,
  onToggle,
}) => {
  // Determine border color based on frequency
  const getBorderColor = () => {
    switch (habit.frequency) {
      case 'daily':
        return 'border-l-blue-500';
      case 'weekly':
        return 'border-l-purple-500';
      case 'custom':
        return 'border-l-amber-500';
      default:
        return 'border-l-gray-300';
    }
  };

  // Get human-readable last completed text
  const getLastCompletedText = () => {
    if (isCompleted) {
      return 'Completed today';
    }
    
    // Find last completion date
    const completionDates = Object.entries(habit.history)
      .filter(([_, completed]) => completed)
      .map(([date]) => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    if (completionDates.length === 0) {
      return 'Not completed yet';
    }
    
    return `Last completed ${formatDistanceToNow(completionDates[0], { addSuffix: true })}`;
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm overflow-hidden 
        transition-all duration-300 hover:shadow-md
        border border-gray-100 border-l-4 ${getBorderColor()}
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onToggle}
              className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                ${isCompleted 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-gray-300 hover:border-primary'}
              `}
            >
              {isCompleted && <CheckCircle className="w-4 h-4" />}
            </button>
            
            <div className="flex-1">
              <h3 className="text-lg font-medium flex items-center gap-2">
                {habit.title}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Clock className="w-3.5 h-3.5" />
                {getLastCompletedText()}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <span className={`
              text-xs font-medium py-1 px-2.5 rounded-full
              ${habit.frequency === 'daily' ? 'bg-blue-100 text-blue-800' : 
                habit.frequency === 'weekly' ? 'bg-purple-100 text-purple-800' : 
                'bg-amber-100 text-amber-800'}
            `}>
              {habit.frequency === 'daily' ? 'DAILY' : 
                habit.frequency === 'weekly' ? 'WEEKLY' : 
                'CUSTOM'}
            </span>
            
            <span className="text-xs text-gray-500 mt-2">
              {habit.frequency === 'daily' ? 'Every day' : 
                habit.frequency === 'weekly' ? 'Once a week' : 
                'Custom schedule'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 3. Calendar Heatmap Component

```tsx
// CalendarHeatmap.tsx
import React from 'react';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';

interface CalendarHeatmapProps {
  habitId: string;
  history: Record<string, boolean>;
  title: string;
  dateRange?: number; // Number of days to show
}

export const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({
  habitId,
  history,
  title,
  dateRange = 28, // Show 4 weeks by default
}) => {
  const today = new Date();
  const startDate = subDays(today, dateRange - 1);
  
  const days = eachDayOfInterval({ start: startDate, end: today });
  
  // Group days by week
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  days.forEach((day, index) => {
    currentWeek.push(day);
    
    if (currentWeek.length === 7 || index === days.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });
  
  // Pad the last week if needed
  if (currentWeek.length > 0 && currentWeek.length < 7) {
    weeks[weeks.length - 1] = [
      ...currentWeek,
      ...Array(7 - currentWeek.length).fill(null)
    ];
  }
  
  // Get completion status for a date
  const getCompletionStatus = (date: Date | null) => {
    if (!date) return null;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    return history[dateStr] || false;
  };
  
  // Get CSS class for cell based on completion
  const getCellClass = (completed: boolean | null) => {
    if (completed === null) return 'bg-gray-50';
    if (completed) return 'bg-emerald-500';
    return 'bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      
      <div className="flex justify-between mb-2">
        <div className="flex gap-6 text-xs text-gray-500">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="w-8 text-center">{day}</div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-2">
            <div className="flex gap-2 items-center">
              {week.map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`
                    w-8 h-8 rounded 
                    ${getCellClass(getCompletionStatus(day))}
                    flex items-center justify-center
                    transition-all duration-200 hover:ring-2 hover:ring-primary
                  `}
                  title={day ? format(day, 'MMM d, yyyy') : ''}
                >
                  {day && <span className="text-xs text-white">{format(day, 'd')}</span>}
                </div>
              ))}
            </div>
            
            <div className="text-xs text-gray-500 self-center ml-2">
              {week[0] && format(week[0], 'MMM d')} - 
              {week[6] && format(week[6], 'MMM d')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 4. Empty State Component

```tsx
// EmptyHabitsState.tsx
import React from 'react';
import { Link } from 'wouter';
import { PlusIcon, BookOpen, Droplets, Dumbbell } from 'lucide-react';

interface EmptyHabitsStateProps {
  onAddHabit: () => void;
  onSelectTemplate?: (template: HabitTemplate) => void;
}

interface HabitTemplate {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  icon: React.ReactNode;
}

export const EmptyHabitsState: React.FC<EmptyHabitsStateProps> = ({ 
  onAddHabit,
  onSelectTemplate
}) => {
  const templates: HabitTemplate[] = [
    {
      title: 'Reading',
      description: '15 min daily',
      frequency: 'daily',
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: 'Stay Hydrated',
      description: '8 glasses daily',
      frequency: 'daily',
      icon: <Droplets className="w-5 h-5" />
    },
    {
      title: 'Exercise',
      description: '3× weekly',
      frequency: 'weekly',
      icon: <Dumbbell className="w-5 h-5" />
    }
  ];

  return (
    <div className="py-16 px-4 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg 
          className="w-10 h-10 text-gray-400"
          xmlns="http://www.w3.org/2000/svg" 
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
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-3">No habits yet</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Track your daily routines and build better habits with just a few taps.
      </p>

      <button
        onClick={onAddHabit}
        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer transform transition-transform hover:scale-105"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Your First Habit
      </button>

      {onSelectTemplate && (
        <>
          <div className="mt-8 mb-4 text-sm text-gray-600">
            Or try one of our suggested templates:
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => onSelectTemplate(template)}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  {template.icon}
                </div>
                <span className="font-medium text-gray-800">{template.title}</span>
                <span className="text-xs text-gray-500">{template.description}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
```

## 5. CSS Animations & Micro-interactions

Add these CSS animations to your `index.css` file:

```css
/* Checkbox animation */
@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.checkbox-animate svg {
  animation: checkmark 0.3s ease-in-out forwards;
}

/* Confetti animation */
@keyframes confetti-slow {
  0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
  100% { transform: translate3d(25px, 105px, 0) rotateX(360deg) rotateY(180deg); }
}

@keyframes confetti-medium {
  0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
  100% { transform: translate3d(100px, 105px, 0) rotateX(100deg) rotateY(360deg); }
}

@keyframes confetti-fast {
  0% { transform: translate3d(0, 0, 0) rotateX(0) rotateY(0); }
  100% { transform: translate3d(-50px, 105px, 0) rotateX(10deg) rotateY(250deg); }
}

.confetti-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1000;
  pointer-events: none;
}

.confetti {
  position: absolute;
  z-index: 1;
  width: 10px;
  height: 10px;
}

.confetti--animation-slow {
  animation: confetti-slow 2.5s linear 1 forwards;
}

.confetti--animation-medium {
  animation: confetti-medium 2s linear 1 forwards;
}

.confetti--animation-fast {
  animation: confetti-fast 1.5s linear 1 forwards;
}

/* Card hover effects */
.habit-card {
  transition: all 0.3s ease;
}

.habit-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

/* Button animations */
.btn-primary {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(1px);
}

.btn-primary::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #fff 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.3s, opacity 0.5s;
}

.btn-primary:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}
```

## 6. Mobile-Responsive Implementation

Update your layout component to handle responsive designs:

```tsx
// AppLayout.tsx
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, BarChart2, Plus, Settings } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [location] = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header stays the same across devices */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">Habit Tracker</h1>
            
            {!isMobile && (
              <nav className="flex space-x-4">
                <Link href="/">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    Dashboard
                  </a>
                </Link>
                <Link href="/stats">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/stats' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    Statistics
                  </a>
                </Link>
                <Link href="/settings">
                  <a className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location === '/settings' ? 'text-primary' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                    Settings
                  </a>
                </Link>
              </nav>
            )}
          </div>
        </div>
      </header>
      
      {/* Main content with responsive padding */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      
      {/* Mobile bottom navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="grid grid-cols-4 h-16">
            <Link href="/">
              <a className={`flex flex-col items-center justify-center ${
                location === '/' ? 'text-primary' : 'text-gray-500'
              }`}>
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </a>
            </Link>
            <Link href="/stats">
              <a className={`flex flex-col items-center justify-center ${
                location === '/stats' ? 'text-primary' : 'text-gray-500'
              }`}>
                <BarChart2 className="w-6 h-6" />
                <span className="text-xs mt-1">Stats</span>
              </a>
            </Link>
            <Link href="/habits/new">
              <a className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center -mt-5">
                  <Plus className="w-6 h-6" />
                </div>
              </a>
            </Link>
            <Link href="/settings">
              <a className={`flex flex-col items-center justify-center ${
                location === '/settings' ? 'text-primary' : 'text-gray-500'
              }`}>
                <Settings className="w-6 h-6" />
                <span className="text-xs mt-1">Settings</span>
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
```

## Implementation Strategy

1. Start by implementing the most impactful changes:
   - Enhanced metric visualizations
   - Improved habit cards
   - Better typography and spacing

2. Then add more sophisticated features:
   - Calendar heatmap
   - Animations and interactions
   - Responsive optimizations

3. Test thoroughly on different devices and screen sizes to ensure smooth functionality.

These code samples provide a foundation for your redesign implementation and can be customized to fit your specific needs and existing codebase.