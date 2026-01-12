export async function validateContent(text: string, mistralApiKey: string): Promise<{ isValid: boolean, error?: string }> {
    // 1. FAST Heuristic Check (Zero-lag)
    const educationalKeywords = [
        'chapter', 'lecture', 'lesson', 'unit', 'module', 'syllabus',
        'curriculum', 'overview', 'summary', 'conclusion', 'proof',
        'lemma', 'formula', 'equation', 'algorithm', 'derivation',
        'experiment', 'methodology', 'analysis', 'concept', 'theory'
    ];

    const isLongEnough = text.length > 50;
    if (!isLongEnough) {
        return { isValid: false, error: 'Content too short to be valid study material (min 50 chars)' };
    }

    // Calculate keyword density
    const lowerText = text.toLowerCase();
    const keywordMatches = educationalKeywords.filter(k => lowerText.includes(k));
    const keywordDensity = keywordMatches.length;

    // "Green Light" - If it looks overwhelmingly educational, pass it fast
    if (keywordMatches.length >= 3) {
        return { isValid: true };
    }

    // 2. Strict AI Check (Mistral)
    // If we're unsure (fewer than 3 keywords matched), ask Mistral
    try {
        const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${mistralApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "mistral-tiny",
                "messages": [
                    {
                        "role": "system",
                        "content": `You are a strict content filter for an educational platform. 
YOUR JOB: Determine if the user's text is suitable for creating legitimate study materials (flashcards/notes).
CRITERIA:
- ACCEPT: Educational content, articles, notes, textbooks, code explanations, tutorials.
- REJECT: Spam, gibberish, random characters, conversational chat (e.g. "hi how are you"), abusive content, or content with zero educational value.
RESPONSE FORMAT: Return ONLY a JSON object: {"isValid": boolean, "reason": "short string"}`
                    },
                    {
                        "role": "user",
                        "content": `Text to validate:\n${text.substring(0, 1000)}` // Limit context window
                    }
                ],
                "response_format": { "type": "json_object" }
            })
        });

        if (!response.ok) {
            console.warn("Mistral validation failed, falling back to permissive mode:", response.status);
            return { isValid: true };
        }

        const data: any = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        if (!content.isValid) {
            return { isValid: false, error: content.reason || "Content doesn't look like study material" };
        }

        return { isValid: true };

    } catch (error) {
        console.error("Mistral validation error:", error);
        return { isValid: true };
    }
}
