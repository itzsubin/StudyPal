
export async function generateHint(
    apiKey: string,
    question: string
): Promise<string> {
    try {
        const prompt = `
      You are an expert tutor. Provide a retrieval cue (max 30 words) for the question.

      STRICT RULES:
      1. Start your response directly with "**Hint:** "
      2. Do NOT provide the answer
      3. Do NOT use conversational filler like "Here is a hint" or "Sure"
      4. Examples: "**Hint:** Think about the relationship between X and Y"

      Question: ${question}
    `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const result: any = await response.json();
        let content = result.choices[0].message.content.trim();

        content = content.replace(/^(here is a hint|sure, here's a hint|hint):?\s*/i, '');
        if (!content.startsWith('**Hint:**')) {
            content = `**Hint:** ${content}`;
        }
        return content;
    } catch (error) {
        console.error("Error generating hint:", error);
        throw new Error("Failed to generate hint");
    }
}

export async function generateExplanation(
    apiKey: string,
    question: string,
    answer: string
): Promise<string> {
    try {
        const prompt = `
      You are an expert tutor. Create a concise explanation (max 50 words) for the question and answer provided.

      STRICT RULES:
      1. Start your response directly with "**Explanation:** "
      2. Do NOT use conversational filler like "Here is an explanation" or "Certainly"
      3. Add context or why it matters
      4. Connect to related concepts   

      Question: ${question}
      Answer: ${answer}
    `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-nano-30b-a3b:free",
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const result: any = await response.json();
        let content = result.choices[0].message.content.trim();

        content = content.replace(/^(here is an explanation|certainly, here is an explanation|certainly|explanation):?\s*/i, '');
        if (!content.startsWith('**Explanation:**')) {
            content = `**Explanation:** ${content}`;
        }
        return content;
    } catch (error) {
        console.error("Error generating explanation:", error);
        throw new Error("Failed to generate explanation");
    }
}

