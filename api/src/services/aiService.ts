export interface Flashcard {
  question: string;
  answer: string;
}

export class AIService {
  static async generateFlashcards(studyMaterial: string): Promise<{ flashcards: Flashcard[] }> {
    // We'll implement AI integration here
    console.log('Generating flashcards for:', studyMaterial.substring(0, 100));
    return { flashcards: [] };
  }

  static async answerQuestion(question: string, context: string): Promise<string> {
    // We'll implement chat functionality here
    return "AI answer will be implemented here";
  }
}