import { Hono } from 'hono'
import { extractTextFromPDF } from '../services/file.service'

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

      return c.json({
        text,
        source: 'text'
      })
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

      return c.json({
        text: extractedText,
        source: 'pdf'
      })
    }

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
