import { Hono } from 'hono';
import { AuthService } from '../services/AUTH/auth.service';

const auth = new Hono();

// POST /auth/signup
auth.post('/signup', async (c) => {
    try {
        const { name, email, password } = await c.req.json();

        if (!email || !password || !name) {
            return c.json({ error: 'Missing required fields' }, 400);
        }

        const result = await AuthService.signup(name, email, password);
        return c.json(result, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
});

// POST /auth/login
auth.post('/login', async (c) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: 'Missing email or password' }, 400);
        }

        const result = await AuthService.login(email, password);
        return c.json(result);
    } catch (error: any) {
        return c.json({ error: error.message }, 401);
    }
});

export default auth;
