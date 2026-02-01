import { Hono } from "hono";
import { db } from "../db";
import { notes } from "../db/schema";
import { eq, desc } from "drizzle-orm";

const app = new Hono();

// GET all notes (ordered by newest first)
app.get("/", async (c) => {
    try {
        const allNotes = await db.select().from(notes).orderBy(desc(notes.createdAt));
        return c.json(allNotes);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

// GET single note
app.get("/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    try {
        const result = await db.select().from(notes).where(eq(notes.id, id)).limit(1);
        if (result.length === 0) return c.json({ error: "Note not found" }, 404);
        return c.json(result[0]);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

// CREATE note
app.post("/", async (c) => {
    try {
        const { title, content, tags } = await c.req.json();

        if (!title || !content) {
            return c.json({ error: "Title and content are required" }, 400);
        }

        const newNote = await db.insert(notes).values({
            title,
            content,
            tags,
            userId: null // Placeholder until auth is ready
        }).returning();

        return c.json(newNote[0], 201);
    } catch (error: any) {
        console.error("Error creating note:", error);
        return c.json({ error: error.message }, 500);
    }
});

// UPDATE note
app.put("/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    try {
        const { title, content, tags } = await c.req.json();

        const updatedNote = await db.update(notes)
            .set({
                title,
                content,
                tags,
                updatedAt: new Date()
            })
            .where(eq(notes.id, id))
            .returning();

        if (updatedNote.length === 0) return c.json({ error: "Note not found" }, 404);

        return c.json(updatedNote[0]);
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

// DELETE note
app.delete("/:id", async (c) => {
    const id = parseInt(c.req.param("id"));
    try {
        const deleted = await db.delete(notes).where(eq(notes.id, id)).returning();
        if (deleted.length === 0) return c.json({ error: "Note not found" }, 404);
        return c.json({ message: "Note deleted successfully", id });
    } catch (error: any) {
        return c.json({ error: error.message }, 500);
    }
});

export default app;
