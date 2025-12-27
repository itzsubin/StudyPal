export function validateStudyMaterial(material: string): boolean {
  if (!material) return false;
  return material.trim().length > 10;
}

export function extractTextFromPdf(pdfBuffer: ArrayBuffer): string {
  // For now, return a placeholder - we'll implement PDF parsing later
  return "PDF text extraction will be implemented here";
}