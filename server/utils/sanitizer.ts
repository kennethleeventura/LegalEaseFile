import { z } from 'zod';

export class InputSanitizer {
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  static sanitizeFilePath(input: string): string {
    if (!input) return '';
    return input
      .replace(/\.\./g, '')
      .replace(/[\/\\]/g, '')
      .replace(/[<>:"|?*]/g, '');
  }

  static sanitizeAirtableFilter(input: string): string {
    if (!input) return '';
    return input
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/[{}]/g, '');
  }

  static validateCaseData(data: any) {
    const schema = z.object({
      caseNumber: z.string().regex(/^[A-Z0-9-]+$/, 'Invalid case number format'),
      clientName: z.string().min(1).max(100),
      documentType: z.string().min(1).max(50),
      filingStatus: z.string().optional(),
      emergencyType: z.string().optional(),
      attorneyAssigned: z.string().optional()
    });
    return schema.parse(data);
  }
}