import { pgTable, serial, text, jsonb, timestamp, integer } from "drizzle-orm/pg-core";

// Users table (placeholder for future auth integration)
export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: text("email").unique(),
    createdAt: timestamp("created_at").defaultNow(),
});

// Smart Notes table
export const notes = pgTable("notes", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id), // Nullable for now if auth not ready
    title: text("title").notNull(),
    content: text("content").notNull(), // The note body content
    tags: jsonb("tags"), // Optional tags array
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});


