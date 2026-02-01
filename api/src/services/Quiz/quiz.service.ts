export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface QuizData {
    title: string;
    topic: string;
    questions: QuizQuestion[];
}

export async function generateQuiz(
    apiKey: string,
    text: string,
    numQuestions: number = 5,
    difficulty: string = 'medium'
): Promise<QuizData> {
    try {
        const prompt = `
You are an elite educational assessment designer with expertise in creating exam-caliber questions. Your mission: craft ${numQuestions} multiple-choice questions that rigorously prepare students for competitive exams while building genuine understanding.

CORE OBJECTIVE:
Generate questions that mirror real exam formats, test deep comprehension, and help students identify knowledge gaps before the actual test.

PARAMETERS:
- Questions to Generate: ${numQuestions}
- Difficulty Level: ${difficulty}

DIFFICULTY SPECIFICATIONS:
- Easy: Basic factual recall, definitions, and simple matching.
- Medium: Application of concepts, cause-and-effect, and simple analysis.
- Hard: Complex synthesis, multi-step problem solving, critical evaluation, and subtle distractor differentiation.

INSTRUCTIONS:
1. Analyze the provided text thoroughly to extract key concepts, dates, definitions, and relationships.
2. Formulate ${numQuestions} multiple-choice questions based ONLY on the provided text.
3. For each question, provide 4 options (A, B, C, D) where only one is correct.
4. Ensure distractors (incorrect options) are plausible and related to the content to test true understanding.
5. Provide the correct answer for each question.
6. Also, identify the main topic/subject of the text (e.g., "Biology", "History", "Physics") and provide a suitable title for the quiz.

OUTPUT FORMAT:
Return the result strictly as a JSON object with the following structure:
{
    "title": "A descriptive title for the quiz",
    "topic": "The main subject or topic",
    "questions": [
        {
            "id": 1,
            "question": "Question text here...",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "The correct option text (must match one of the options exactly)"
        }
    ]
}

SYSTEM MESSAGE:
You are a helpful AI assistant that generates quizzes. You must respond with a valid JSON object only. Do not include any markdown formatting or explanatory text outside the JSON.

TEXT TO ANALYZE:
"${text}"
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://study-flashcard.app",
                "X-Title": "Study Flashcard"
            },
            body: JSON.stringify({
                "model": "qwen/qwen-2.5-vl-7b-instruct:free",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that generates quizzes. You must respond with a valid JSON object only. Do not include any markdown formatting or explanatory text outside the JSON."
                    },
                    { "role": "user", "content": prompt }
                ],
                "temperature": 0.3
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const result: any = await response.json();

        if (result.error) {
            throw new Error(`OpenRouter API Error: ${result.error.message || JSON.stringify(result.error)}`);
        }

        if (!result.choices || !result.choices[0] || !result.choices[0].message) {
            throw new Error("Invalid response format from OpenRouter: missing choices");
        }

        let content = result.choices[0].message.content.trim();

        // Remove markdown code blocks if present
        content = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

        // Extract JSON substring if there's extra text
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.substring(jsonStart, jsonEnd + 1);
        }

        const quizData: QuizData = JSON.parse(content);

        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error("Invalid format: 'questions' array missing");
        }

        // Ensure topic is present if AI missed it
        if (!quizData.topic) {
            quizData.topic = "General Assessment";
        }
        // Ensure title is present if AI missed it
        if (!quizData.title) {
            quizData.title = "Generated Quiz";
        }

        return quizData;

    } catch (error: any) {
        console.error("Error generating quiz:", error);
        throw new Error(`Quiz generation failed: ${error.message || error}`);
    }
}
