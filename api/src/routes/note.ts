import { Hono } from 'hono';
import { createNote } from '../services/Notes/note.service';
import { generateExplanation } from '../services/Notes/noteassistant.service';

type Bindings = {
    OPENROUTER_API_KEY: string;
}

const note = new Hono<{ Bindings: Bindings }>();

note.post("/generate", async (c) => {
    try {
        const { text, limit } = await c.req.json();

        if (!text || text.length < 50) {
            return c.json({ error: "Text must be at least 50 characters long" }, 400);
        }

        const apiKey = c.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("OPENROUTER_API_KEY is not configured");
            return c.json({ error: "Server configuration error" }, 500);
        }

        const result = await createNote(apiKey, text, limit || 20);
        return c.json(result);
    } catch (error: any) {
        console.error("Error in note route:", error);
        const status = error.message.includes('429') ? 429 : 500;
        return c.json({ error: error.message || "Failed to generate note" }, status);
    }
});

note.post("/explain", async (c) => {
    try {
        const { note: noteData, fullText } = await c.req.json();

        if (!noteData) {
            return c.json({ error: "Note data is required" }, 400);
        }

        const apiKey = c.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("OPENROUTER_API_KEY is not configured");
            return c.json({ error: "Server configuration error" }, 500);
        }

        const result = await generateExplanation(apiKey, noteData, fullText);
        return c.json({ explanation: result });
    } catch (error: any) {
        console.error("Error in explain route:", error);
        return c.json({ error: error.message || "Failed to generate explanation" }, 500);
    }
});

export default note;