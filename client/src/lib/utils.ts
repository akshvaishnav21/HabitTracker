import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, format, isToday, startOfWeek, isFuture, parseISO, isSameDay } from "date-fns";
import { DailyProgress, WeeklyProgress, Habit, HabitStats } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, "EEEE, MMMM d");
}

export function formatShortDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function getTodayISODate(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function calculateDailyProgress(habits: Habit[]): DailyProgress {
  const todayDate = getTodayISODate();
  const todayHabits = habits.filter(habit => habit.frequency === 'daily' || shouldCompleteToday(habit));
  const completed = todayHabits.filter(habit => habit.history[todayDate]).length;
  const total = todayHabits.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
}

export function calculateWeeklyProgress(habits: Habit[]): WeeklyProgress {
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Start week on Monday
  
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    const dateStr = format(date, "yyyy-MM-dd");
    const dayHabits = habits.filter(habit => habit.frequency === 'daily' || shouldCompleteThatDay(habit, date));
    
    // For future dates, return 0% completion
    if (isFuture(date)) {
      return {
        date: dateStr,
        shortName: format(date, "EEE"),
        completion: -1, // -1 indicates future date
        isFuture: true
      };
    }
    
    // Calculate completion for past and today
    const totalForDay = dayHabits.length;
    const completedForDay = dayHabits.filter(habit => habit.history[dateStr]).length;
    const percentage = totalForDay > 0 ? Math.round((completedForDay / totalForDay) * 100) : 0;
    
    return {
      date: dateStr,
      shortName: format(date, "EEE"),
      completion: percentage,
      isFuture: false
    };
  });
  
  // Calculate overall weekly progress (excluding future days)
  const pastDays = days.filter(day => !day.isFuture);
  const totalPercentage = pastDays.reduce((sum, day) => sum + (day.completion >= 0 ? day.completion : 0), 0);
  const percentage = pastDays.length > 0 ? Math.round(totalPercentage / pastDays.length) : 0;
  
  return { days, percentage };
}

export function calculateHabitStats(habit: Habit): HabitStats {
  const sortedDates = Object.entries(habit.history)
    .map(([date, completed]) => ({ date, completed }))
    .filter(entry => entry.completed)
    .map(entry => entry.date)
    .sort();

  // Calculate current streak
  let currentStreak = 0;
  const today = getTodayISODate();
  let checkDate = today;
  
  // Check if today is completed
  if (habit.history[today]) {
    currentStreak = 1;
    
    // Check previous days
    let prevDate = format(addDays(parseISO(today), -1), "yyyy-MM-dd");
    while (habit.history[prevDate]) {
      currentStreak++;
      prevDate = format(addDays(parseISO(prevDate), -1), "yyyy-MM-dd");
    }
  } else {
    // If today not completed, check if yesterday was and count backwards
    let prevDate = format(addDays(parseISO(today), -1), "yyyy-MM-dd");
    if (habit.history[prevDate]) {
      currentStreak = 1;
      prevDate = format(addDays(parseISO(prevDate), -1), "yyyy-MM-dd");
      while (habit.history[prevDate]) {
        currentStreak++;
        prevDate = format(addDays(parseISO(prevDate), -1), "yyyy-MM-dd");
      }
    }
  }

  // Calculate best streak
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;
  
  for (const dateStr of sortedDates) {
    const currentDate = parseISO(dateStr);
    
    if (prevDate === null) {
      tempStreak = 1;
    } else {
      const dayDiff = Math.round(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (dayDiff === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    
    bestStreak = Math.max(bestStreak, tempStreak);
    prevDate = currentDate;
  }

  // Calculate completion rate
  const daysSinceCreation = Math.max(
    1, 
    Math.ceil(
      (new Date().getTime() - parseISO(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    )
  );
  
  const totalCompletedDays = Object.values(habit.history).filter(completed => completed).length;
  const completionRate = Math.round((totalCompletedDays / daysSinceCreation) * 100);

  return {
    currentStreak,
    bestStreak,
    completionRate
  };
}

function shouldCompleteToday(habit: Habit): boolean {
  // Daily habits should complete every day
  if (habit.frequency === 'daily') return true;
  
  // Weekly habits should complete any day of the week
  if (habit.frequency === 'weekly') return true;
  
  if (habit.frequency === 'custom') {
    // Logic for custom frequency
    // For example, if it's 3x weekly, user can pick any 3 days
    return true;
  }
  
  return false;
}

function shouldCompleteThatDay(habit: Habit, date: Date): boolean {
  // For simple implementation, assume all habits should be completed on all days
  return true;
}

export function getStreakText(streak: number): string {
  if (streak === 0) return "No streak";
  if (streak === 1) return "1 day streak";
  return `${streak} day streak`;
}

export function generateCalendarDays(date: Date, habitHistory: Record<string, boolean>): Array<{
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isCompleted: boolean | null;
  isToday: boolean;
}> {
  // Implementation for generating a month calendar view
  // This would normally generate days for the calendar display
  // Simplified version for this application
  const today = new Date();
  const month = date.getMonth();
  const year = date.getFullYear();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i);
    const dateString = format(currentDate, "yyyy-MM-dd");
    
    days.push({
      date: dateString,
      day: i,
      isCurrentMonth: true,
      isCompleted: habitHistory[dateString] !== undefined ? habitHistory[dateString] : null,
      isToday: isSameDay(currentDate, today)
    });
  }
  
  return days;
}
