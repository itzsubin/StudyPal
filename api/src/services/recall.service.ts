
export interface RecallCard {
  id: number;
  question: string;
  answer: string;
}

export async function generateRecallCards(
  apiKey: string,
  text: string,
  limit: number = 15
): Promise<RecallCard[]> {
  try {
    const prompt = `
You are an expert study assistant creating active recall flashcards.

TASK: Create ${limit} high-quality recall flashcards from the provided text.

VALIDATION RULE:
You MUST check if the text below is suitable for studying/learning (e.g., textbook content, lecture notes, scientific papers, instructional guides).
If the text is NOT educational (e.g., creative writing, personal essay, fiction, marketing), return:
{"error": "NON_EDUCATIONAL_CONTENT"}

If it IS educational, follow these rules:

OUTPUT FORMAT (JSON):
{
  "flashcards": [
    {
      "id": 0,
      "question": "Clear, specific question",
      "answer": "Concise, complete answer"
    }
  ]
}

CARD QUALITY REQUIREMENTS:

1. QUESTION TYPES (Mix these):
   - Definition: "What is [concept]?"
   - Process: "How does [process] work?"
   - Comparison: "What's the difference between X and Y?"
   - Application: "When would you use [technique]?"
   - Cause/Effect: "Why does [phenomenon] occur?"

2. QUESTION STYLE:
   - Be specific and unambiguous
   - Test understanding, not memorization
   - Focus on ONE concept per card
   - Use clear, direct language
   - Examples: 
     ✓ "What are the three main types of neural networks?"
     ✗ "What can you tell me about neural networks?"

3. ANSWER STYLE:
   - Complete but concise (2-4 sentences ideal)
   - Include key details and context
   - Define technical terms if used
   - Use bullet points for lists
   - Examples:
     ✓ "The three main types are: 1) CNNs for image data, 2) RNNs for sequential data, 3) Transformers for attention-based tasks."
     ✗ "There are different types used for different purposes."

4. COVERAGE:
   - Prioritize core concepts and definitions
   - Include important formulas/equations
   - Cover key processes and workflows
   - Test understanding of relationships
   - Include practical applications

5. AVOID:
   - Yes/no questions (too easy)
   - Overly broad questions (too vague)
   - Trivial details (not exam-worthy)
   - Multiple unrelated concepts in one card

EXAMPLE GOOD CARDS:
{
  "flashcards": [
    {
      "id": 0,
      "question": "What is gradient descent and what problem does it solve?",
      "answer": "Gradient descent is an optimization algorithm that minimizes the loss function in machine learning. It works by iteratively adjusting model parameters in the direction of steepest descent (negative gradient) to find the optimal values that minimize prediction error."
    },
    {
      "id": 1,
      "question": "What are the three main strategies to prevent overfitting?",
      "answer": "1) **Regularization** (L1/L2): Adds penalty for model complexity. 2) **Dropout**: Randomly disables neurons during training. 3) **Early stopping**: Halts training when validation performance degrades."
    }
  ]
}
Text to process:
${text}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "xiaomi/mimo-v2-flash:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 0.3,
        "response_format": { "type": "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        throw new Error("Rate limit exceeded (429). Please wait a moment and try again.");
      }
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your configuration.");
      }
      if (response.status === 400) {
        throw new Error("Invalid request. The content may be too long or improperly formatted.");
      }
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const result: any = await response.json();
    let textResponse = result.choices[0].message.content;

    // More robust JSON extraction
    textResponse = textResponse
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Find the actual JSON object (handle cases where model adds explanation)
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in response");
    }

    textResponse = textResponse.substring(jsonStart, jsonEnd + 1);

    const data = JSON.parse(textResponse);

    // Phase 3: Turbo Validation Check
    if (data.error === "NON_EDUCATIONAL_CONTENT") {
      throw new Error("Content does not appear to be educational material");
    }

    if (!data.flashcards || !Array.isArray(data.flashcards)) {
      throw new Error("Invalid response format: missing flashcards array");
    }

    // Validate and sanitize each card
    const validCards = (data.flashcards as RecallCard[])
      .filter((card: RecallCard) => card.question && card.answer)
      .slice(0, limit)
      .map((card: RecallCard, index: number) => ({
        id: index,
        question: card.question.trim(),
        answer: card.answer.trim(),
      }));

    if (validCards.length === 0) {
      throw new Error("No valid flashcards generated");
    }

    const uniqueCards = validCards.filter((card: RecallCard, index: number, self: RecallCard[]) =>
      index === self.findIndex((c: RecallCard) =>
        c.question.toLowerCase().trim() === card.question.toLowerCase().trim()
      )
    );

    if (uniqueCards.length < validCards.length) {
      console.warn(`Removed ${validCards.length - uniqueCards.length} duplicate cards`);
    }

    return uniqueCards;

  } catch (error) {
    console.error("Error generating flashcards:", error);

    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response as JSON. The model returned invalid format.");
    }

    throw new Error((error as any).message || "Failed to generate flashcards");
  }
}