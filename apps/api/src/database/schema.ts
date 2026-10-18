import type { PainEvent, UserProfile, WorkoutSession } from "@bellgrinda/domain";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  payload: jsonb("payload").$type<UserProfile>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const workoutSessions = pgTable("workout_sessions", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  payload: jsonb("payload").$type<WorkoutSession>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export const painEvents = pgTable("pain_events", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionId: uuid("session_id").notNull(),
  payload: jsonb("payload").$type<PainEvent>().notNull(),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull()
});
