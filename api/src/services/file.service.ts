import { Mistral } from '@mistralai/mistralai'

type MistralOCRResponse = {
    pages: {
        markdown: string
    }[]
}

export async function extractTextFromPDF(
    pdfBuffer: ArrayBuffer,
    apiKey: string
): Promise<string> {
    const client = new Mistral({ apiKey })

    // Convert ArrayBuffer to Base64
    const base64String = btoa(
        new Uint8Array(pdfBuffer)
            .reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    const dataUri = `data:application/pdf;base64,${base64String}`

    try {
        const ocrResponse = await client.ocr.process({
            model: "mistral-ocr-latest",
            document: {
                type: "document_url",
                documentUrl: dataUri
            },
            includeImageBase64: false
        })

        // Combine markdown from all pages
        return ocrResponse.pages.map(page => page.markdown).join('\n\n')
    } catch (error) {
        console.error('Mistral OCR Error:', error)
        throw new Error(`OCR failed: ${error instanceof Error ? error.message : String(error)}`)
    }
}
