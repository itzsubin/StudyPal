
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
You are an expert in cognitive science and spaced repetition learning systems.
Create ${limit} high-quality recall flashcards from the provided text that test active retrieval, NOT recognition.

CRITICAL: Output ONLY valid JSON with no markdown, no backticks, no preamble, no explanation:
{
  "flashcards": [
    {
      "id": 0,
      "question": "What mechanism does X use to achieve Y?",
      "answer": "X uses mechanism Z, which works by..."
    }
  ]
}

RECALL vs RECOGNITION (Important distinction):
✓ GOOD (Tests Recall): "How does photosynthesis convert light energy into chemical energy?"
✗ BAD (Tests Recognition): "Photosynthesis converts light into: a) heat b) chemical energy c) sound"
✓ GOOD: "What are the three main components of the cell theory?"
✗ BAD: "Does cell theory include the idea that all cells come from pre-existing cells?"

QUESTION STANDARDS (max 20 words):
- Start with: "What", "How", "Why", "Explain", "Describe", "What is the relationship between"
- Test ONE atomic concept per card (no compound questions)
- Require generation of answer from memory, not selection or yes/no
- Be specific and unambiguous with sufficient context
- Avoid: yes/no questions, true/false, multiple choice patterns
- Questions must be answerable from the provided text

EXAMPLES OF GOOD QUESTIONS:
- "How does the TCP protocol ensure reliable data transmission?"
- "What is the primary function of mitochondria in cellular respiration?"
- "Why does increasing temperature affect enzyme activity?"
- "Explain the relationship between supply and demand in market equilibrium"

EXAMPLES OF BAD QUESTIONS:
- "Is photosynthesis important?" (yes/no)
- "What is photosynthesis and how does it work and why is it important?" (compound)
- "The process that plants use is called ___?" (fill in blank/recognition)
- "Photosynthesis happens in: a) mitochondria b) chloroplasts" (multiple choice)

ANSWER STANDARDS (max 35 words):
- Direct, complete sentence that fully answers the question
- Include key terminology and specific details
- Focus on the core concept only
- Avoid filler words ("basically", "essentially", "generally speaking")
- Be technically accurate and precise
- Don't add unrelated context or tangents

EXAMPLES OF GOOD ANSWERS:
Question: "How does photosynthesis convert light energy?"
Answer: "Photosynthesis converts light energy into chemical energy by using chlorophyll to capture photons, which drive reactions that produce glucose from carbon dioxide and water."

EXAMPLES OF BAD ANSWERS:
- "It's a really important process" (too vague)
- "Well, basically photosynthesis is when..." (filler words)
- "Photosynthesis" (incomplete sentence)

COVERAGE STRATEGY:
- Prioritize core concepts, key definitions, and fundamental principles
- Include important processes, mechanisms, and relationships
- Cover main examples or applications mentioned in the text
- Progress from foundational to more complex concepts
- Ensure no duplicate concepts across cards
- Extract ${limit} distinct concepts - if text is short, create fewer high-quality cards

TECHNICAL REQUIREMENTS:
- IDs: sequential integers starting from 0
- Valid JSON only - must pass JSON.parse()
- Properly escape quotes and special characters in strings
- No markdown formatting, no code blocks, no explanatory text
- Return ONLY the JSON object

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
        "temperature": 0.7, // Balanced creativity and consistency
        "reasoning": { "enabled": true }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
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

    const data = JSON.parse(textResponse) as { flashcards: RecallCard[] };

    if (!data.flashcards || !Array.isArray(data.flashcards)) {
      throw new Error("Invalid response format: missing flashcards array");
    }

    // Validate and sanitize each card
    const validCards = data.flashcards
      .filter(card => card.question && card.answer) // Remove incomplete cards
      .slice(0, limit) // Enforce limit
      .map((card, index) => ({
        id: index,
        question: card.question.trim(),
        answer: card.answer.trim(),
      }));

    if (validCards.length === 0) {
      throw new Error("No valid flashcards generated");
    }

    return validCards;

  } catch (error) {
    console.error("Error generating flashcards:", error);

    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response as JSON. The model returned invalid format.");
    }

    throw new Error((error as any).message || "Failed to generate flashcards");
  }
}