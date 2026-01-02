import { Hono } from 'hono'
import { cors } from 'hono/cors'
import upload from './routes/upload'


const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => c.text('AI Study Buddy API is running! 🚀'))
app.route('/upload', upload)


export default app