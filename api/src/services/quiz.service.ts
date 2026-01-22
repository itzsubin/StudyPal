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
You are an elite educational assessment designer with expertise in creating exam-caliber questions. Your mission: craft ${numQuestions} multiple-choice questions that rigorously prepare students for competitive exams while building genuine understanding.

CORE OBJECTIVE:
Generate questions that mirror real exam formats, test deep comprehension, and help students identify knowledge gaps before the actual test.

PARAMETERS:
- Questions to Generate: ${numQuestions}
- Difficulty Level: ${difficulty}

DIFFICULTY SPECIFICATIONS:
${difficulty === 'easy' ? `
EASY MODE - Foundation Building:
• Focus on core concepts, definitions, and essential facts
• Test recognition and basic recall of key information
• Use straightforward language with clear answer choices
• Build student confidence while establishing baseline knowledge
• Questions should be answerable with fundamental understanding
` : difficulty === 'medium' ? `
MEDIUM MODE - Application & Analysis:
• Test ability to apply concepts to new situations
• Require connecting multiple ideas or analyzing relationships
• Include scenario-based questions that mirror exam contexts
• Balance accessibility with intellectual challenge
• Assess true comprehension beyond simple memorization
` : difficulty === 'hard' ? `
HARD MODE - Mastery & Critical Thinking:
• Demand synthesis of complex concepts and multi-step reasoning
• Test ability to evaluate, compare, and distinguish subtle differences
• Include edge cases and nuanced scenarios
• Prepare for the most challenging exam questions
• Require deep understanding and analytical thinking
` : `
MIXED MODE - Comprehensive Assessment:
• 30% Easy: Foundation questions for confidence
• 50% Medium: Core application and analysis questions  
• 20% Hard: Advanced critical thinking challenges
• Progressive difficulty curve throughout the quiz
• Comprehensive topic coverage at all cognitive levels
`}

QUESTION CRAFTING EXCELLENCE:

1. EXAM AUTHENTICITY
   • Mirror the style, tone, and complexity of real standardized exams
   • Focus on high-yield concepts frequently tested in actual assessments
   • Use professional, academic language appropriate for formal testing
   • Avoid overly casual or conversational phrasing

2. PRECISION & CLARITY
   • Every question must have ONE definitively correct answer
   • Eliminate ambiguity - questions should be crystal clear
   • Use precise terminology consistent with the source material
   • Ensure grammatical perfection in all questions and options

3. STRATEGIC DISTRACTOR DESIGN
   • Wrong answers must be believable to unprepared students
   • Base distractors on common misconceptions and typical errors
   • Include "almost correct" options that test careful reading
   • Avoid obviously absurd or joke answers
   • Use plausible numbers, terms, and concepts from related topics
   • Never make distractors longer or more detailed than correct answers

4. ANSWER OPTION ENGINEERING
   • Maintain similar length across all four options (avoid length bias)
   • Keep grammatical structure parallel across choices
   • Randomize correct answer positions (avoid patterns like "B" always being right)
   • Use specific, concrete language rather than vague terms
   • Ensure all options fit grammatically with the question stem

5. COMPETITIVE EXAM PREPARATION
   • Include questions that test attention to detail and careful reading
   • Cover the "most commonly missed" concepts in the subject area
   • Test ability to distinguish between closely related concepts
   • Prepare students for both straightforward and tricky exam formats
   • Build pattern recognition for typical exam question structures

6. COMPREHENSIVE COVERAGE
   • Distribute questions evenly across all major topics in the material
   • Avoid clustering too many questions on a single subtopic
   • Test both broad themes and specific details
   • Include a mix of conceptual and factual questions

7. COGNITIVE DIVERSITY
   • Remember/Recall: "What is...?" "Define..." "Identify..."
   • Understand: "Explain why..." "What is the relationship..."
   • Apply: "In this scenario..." "Which example demonstrates..."
   • Analyze: "Compare..." "What distinguishes..." "Why does..."
   • Evaluate: "Which is most effective..." "What is the best approach..."

CONTENT TO ANALYZE:
"""
${text.slice(0, 15000)}
"""

OUTPUT FORMAT:
Return ONLY valid JSON. No markdown code blocks, no explanatory text, no preamble - just the pure JSON object:

{
  "title": "Concise, descriptive quiz title reflecting the content",
  "questions": [
    {
      "id": 1,
      "question": "Precise, well-formed question text?",
      "options": [
        "First plausible answer option",
        "Second plausible answer option",
        "Third plausible answer option",
        "Fourth plausible answer option"
      ],
      "correctAnswer": "The exact string matching one of the options above"
    }
  ]
}

CRITICAL VALIDATION CHECKLIST:
✓ Exactly ${numQuestions} questions generated
✓ Each question has exactly 4 options
✓ correctAnswer matches one option string EXACTLY (character-perfect)
✓ All questions are directly answerable from the provided text
✓ No markdown formatting, code blocks, or conversational text
✓ Valid, parseable JSON structure
✓ Professional academic language throughout
✓ Varied question types and cognitive levels
✓ Strategic distractor placement
✓ Random distribution of correct answer positions

Generate the exam-quality quiz now.`;
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "qwen/qwen-2.5-vl-7b-instruct:free",
                "messages": [{ "role": "user", "content": prompt }],
                "temperature": 0.3
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

    } catch (error: any) {
        console.error("Error generating quiz:", error);
        throw new Error(`Quiz generation failed: ${error.message || error}`);
    }
}
