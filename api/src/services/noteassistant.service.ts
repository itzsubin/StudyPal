import { SmartNote } from '../types/notes';

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

INPUT:
- Note title: ${note.title}
- Note topics: ${note.topics.join(', ')}
- Note content: 
${noteContentText}
${fullText ? `- Original source context: ${fullText}` : ''}

OUTPUT FORMAT:
Return a detailed explanation as plain text with **bold formatting** for key terms.

REQUIREMENTS:

1. STRUCTURE (3 sections):
   - **Extended Context**: How this concept fits into the bigger picture
   - **Real-World Application**: Practical examples and use cases
   - **Study Tip**: Learning strategy or memory aid

2. STYLE:
   - Conversational but educational
   - Build on what's already in the note (don't repeat verbatim)
   - Add depth: examples, analogies, connections to other concepts
   - Use **bold** to highlight important terms/phrases

3. LENGTH:
   - 3-5 paragraphs total
   - Each section: 1-2 paragraphs
   - Comprehensive but scannable

4. CONTENT FOCUS:
   - Explain WHY this matters (not just WHAT it is)
   - Connect to related concepts
   - Provide concrete examples
   - Include common misconceptions if relevant
   - Suggest practical application or practice methods

5. FORMATTING:
   - Use **double asterisks** for emphasis
   - One blank line between sections
   - No headings needed (sections flow naturally)
   - Use symbols sparingly (💡, ⚠️, ✓)

EXAMPLE OUTPUT:

**Extended Context:** Neural networks represent a fundamental shift in how we approach problem-solving in computer science. Unlike traditional **rule-based programming**, neural networks learn patterns from data automatically. This concept builds on basic statistics and linear algebra, particularly **matrix operations** and **optimization theory**. Understanding neural networks is essential because they form the foundation for modern AI applications, from image recognition to natural language processing.

**Real-World Application:** Companies use neural networks constantly. **Google Photos** uses CNNs to recognize faces and objects in your photos. **Netflix** employs neural networks to predict which shows you'll enjoy. **Tesla's Autopilot** processes camera feeds through neural networks to detect pedestrians, traffic signs, and lane markings in real-time. Even your smartphone's voice assistant relies on **recurrent neural networks** to understand speech. The architecture you're studying now powers billion-dollar industries.

**Study Tip:** When learning neural networks, start by hand-calculating a simple example with 2-3 neurons. Draw the network diagram and manually compute forward propagation step-by-step. This makes abstract concepts like **weights**, **biases**, and **activation functions** concrete. Try explaining the concept to someone unfamiliar with AI—teaching forces you to truly understand the material. Practice implementing a basic network from scratch before using frameworks like TensorFlow.

Now provide a detailed explanation for this note:

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
                "model": "xiaomi/mimo-v2-flash:free",
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