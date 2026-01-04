import { Mistral } from '@mistralai/mistralai'

export async function validateContent(text: string, apiKey: string): Promise<{ isValid: boolean, error?: string }> {
    // 1. Heuristic Check
    const keywords = ['chapter',
        'lecture',
        'lesson',
        'unit',
        'module',
        'syllabus',
        'curriculum',
        'overview',
        'introduction',
        'summary',
        'conclusion',
        'proof',
        'lemma',
        'formula',
        'equation',
        'algorithm',
        'complexity',
        'derivation',
        'experiment',
        'methodology']
    const lowerText = text.toLowerCase().slice(0, 1000)
    const hasKeywords = keywords.some(k => lowerText.includes(k))
    const isLongEnough = text.length > 50

    if (!isLongEnough) {
        return { isValid: false, error: 'Content too short to be valid study material' }
    }


    let isValid = hasKeywords

    // 2. AI Classification
    if (!isValid) {
        const client = new Mistral({ apiKey })
        try {
            const chatResponse = await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [{
                    role: 'user',
                    content: `Is the following text academic or study-related material (e.g. lecture notes, textbook, slides, assignments, research)? Answer ONLY one word: YES or NO. This is:\n\n${text.slice(0, 500)}`
                }]
            })

            let answer = 'NO'
            const content = chatResponse.choices?.[0]?.message?.content

            if (typeof content === 'string') {
                answer = content.trim().toUpperCase()
            } else if (Array.isArray(content)) {
                const firstChunk = content[0] as any
                if (firstChunk && typeof firstChunk.text === 'string') {
                    answer = firstChunk.text.trim().toUpperCase()
                }
            }

            if (answer.includes('YES')) {
                isValid = true
            }
        } catch (error) {
            console.error('Validation AI Error:', error)
            // If AI fails, strictly we might fail, or leniently pass? 
            // Let's assume fail on error for robustness or maybe return error?
            // For now, if AI crashes, validation fails.
        }
    }

    if (!isValid) {
        return { isValid: false, error: 'Content does not appear to be educational material' }
    }

    return { isValid: true }
}
