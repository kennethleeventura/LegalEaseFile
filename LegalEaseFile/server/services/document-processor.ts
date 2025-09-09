import multer from 'multer';
import { Request } from 'express';

// Configure multer for file uploads
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  }
});

export class DocumentProcessor {
  static extractTextFromBuffer(buffer: Buffer, mimetype: string): string {
    try {
      switch (mimetype) {
        case 'text/plain':
          return buffer.toString('utf-8');
        case 'application/pdf':
          // For production, you would use a PDF parsing library like pdf-parse
          // For now, return a placeholder that indicates PDF processing is needed
          return `[PDF Document - ${buffer.length} bytes] - PDF text extraction would be implemented with pdf-parse library`;
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          // For production, you would use a library like mammoth for DOCX parsing
          return `[Word Document - ${buffer.length} bytes] - Word document text extraction would be implemented with mammoth library`;
        default:
          throw new Error(`Unsupported file type: ${mimetype}`);
      }
    } catch (error) {
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validateCMECFCompliance(documentContent: string): {
    isCompliant: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check for electronic signature
    if (!documentContent.includes('/s/')) {
      issues.push('Missing electronic signature (/s/)');
    }
    
    // Check for basic structure requirements
    if (!documentContent.toLowerCase().includes('case') && !documentContent.toLowerCase().includes('civil action')) {
      issues.push('Missing case identification');
    }
    
    // Check for proper formatting indicators
    if (documentContent.length < 100) {
      issues.push('Document appears too short for filing');
    }
    
    return {
      isCompliant: issues.length === 0,
      issues
    };
  }

  static formatForCMECF(documentContent: string, metadata: {
    caseNumber?: string;
    parties?: string;
    documentType?: string;
  }): string {
    const header = `
UNITED STATES DISTRICT COURT
FOR THE DISTRICT OF MASSACHUSETTS

${metadata.parties || '[PARTIES TO BE INSERTED]'}

Civil Action No. ${metadata.caseNumber || '[CASE NUMBER TO BE INSERTED]'}

${metadata.documentType || 'DOCUMENT'} 

`;

    const footer = `

Respectfully submitted,

/s/ [ATTORNEY NAME]
[Attorney Name]
[Bar Number]
[Address]
[Phone]
[Email]

`;

    return header + documentContent + footer;
  }
}
