import { SmartNote } from '../../types/notes';

export async function generateExplanation(
    apiKey: string,
    note: SmartNote,
    fullText?: string
): Promise<string> {
    try {
        const noteContentText = note.content
            .map(item => `${item.type.toUpperCase()}: ${item.text}`)
            .join('\n');

        let prompt = `
You are an AI study assistant helping students understand their notes better.

TASK: Provide an extended explanation for the given note to deepen understanding.

INPUT:x
- Note title: ${note.title}
- Note topics: ${note.topics.join(', ')}
- Note content: 
${noteContentText}
${fullText ? `- Original source context: ${fullText}` : ''}

OUTPUT FORMAT:
Return a detailed explanation as plain text with **bold formatting** for key terms.

REQUIREMENTS:

1. STRUCTURE (3 sections):\n   - **Extended Context**: How this concept fits into the bigger picture\n   - **Real-World Application**: Practical examples and use cases\n   - **Study Tip**: Learning strategy or memory aid\n\n2. STYLE:\n   - Conversational but educational\n   - Build on what's already in the note (don't repeat verbatim)\n   - Add depth: examples, analogies, connections to other concepts\n   - Use **bold** to highlight important terms/phrases\n   - **Be concise**: Every sentence must add value\n\n3. LENGTH:\n   - **2-3 short paragraphs total** (one per section)\n   - Each paragraph: 2-3 sentences max\n   - Prioritize clarity over comprehensiveness\n   - Cut fluff, keep insights\n\n4. CONTENT FOCUS:\n   - Explain WHY this matters (not just WHAT it is)\n   - Connect to related concepts\n   - Provide concrete examples\n   - Include common misconceptions if relevant\n   - Suggest practical application or practice methods\n\n5. FORMATTING:\n   - Use **double asterisks** for emphasis\n   - One blank line between sections\n   - No headings needed (sections flow naturally)\n   - Use symbols sparingly (💡, ⚠️, ✓)\n\nEXAMPLE OUTPUT:\n\n**Extended Context:** Neural networks represent a fundamental shift from **rule-based programming** to learning patterns from data automatically. They build on **matrix operations** and **optimization theory**, forming the foundation for modern AI applications like image recognition and natural language processing.\n\n**Real-World Application:** **Google Photos** uses CNNs for face recognition, **Netflix** predicts your preferences, and **Tesla's Autopilot** detects pedestrians in real-time. The architecture you're studying powers billion-dollar industries.\n\n**Study Tip:** Hand-calculate a simple 2-3 neuron example to make **weights**, **biases**, and **activation functions** concrete. Try explaining it to someone unfamiliar with AI—teaching forces true understanding.\n\nNow provide a detailed explanation for this note:

Note Title: ${note.title}
Topics: ${note.topics.join(', ')}
Content: 
${noteContentText}`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                "messages": [{ "role": "user", "content": prompt }],
                "temperature": 0.3
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const result: any = await response.json();
        return result.choices[0].message.content.trim();
    } catch (error) {
        console.error("Error generating explanation:", error);
        throw new Error("Failed to generate explanation");
    }
}