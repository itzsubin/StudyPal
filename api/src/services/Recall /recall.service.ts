
export interface RecallCard {
  id: number;
  question: string;
  answer: string;
}

export async function generateRecallCards(
  apiKey: string,
  text: string,
  limit: number = 10
): Promise<RecallCard[]> {
  try {
    const prompt = `
You are an expert study assistant.
TASK: Create ${limit} high-quality active recall flashcards from the provided text.

OUTPUT FORMAT (JSON ONLY):
You must output a valid JSON object containing an array of flashcards.
Do not output any text, markdown, or explanations before or after the JSON.
Do not use code blocks like \`\`\`json. Just raw JSON.

Structure:
{
  "flashcards": [
    {
      "id": 0,
      "question": "Question text here?",
      "answer": "Answer text here."
    }
  ]
}

RULES:
1. Create exactly ${limit} cards if possible.
2. Questions should be specific and clear.
3. Answers should be concise (1-3 sentences).
4. Focus on key concepts, definitions, and important details.
5. If the text is not educational or meaningful, return an empty array: { "flashcards": [] }

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
        "model": "nvidia/nemotron-3-nano-30b-a3b:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ],
        "temperature": 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      // ... error handling ...
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

    // Check for provider-specific errors
    if (result.error && result.error.code === 524) {
      throw new Error("The AI model timed out (524). Please try again with shorter text or fewer cards.");
    }

    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error("Unexpected API response structure:", JSON.stringify(result));
      throw new Error(`Invalid API response: 'choices' missing. Received: ${JSON.stringify(result)}`);
    }
    let textResponse = result.choices[0].message.content;

    // More robust JSON extraction
    textResponse = textResponse
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Find the actual JSON object
    const jsonStart = textResponse.indexOf('{');
    const jsonEnd = textResponse.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("No valid JSON found in response");
    }

    textResponse = textResponse.substring(jsonStart, jsonEnd + 1);

    const data = JSON.parse(textResponse);

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