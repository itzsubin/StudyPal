import { Hono } from 'hono';
import { extractTextFromPDF } from '../services/Files and AUTH/file.service';
import { validateContent } from '../services/Files and AUTH/content.service';

type Bindings = {
  MISTRAL_API_KEY: string
}

const upload = new Hono<{ Bindings: Bindings }>()

upload.post('/', async (c) => {
  try {
    const contentType = c.req.header('content-type') || ''

    // Case 1: for pasted text

    if (contentType.includes('application/json')) {
      const body = await c.req.json()
      const text = body.text?.trim()

      if (!text) {
        return c.json({ error: 'No text provided' }, 400)
      }

      const apiKey = c.env.MISTRAL_API_KEY
      if (!apiKey) {
        throw new Error('MISTRAL_API_KEY is not configured')
      }

      const validation = await validateContent(text, apiKey)
      if (!validation.isValid) {
        return c.json({
          error: validation.error || 'Invalid content',
          warning: true
        }, 400)
      }
      console.log('Valid text uploaded')
      return c.json({
        text,
        source: 'text'
      })
      console.log('Invalid text uploaded')
    }

    // Case 2: for uploaded file

    if (contentType.includes('multipart/form-data')) {
      const formData = await c.req.formData()
      const file = formData.get('file') as File

      if (!file) {
        return c.json({ error: 'No file uploaded' }, 400)
      }

      if (file.type !== 'application/pdf') {
        return c.json({ error: 'Only PDF files are supported' }, 400)
      }

      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        return c.json({ error: 'File too large. Maximum size is 50MB' }, 413)
      }


      const buffer = await file.arrayBuffer()

      const apiKey = c.env.MISTRAL_API_KEY
      if (!apiKey) {
        throw new Error('MISTRAL_API_KEY is not configured')
      }

      const extractedText = await extractTextFromPDF(buffer, apiKey)

      const validation = await validateContent(extractedText, apiKey)
      if (!validation.isValid) {
        return c.json({
          error: validation.error || 'Invalid content',
          warning: true
        }, 400)
      }

      return c.json({
        text: extractedText,
        source: 'pdf'
      })
    }

    console.log('Unsupported content type')
    return c.json({ error: 'Unsupported content type' }, 415)
  } catch (error) {
    console.error('Upload error:', error)
    return c.json({
      error: 'Failed to process upload',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

export default upload
