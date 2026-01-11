export async function validateContent(text: string, apiKey: string): Promise<{ isValid: boolean, error?: string }> {
    // 1. FAST Heuristic Check (Zero-lag)
    const keywords = ['chapter', 'lecture', 'lesson', 'unit', 'module', 'syllabus', 'curriculum', 'overview', 'introduction', 'summary', 'conclusion', 'proof', 'lemma', 'formula', 'equation', 'algorithm', 'complexity', 'derivation', 'experiment', 'methodology']

    const isLongEnough = text.length > 50
    if (!isLongEnough) {
        return { isValid: false, error: 'Content too short to be valid study material' }
    }
    return { isValid: true }
}
