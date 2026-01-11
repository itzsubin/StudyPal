import { Hono } from 'hono'
import { cors } from 'hono/cors'
import upload from './routes/upload'
import recall from './routes/recall'
import note from './routes/note'


type Bindings = {
    OPENROUTER_API_KEY: string;
    MISTRAL_API_KEY: string;
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/*', cors())

app.get('/', (c) => c.text('AI Study Buddy API is running! 🚀'))

app.get('/health', (c) => {
    const status = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: {
            OPENROUTER_API_KEY: !!c.env.OPENROUTER_API_KEY ? 'Configured' : 'Missing',
            MISTRAL_API_KEY: !!c.env.MISTRAL_API_KEY ? 'Configured' : 'Missing',
        }
    };

    const isReady = !!c.env.OPENROUTER_API_KEY && !!c.env.MISTRAL_API_KEY;

    return c.json({
        ...status,
        healthy: isReady
    }, isReady ? 200 : 503);
});

app.route('/upload', upload)
app.route('/recall', recall)
app.route('/notes', note)



export default app