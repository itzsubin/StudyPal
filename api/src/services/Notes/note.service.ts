import { SmartNote } from '../../types/notes';

export async function createNote(
    apiKey: string,
    text: string,
    limit: number = 20,
): Promise<SmartNote[]> {
    try {
        const prompt = `
You are an AI study assistant.
TASK: Create up to (${limit}) comprehensive smart notes from the provided text.


OUTPUT FORMAT (JSON):
{
  "notes": [
    {
      "id": unique_number,
      "title": "Concise, descriptive title (3-6 words)",
      "topics": ["Topic1", "Topic2", "Topic3"],
      "content": [
        { "type": "heading", "text": "Section Name" },
        { "type": "paragraph", "text": "Explanation text." },
        { "type": "bullet", "text": "Key point 1" }
      ]
    }
  ]
}

REQUIREMENTS:

1. STRUCTURE:
   - Create up to ${limit} notes (depending on content length)
   - Each note = one major concept/topic
   - Clear hierarchy: headings → paragraphs → bullets

2. TOPICS (Auto-generated tags):
   - Extract 2-5 relevant topics per note
   - Use specific, searchable terms
   - Examples: "Neural Networks", "Gradient Descent", "Data Preprocessing"

3. CONTENT TYPES:
   - **heading**: Main sections within a note
   - **paragraph**: Context, explanations, definitions
   - **bullet**: Key facts, steps, examples, formulas

4. HIGHLIGHTING:
   - Use **bold** for: key terms, formulas, important concepts
   - Format: Wrap text in **double asterisks**
   - Example: "**Gradient descent** is an optimization algorithm"

5. STYLE:
   - Write like study material, not AI output
   - Use clear, student-friendly language
   - Include examples where helpful
   - Keep bullets concise (1-2 sentences max)
   - Use symbols when appropriate (→, ⚠️, ✓)

6. PRIORITIZATION:
   - Focus on exam-worthy information
   - Highlight definitions, formulas, processes
   - Include "why it matters" context
   - Flag common mistakes/pitfalls

EXAMPLE NOTE:
{
  "id": 1,
  "title": "Overfitting in Machine Learning",
  "topics": ["Machine Learning", "Model Training", "Validation"],
  "content": [
    { "type": "heading", "text": "What is Overfitting?" },
    { "type": "paragraph", "text": "**Overfitting** occurs when a model learns training data too well, including noise and outliers, resulting in poor performance on new data." },
    { "type": "heading", "text": "Warning Signs" },
    { "type": "bullet", "text": "**High training accuracy** but low validation/test accuracy" },
    { "type": "bullet", "text": "**Model complexity** exceeds what the data can support" },
    { "type": "heading", "text": "Solutions" },
    { "type": "bullet", "text": "**Regularization (L1/L2)**: Add penalty for complex models" },
    { "type": "bullet", "text": "**Dropout**: Randomly disable neurons during training" },
    { "type": "bullet", "text": "**Early stopping**: Stop training when validation loss increases" },
    { "type": "paragraph", "text": "⚠️ **Common mistake**: Using the same data for training and validation causes data leakage!" }
  ]
}

Now analyze this content and generate Smart Notes:

Text to Process:
${text}
`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
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

            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const result: any = await response.json();
        let textResponse = result.choices[0].message.content;

        // More robust JSON extraction
        textResponse = textResponse
            .replace(/```json\s*/gi, "")
            .replace(/```\s*/g, "")
            .trim();

        const jsonStart = textResponse.indexOf('{');
        const jsonEnd = textResponse.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("No valid JSON found in AI response");
        }

        textResponse = textResponse.substring(jsonStart, jsonEnd + 1);
        let data: any;

        // Enhanced JSON extraction and sanitization
        try {
            // Attempt to clean specific common invalid JSON issues
            // 1. Remove control characters (newlines within strings that break parsing)
            const cleanJson = textResponse.replace(/[\x00-\x1F\x7F-\x9F]/g, (match: string) => {
                return "";
            });
            data = JSON.parse(cleanJson);
        } catch (e) {
            console.warn("Initial JSON parse failed, attempting strict repair...");
            try {
                data = JSON.parse(textResponse);
            } catch (err) {
                throw new Error("Failed to parse valid JSON from AI response: " + (err as Error).message);
            }
        }



        if (!data.notes || !Array.isArray(data.notes)) {
            throw new Error("Invalid response format: missing notes array");
        }

        const validNotes = data.notes.filter((note: SmartNote) =>
            note.id &&
            note.title &&
            Array.isArray(note.topics) &&
            Array.isArray(note.content)
        );

        if (validNotes.length === 0) {
            throw new Error("No valid notes generated from content");
        }


        return validNotes;
    } catch (error: any) {
        console.error("Error creating note:", error);
        throw new Error(error.message || "Failed to generate smart notes");
    }
}