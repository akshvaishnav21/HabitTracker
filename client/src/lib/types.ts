export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type FrequencyPeriod = 'weekly' | 'monthly';
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface HabitHistory {
  [date: string]: boolean;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  frequencyCount?: number;
  frequencyPeriod?: FrequencyPeriod;
  selectedDays?: DayOfWeek[];
  reminderEnabled?: boolean;
  reminderTime?: string;
  createdAt: string;
  history: HabitHistory;
}

export interface HabitFormData {
  title: string;
  description?: string;
  frequency: HabitFrequency;
  frequencyCount?: number;
  frequencyPeriod?: FrequencyPeriod;
  selectedDays?: DayOfWeek[];
  reminderEnabled?: boolean;
  reminderTime?: string;
}

export interface DailyProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface WeeklyProgress {
  days: Array<{
    date: string;
    shortName: string;
    completion: number;
    isFuture: boolean;
  }>;
  percentage: number;
}

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
}
