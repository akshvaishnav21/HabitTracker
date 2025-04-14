import { Habit, HabitFormData } from "./types";
import { getTodayISODate } from "./utils";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "habitTrack_habits";

// Load habits from localStorage
export function loadHabits(): Habit[] {
  try {
    const storedHabits = localStorage.getItem(STORAGE_KEY);
    if (storedHabits) {
      return JSON.parse(storedHabits);
    }
  } catch (error) {
    console.error("Failed to load habits from localStorage:", error);
  }
  return [];
}

// Save habits to localStorage
export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (error) {
    console.error("Failed to save habits to localStorage:", error);
  }
}

// Create a new habit
export function createHabit(habitData: HabitFormData): Habit {
  const newHabit: Habit = {
    id: uuidv4(),
    title: habitData.title,
    description: habitData.description || "",
    frequency: habitData.frequency,
    frequencyCount: habitData.frequencyCount,
    frequencyPeriod: habitData.frequencyPeriod,
    reminderEnabled: habitData.reminderEnabled,
    reminderTime: habitData.reminderTime,
    createdAt: new Date().toISOString(),
    history: {}
  };

  const habits = loadHabits();
  habits.push(newHabit);
  saveHabits(habits);
  
  return newHabit;
}

// Get a habit by ID
export function getHabit(id: string): Habit | undefined {
  const habits = loadHabits();
  return habits.find(habit => habit.id === id);
}

// Update an existing habit
export function updateHabit(id: string, habitData: HabitFormData): Habit | undefined {
  const habits = loadHabits();
  const index = habits.findIndex(habit => habit.id === id);
  
  if (index === -1) return undefined;
  
  const updatedHabit = {
    ...habits[index],
    title: habitData.title,
    description: habitData.description || "",
    frequency: habitData.frequency,
    frequencyCount: habitData.frequencyCount,
    frequencyPeriod: habitData.frequencyPeriod,
    reminderEnabled: habitData.reminderEnabled,
    reminderTime: habitData.reminderTime
  };
  
  habits[index] = updatedHabit;
  saveHabits(habits);
  
  return updatedHabit;
}

// Delete a habit
export function deleteHabit(id: string): boolean {
  const habits = loadHabits();
  const newHabits = habits.filter(habit => habit.id !== id);
  
  if (newHabits.length === habits.length) {
    return false;
  }
  
  saveHabits(newHabits);
  return true;
}

// Toggle habit completion for a specific date
export function toggleHabitCompletion(id: string, date: string = getTodayISODate()): boolean {
  const habits = loadHabits();
  const index = habits.findIndex(habit => habit.id === id);
  
  if (index === -1) return false;
  
  const habit = habits[index];
  
  // Toggle the completion status
  habit.history[date] = habit.history[date] ? false : true;
  
  habits[index] = habit;
  saveHabits(habits);
  
  return habit.history[date];
}

// Get today's habits
export function getTodayHabits(): Habit[] {
  const habits = loadHabits();
  // In a more complex app, we would filter based on schedule
  // For this version, we'll return all daily habits
  return habits.filter(habit => habit.frequency === 'daily');
}

// Get best streak across all habits
export function getBestStreak(): number {
  const habits = loadHabits();
  let bestStreak = 0;
  
  habits.forEach(habit => {
    const dates = Object.entries(habit.history)
      .filter(([_, completed]) => completed)
      .map(([date]) => date)
      .sort();
    
    let currentStreak = 0;
    let previousDate: Date | null = null;
    
    for (const dateStr of dates) {
      const currentDate = new Date(dateStr);
      
      if (previousDate === null) {
        currentStreak = 1;
      } else {
        const dayDiff = Math.round(
          (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        if (dayDiff === 1) {
          currentStreak++;
        } else {
          currentStreak = 1;
        }
      }
      
      bestStreak = Math.max(bestStreak, currentStreak);
      previousDate = currentDate;
    }
  });
  
  return bestStreak;
}
