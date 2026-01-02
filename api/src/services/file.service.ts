type MistralOCRResponse = {
    text?: string
}

export async function extractTextFromPDF(
    pdfBuffer: ArrayBuffer,
    apiKey: string
): Promise<string> {

    const formData = new FormData()
    formData.append(
        'file',
        new Blob([pdfBuffer], { type: 'application/pdf' }),
        'document.pdf'
    )

    const response = await fetch('https://api.mistral.ai/v1/ocr', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        },
        body: formData
    })

    if (!response.ok) {
        const errText = await response.text()
        throw new Error(`OCR failed: ${response.status} - ${errText}`)
    }

    const data = (await response.json()) as MistralOCRResponse
    // Mistral returns extracted text here
    return data.text ?? ''
}
