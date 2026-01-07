import { Hono } from "hono";
import { generateRecallCards } from "../services/recall.service";
import { generateHint, generateExplanation } from "../services/assistant.service";

type Bindings = {
    OPENROUTER_API_KEY: string;
}

const recall = new Hono<{ Bindings: Bindings }>();

recall.post("/", async (c) => {
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

        const result = await generateRecallCards(apiKey, text, limit || 15);
        return c.json(result);
    } catch (error: any) {
        console.error("Error in recall route:", error);
        return c.json({ error: error.message || "Failed to generate recall cards" }, 500);
    }
});

recall.post("/hint", async (c) => {
    try {
        const { question } = await c.req.json();
        const apiKey = c.env.OPENROUTER_API_KEY;

        if (!question) {
            return c.json({ error: "Question is required" }, 400);
        }

        const hint = await generateHint(apiKey, question);
        return c.json({ hint });
    } catch (error) {
        console.error("Error in hint route:", error);
        return c.json({ error: "Failed to generate hint" }, 500);
    }
});

recall.post("/explain", async (c) => {
    try {
        const { question, answer } = await c.req.json();
        const apiKey = c.env.OPENROUTER_API_KEY;

        if (!question || !answer) {
            return c.json({ error: "Question and answer are required" }, 400);
        }

        const explanation = await generateExplanation(apiKey, question, answer);
        return c.json({ explanation });
    } catch (error) {
        console.error("Error in explain route:", error);
        return c.json({ error: "Failed to generate explanation" }, 500);
    }
});

export default recall;
