export const AI_PROMPTS = {
  generateFlashcards: `You are a helpful study assistant. Based on the following study material, generate 5-10 flashcards with clear questions and concise answers. Format the response as JSON: { "flashcards": [{"question": "Q1", "answer": "A1"}] }

Study material: {material}`,

  answerQuestion: `You are a helpful tutor. Answer the user's question based ONLY on the provided study material. Be concise and accurate.

Study material: {material}
User question: {question}
Answer:`
};

export const ERROR_MESSAGES = {
  invalidInput: 'Please provide valid study material',
  aiServiceError: 'Failed to generate flashcards',
  pdfParseError: 'Failed to parse PDF file'
};