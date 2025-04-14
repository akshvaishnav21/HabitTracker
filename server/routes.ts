import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertHabitSchema, insertHabitCompletionSchema } from "@shared/schema";

// Define validation schemas for API requests
const habitIdParamSchema = z.object({
  id: z.coerce.number(),
});

const habitDateParamSchema = z.object({
  date: z.string().transform((val) => new Date(val)),
});

// Helper function to handle errors
const handleApiError = (res: Response, error: unknown) => {
  console.error("API Error:", error);
  if (error instanceof z.ZodError) {
    return res.status(400).json({ 
      error: "Validation error", 
      details: error.errors 
    });
  }
  return res.status(500).json({ error: "Internal server error" });
};

// Default user ID until we implement authentication
const DEFAULT_USER_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a default user if it doesn't exist
  try {
    const existingUser = await storage.getUserByUsername("default");
    if (!existingUser) {
      await storage.createUser({
        username: "default",
        password: "password", // Not used in our no-login app
      });
    }
  } catch (error) {
    console.error("Error creating default user:", error);
  }

  // Habit routes
  app.get("/api/habits", async (req: Request, res: Response) => {
    try {
      const habits = await storage.getHabits(DEFAULT_USER_ID);
      res.json(habits);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.get("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const { id } = habitIdParamSchema.parse(req.params);
      const habit = await storage.getHabit(id);
      
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      
      // Get habit completions for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const completions = await storage.getHabitCompletions(id, startDate, endDate);
      
      res.json({
        ...habit,
        completions
      });
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.post("/api/habits", async (req: Request, res: Response) => {
    try {
      const habitData = insertHabitSchema.parse({
        ...req.body,
        user_id: DEFAULT_USER_ID,
      });
      
      const newHabit = await storage.createHabit(habitData);
      res.status(201).json(newHabit);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.patch("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const { id } = habitIdParamSchema.parse(req.params);
      
      // Validate the update data (partial validation)
      const updateData = insertHabitSchema.partial().parse(req.body);
      
      const updatedHabit = await storage.updateHabit(id, updateData);
      
      if (!updatedHabit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      
      res.json(updatedHabit);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.delete("/api/habits/:id", async (req: Request, res: Response) => {
    try {
      const { id } = habitIdParamSchema.parse(req.params);
      const success = await storage.deleteHabit(id);
      
      if (!success) {
        return res.status(404).json({ error: "Habit not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      handleApiError(res, error);
    }
  });

  // Habit completion routes
  app.post("/api/habits/:id/toggle/:date", async (req: Request, res: Response) => {
    try {
      const { id } = habitIdParamSchema.parse(req.params);
      const { date } = habitDateParamSchema.parse(req.params);
      
      const habit = await storage.getHabit(id);
      if (!habit) {
        return res.status(404).json({ error: "Habit not found" });
      }
      
      const completion = await storage.toggleHabitCompletion(id, date);
      res.json(completion);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  app.get("/api/habits/:id/completions", async (req: Request, res: Response) => {
    try {
      const { id } = habitIdParamSchema.parse(req.params);
      
      // Parse optional query parameters
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const completions = await storage.getHabitCompletions(id, startDate, endDate);
      res.json(completions);
    } catch (error) {
      handleApiError(res, error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
