export interface QuizQuestion {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface QuizData {
    title: string;
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
You are an expert educational assessment designer specializing in creating high-quality, exam-focused quiz questions. Your goal is to help students thoroughly prepare for their exams through effective practice questions.

TASK:
Create ${numQuestions} multiple-choice questions based on the provided study material that will maximize student learning and exam readiness.

PARAMETERS:
- Number of Questions: ${numQuestions}
- Difficulty Level: ${difficulty}

DIFFICULTY GUIDELINES:
${difficulty === 'easy' ? `
- Easy: Focus on fundamental concepts, definitions, and basic recall
- Test surface-level understanding and key terminology
- Direct questions with clear, unambiguous answers
- Help build student confidence and foundational knowledge
` : difficulty === 'medium' ? `
- Medium: Test application of concepts and deeper understanding
- Require students to connect ideas and analyze information
- Mix of recall and application-based questions
- Challenge students while remaining fair and achievable
` : difficulty === 'hard' ? `
- Hard: Require critical thinking, synthesis, and advanced analysis
- Test nuanced understanding and ability to evaluate complex scenarios
- Include edge cases and require multi-step reasoning
- Prepare students for the most challenging exam questions
` : `
- Mixed: Blend of easy (30%), medium (50%), and hard (20%) questions
- Progressive difficulty to build confidence then challenge mastery
- Comprehensive coverage across all cognitive levels
`}

        
        OUTPUT FORMAT (Strict JSON):
        {
            "title": "A short, relevant title for the quiz",
            "questions": [
                {
                    "id": 1,
                    "question": "Question text here...",
                    "options": [
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D"
                    ],
                    "correctAnswer": "The exact string of the correct option"
                }
            ]
        }
        
        RULES:
        1. Contextual Accuracy: All questions must be answerable from the text.
        2. Distractors: Wrong options should be plausible but clearly incorrect.
        3. Valid JSON: Return ONLY the JSON object, no markdown or conversational filler.
        `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "qwen/qwen-2.5-vl-7b-instruct:free",
                "messages": [{ "role": "user", "content": prompt }],
                "temperature": 0.3,
                "response_format": { "type": "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
        }

        const result: any = await response.json();
        let content = result.choices[0].message.content.trim();

        // Robust JSON extraction
        content = content.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            content = content.substring(jsonStart, jsonEnd + 1);
        }

        const quizData: QuizData = JSON.parse(content);

        // Basic validation
        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error("Invalid format: 'questions' array missing");
        }

        return quizData;

    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz");
    }
}
