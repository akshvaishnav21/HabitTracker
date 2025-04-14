import { users, type User, type InsertUser, 
         habits, type Habit, type InsertHabit, 
         habitCompletions, type HabitCompletion, type InsertHabitCompletion } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

// Extend the storage interface with CRUD methods for habits
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Habit methods
  getHabits(userId: number): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;
  
  // Habit completion methods
  getHabitCompletions(habitId: number, startDate?: Date, endDate?: Date): Promise<HabitCompletion[]>;
  toggleHabitCompletion(habitId: number, date: Date): Promise<HabitCompletion>;
}

// Database implementation of the storage interface
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Habit methods
  async getHabits(userId: number): Promise<Habit[]> {
    return db.select().from(habits).where(eq(habits.user_id, userId)).orderBy(desc(habits.created_at));
  }
  
  async getHabit(id: number): Promise<Habit | undefined> {
    const [habit] = await db.select().from(habits).where(eq(habits.id, id));
    return habit;
  }
  
  async createHabit(habit: InsertHabit): Promise<Habit> {
    const [newHabit] = await db.insert(habits).values(habit).returning();
    return newHabit;
  }
  
  async updateHabit(id: number, habitUpdate: Partial<InsertHabit>): Promise<Habit | undefined> {
    const [updated] = await db
      .update(habits)
      .set(habitUpdate)
      .where(eq(habits.id, id))
      .returning();
    return updated;
  }
  
  async deleteHabit(id: number): Promise<boolean> {
    // First delete all completions to avoid foreign key constraint issues
    await db.delete(habitCompletions).where(eq(habitCompletions.habit_id, id));
    
    // Then delete the habit
    const result = await db.delete(habits).where(eq(habits.id, id)).returning();
    return result.length > 0;
  }
  
  // Habit completion methods
  async getHabitCompletions(
    habitId: number, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<HabitCompletion[]> {
    let conditions = [eq(habitCompletions.habit_id, habitId)];
    
    if (startDate) {
      conditions.push(gte(habitCompletions.completion_date, startDate));
    }
    
    if (endDate) {
      conditions.push(lte(habitCompletions.completion_date, endDate));
    }
    
    return db
      .select()
      .from(habitCompletions)
      .where(and(...conditions))
      .orderBy(desc(habitCompletions.completion_date));
  }
  
  async toggleHabitCompletion(habitId: number, date: Date): Promise<HabitCompletion> {
    // Set time to midnight to ensure we're dealing with just the date
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    // Check if there's already a completion record for this date
    const [existingCompletion] = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habit_id, habitId),
          eq(habitCompletions.completion_date, dateOnly)
        )
      );
    
    if (existingCompletion) {
      // Toggle the is_completed value
      const [updated] = await db
        .update(habitCompletions)
        .set({ is_completed: !existingCompletion.is_completed })
        .where(eq(habitCompletions.id, existingCompletion.id))
        .returning();
      return updated;
    } else {
      // Create a new completion record
      const [newCompletion] = await db
        .insert(habitCompletions)
        .values({
          habit_id: habitId,
          completion_date: dateOnly,
          is_completed: true
        })
        .returning();
      return newCompletion;
    }
  }
}

// Export an instance of the database storage
export const storage = new DatabaseStorage();
