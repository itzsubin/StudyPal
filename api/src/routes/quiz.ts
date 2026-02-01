import { Hono } from "hono";
import { generateQuiz } from "../services/Quiz/quiz.service";

type Bindings = {
    OPENROUTER_API_KEY: string;
}

const quiz = new Hono<{ Bindings: Bindings }>();

quiz.post("/", async (c) => {
    try {
        const { text, numQuestions, difficulty } = await c.req.json();

        if (!text || text.length < 50) {
            return c.json({ error: "Text must be at least 50 characters long" }, 400);
        }

        const apiKey = c.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("OPENROUTER_API_KEY is not configured");
            return c.json({ error: "Server configuration error" }, 500);
        }

        console.log(`[Quiz] Received request. Text length: ${text.length}, Questions: ${numQuestions}, Difficulty: ${difficulty}`);
        console.log("[Quiz] Starting generation...");

        const startTime = Date.now();
        const result = await generateQuiz(apiKey, text, numQuestions, difficulty);

        const duration = Date.now() - startTime;

        console.log(`[Quiz] Generation successful in ${duration}ms.`);
        return c.json(result);
    } catch (error: any) {
        console.error("Error in quiz route:", error);
        return c.json({ error: error.message || "Failed to generate quiz" }, 500);
    }
});

export default quiz;
