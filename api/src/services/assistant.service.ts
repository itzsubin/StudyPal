
export async function generateHint(
    apiKey: string,
    question: string
): Promise<string> {
    try {
        const prompt = `
      You are an expert tutor. HINTS (max 15 words):
    - Provide a retrieval cue, not the answer
    - Examples: "Think about the relationship between X and Y"

      Question: ${question}
    `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "xiaomi/mimo-v2-flash:free",
                "messages": [{ "role": "user", "content": prompt }]
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.statusText}`);
        }

        const result: any = await response.json();
        return result.choices[0].message.content.trim();
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
      You are an expert tutor. EXPLANATIONS (max 50 words):
    - Add context or why it matters
    - Connect to related concepts   

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
                "model": "xiaomi/mimo-v2-flash:free",
                "messages": [{ "role": "user", "content": prompt }]
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

