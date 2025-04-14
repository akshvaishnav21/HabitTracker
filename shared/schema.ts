import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Base user table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// User relations
export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}));

// Habits table
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 20 }).notNull().default("daily"),
  frequency_count: integer("frequency_count"),
  frequency_period: varchar("frequency_period", { length: 20 }),
  reminder_enabled: boolean("reminder_enabled").default(false),
  reminder_time: varchar("reminder_time", { length: 10 }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.user_id],
    references: [users.id],
  }),
  completions: many(habitCompletions),
}));

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  created_at: true,
});

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

// Habit completions table to track habit completion history
export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  habit_id: integer("habit_id").references(() => habits.id).notNull(),
  completion_date: timestamp("completion_date").defaultNow().notNull(),
  is_completed: boolean("is_completed").default(true).notNull(),
});

export const habitCompletionsRelations = relations(habitCompletions, ({ one }) => ({
  habit: one(habits, {
    fields: [habitCompletions.habit_id],
    references: [habits.id],
  }),
}));

export const insertHabitCompletionSchema = createInsertSchema(habitCompletions).omit({
  id: true,
});

export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
