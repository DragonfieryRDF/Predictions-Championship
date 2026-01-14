import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  color: text("color").notNull().default("#FF1801"), // F1 Red default
  isAdmin: boolean("is_admin").default(false),
  totalPoints: integer("total_points").default(0),
  exactMatches: integer("exact_matches").default(0),
  supportTeam: text("support_team"),
  supportDriver: text("support_driver"),
});

export const drivers = pgTable("drivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  team: text("team").notNull(),
  number: integer("number"),
});

export const races = pgTable("races", {
  id: serial("id").primaryKey(),
  round: integer("round").notNull(),
  name: text("name").notNull(),
  circuit: text("circuit").notNull(),
  date: timestamp("date").notNull(),
  country: text("country").notNull(),
  hasSprint: boolean("has_sprint").default(false),
  // Results
  p1DriverId: integer("p1_driver_id"),
  p2DriverId: integer("p2_driver_id"),
  p3DriverId: integer("p3_driver_id"),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  raceId: integer("race_id").notNull(),
  p1DriverId: integer("p1_driver_id").notNull(),
  p2DriverId: integer("p2_driver_id").notNull(),
  p3DriverId: integer("p3_driver_id").notNull(),
  points: integer("points"), // Calculated points
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const predictionsRelations = relations(predictions, ({ one }) => ({
  user: one(users, {
    fields: [predictions.userId],
    references: [users.id],
  }),
  race: one(races, {
    fields: [predictions.raceId],
    references: [races.id],
  }),
  p1Driver: one(drivers, {
    fields: [predictions.p1DriverId],
    references: [drivers.id],
  }),
  p2Driver: one(drivers, {
    fields: [predictions.p2DriverId],
    references: [drivers.id],
  }),
  p3Driver: one(drivers, {
    fields: [predictions.p3DriverId],
    references: [drivers.id],
  }),
}));

export const racesRelations = relations(races, ({ one }) => ({
  p1Driver: one(drivers, {
    fields: [races.p1DriverId],
    references: [drivers.id],
  }),
  p2Driver: one(drivers, {
    fields: [races.p2DriverId],
    references: [drivers.id],
  }),
  p3Driver: one(drivers, {
    fields: [races.p3DriverId],
    references: [drivers.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  color: true,
  supportTeam: true,
  supportDriver: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).pick({
  raceId: true,
  p1DriverId: true,
  p2DriverId: true,
  p3DriverId: true,
});

export const setRaceResultsSchema = z.object({
  p1DriverId: z.number(),
  p2DriverId: z.number(),
  p3DriverId: z.number(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Driver = typeof drivers.$inferSelect;
export type Race = typeof races.$inferSelect;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
