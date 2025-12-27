export class Session implements DurableObject {
  constructor(private state: DurableObjectState, private env: any) {}

  async fetch(request: Request): Promise<Response> {
    return new Response('Session Durable Object is working!');
  }
}