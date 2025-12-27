// Minimal test - no imports, no dependencies
export default {
  async fetch(request: Request): Promise<Response> {
    return new Response('AI Study Buddy API is running! 🚀');
  }
};