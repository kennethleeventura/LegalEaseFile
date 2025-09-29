import { airtableMPC } from './airtable-mpc.js';
import { mpcAI } from './mpc-ai.js';

interface ExhibitItem {
  exhibitNumber: string;
  description: string;
  documentType: string;
  dateCreated: string;
  relevance: string;
  source: string;
}

interface CourtReadyDocument {
  caseNumber: string;
  clientName: string;
  exhibits: ExhibitItem[];
  complianceChecks: {
    hipaaCompliant: boolean;
    federalRulesCompliant: boolean;
    cmecfReady: boolean;
    issues: string[];
  };
}

export class PDFExportService {
  
  async generateCourtReadyExhibitList(caseId: string): Promise<CourtReadyDocument> {
    try {
      // Get case data from Airtable
      const caseData = await airtableMPC.getCase(caseId);
      if (!caseData) {
        throw new Error('Case not found');
      }

      // Generate exhibit list using AI
      const exhibits = await mpcAI.generateExhibitList(caseId);

      // Run compliance checks
      const complianceChecks = await this.runComplianceChecks(caseData, exhibits);

      return {
        caseNumber: caseData.caseNumber,
        clientName: caseData.clientName,
        exhibits,
        complianceChecks
      };

    } catch (error) {
      console.error('Error generating court-ready document:', error);
      throw new Error('Failed to generate court-ready exhibit list');
    }
  }

  private async runComplianceChecks(caseData: any, exhibits: ExhibitItem[]): Promise<{
    hipaaCompliant: boolean;
    federalRulesCompliant: boolean;
    cmecfReady: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];
    
    // HIPAA Compliance Check
    let hipaaCompliant = true;
    if (this.containsHealthInfo(caseData) || this.containsHealthInfo(exhibits)) {
      // Check for proper redaction and consent
      if (!this.hasProperRedaction(caseData)) {
        hipaaCompliant = false;
        issues.push('HIPAA: Medical information requires proper redaction');
      }
    }

    // Federal Rules Compliance
    let federalRulesCompliant = true;
    if (exhibits.length === 0) {
      federalRulesCompliant = false;
      issues.push('Federal Rules: No exhibits provided for filing');
    }

    // Check exhibit numbering
    const exhibitNumbers = exhibits.map(e => e.exhibitNumber);
    if (new Set(exhibitNumbers).size !== exhibitNumbers.length) {
      federalRulesCompliant = false;
      issues.push('Federal Rules: Duplicate exhibit numbers found');
    }

    // CM/ECF Readiness
    let cmecfReady = true;
    if (!caseData.caseNumber || !caseData.caseNumber.match(/^\d{1,2}:\d{2}-cv-\d{5}/)) {
      cmecfReady = false;
      issues.push('CM/ECF: Invalid case number format for federal court');
    }

    return {
      hipaaCompliant,
      federalRulesCompliant,
      cmecfReady,
      issues
    };
  }

  private containsHealthInfo(data: any): boolean {
    const healthKeywords = ['medical', 'health', 'patient', 'diagnosis', 'treatment', 'hospital'];
    const dataStr = JSON.stringify(data).toLowerCase();
    return healthKeywords.some(keyword => dataStr.includes(keyword));
  }

  private hasProperRedaction(data: any): boolean {
    // Check for redaction markers like [REDACTED] or proper anonymization
    const dataStr = JSON.stringify(data);
    return dataStr.includes('[REDACTED]') || dataStr.includes('***');
  }

  async exportToPDF(courtDocument: CourtReadyDocument): Promise<Buffer> {
    // Generate PDF content
    const pdfContent = this.generatePDFContent(courtDocument);
    
    // For now, return as text buffer - in production, use a PDF library like puppeteer or jsPDF
    return Buffer.from(pdfContent, 'utf-8');
  }

  private generatePDFContent(document: CourtReadyDocument): string {
    let content = `
UNITED STATES DISTRICT COURT
FOR THE DISTRICT OF MASSACHUSETTS

${document.clientName}

Civil Action No. ${document.caseNumber}

EXHIBIT LIST

Pursuant to Federal Rule of Civil Procedure 26(a)(3), the following exhibits are submitted:

`;

    document.exhibits.forEach((exhibit, index) => {
      content += `
${exhibit.exhibitNumber}. ${exhibit.description}
   Document Type: ${exhibit.documentType}
   Date: ${exhibit.dateCreated}
   Relevance: ${exhibit.relevance}
   Source: ${exhibit.source}

`;
    });

    content += `
COMPLIANCE CERTIFICATION

HIPAA Compliance: ${document.complianceChecks.hipaaCompliant ? 'VERIFIED' : 'ISSUES FOUND'}
Federal Rules Compliance: ${document.complianceChecks.federalRulesCompliant ? 'VERIFIED' : 'ISSUES FOUND'}
CM/ECF Ready: ${document.complianceChecks.cmecfReady ? 'VERIFIED' : 'ISSUES FOUND'}

`;

    if (document.complianceChecks.issues.length > 0) {
      content += `
COMPLIANCE ISSUES TO RESOLVE:
${document.complianceChecks.issues.map(issue => `- ${issue}`).join('\n')}

`;
    }

    content += `
Respectfully submitted,

/s/ [ATTORNEY NAME]
[Attorney Name]
[Bar Number]
[Address]
[Phone]
[Email]

Certificate of Service: I hereby certify that a true and correct copy of the foregoing was served upon all parties of record via CM/ECF on ${new Date().toLocaleDateString()}.

/s/ [ATTORNEY NAME]
`;

    return content;
  }
}

export const pdfExportService = new PDFExportService();