import OpenAI from "openai";
import { type DocumentAnalysisResult } from "@shared/schema";
import { MACourtService, type CourtInfo } from "./ma-courts.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-openai-api-key" 
});

export class DocumentAnalysisService {
  async analyzeDocument(content: string, filename: string, courtId?: string): Promise<DocumentAnalysisResult & {
    courtValidation: {
      suggestedCourt: string;
      isValidForCourt: boolean;
      filingRequirements: string[];
    };
    complianceDetails: {
      hipaaCompliant: boolean;
      formatCompliant: boolean;
      contentComplete: boolean;
      issues: string[];
    };
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal document analysis expert for Massachusetts courts (Federal, State Superior, Probate & Family, District).
            Analyze documents for:
            1. Document type identification
            2. Appropriate court jurisdiction
            3. HIPAA compliance (medical info detection)
            4. Format compliance (signatures, headers, etc.)
            5. Content completeness
            
            Massachusetts Court Types:
            - Federal: Civil rights, federal law, bankruptcy, appeals
            - Superior: Felonies, civil >$25k, equity, appeals from district
            - Probate & Family: Divorce, custody, probate, guardianship, adoption
            - District: Misdemeanors, civil <$25k, small claims, housing
            
            Respond with JSON: {
              "docType": "specific document type",
              "jurisdiction": "recommended court type and location",
              "compliance": "overall compliance status",
              "recommendations": ["specific recommendations"],
              "extractedData": {"parties": "", "caseNumber": "", "dates": "", "amounts": ""},
              "suggestedCourt": "specific court ID",
              "hipaaCompliant": boolean,
              "formatCompliant": boolean,
              "contentComplete": boolean,
              "issues": ["specific issues found"]
            }`
          },
          {
            role: "user",
            content: `Analyze this Massachusetts legal document:
            Filename: ${filename}
            Content: ${content.slice(0, 4000)}
            ${courtId ? `Intended Court: ${courtId}` : ''}`
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Validate against court requirements
      const suggestedCourtId = result.suggestedCourt || 'barnstable-probate';
      const courtValidation = MACourtService.validateDocumentForCourt(
        result.docType || 'Unknown',
        courtId || suggestedCourtId
      );
      
      return {
        docType: result.docType || "Unknown Document Type",
        jurisdiction: result.jurisdiction || "Massachusetts",
        compliance: result.compliance || "Needs Review",
        recommendations: result.recommendations || ["Manual review required"],
        extractedData: result.extractedData || {},
        courtValidation: {
          suggestedCourt: suggestedCourtId,
          isValidForCourt: courtValidation.isValid,
          filingRequirements: courtValidation.requirements
        },
        complianceDetails: {
          hipaaCompliant: result.hipaaCompliant || false,
          formatCompliant: result.formatCompliant || false,
          contentComplete: result.contentComplete || false,
          issues: result.issues || []
        }
      };
    } catch (error) {
      throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateDocumentFromTemplate(templateData: any, userInputs: Record<string, any>): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal document generation specialist for Massachusetts Federal District Court.
            Generate a properly formatted legal document based on the template and user inputs provided.
            Follow CM/ECF formatting requirements including proper headers, signatures, and legal formatting.
            Ensure compliance with Massachusetts Federal District Court Local Rules.`
          },
          {
            role: "user",
            content: `Generate a legal document using this template: ${JSON.stringify(templateData)}
            With these user inputs: ${JSON.stringify(userInputs)}
            
            Requirements:
            - Include proper legal formatting
            - Add electronic signature placeholder "/s/"
            - Include required CM/ECF headers
            - Follow Massachusetts Federal District Court formatting standards`
          },
        ],
      });

      return response.choices[0].message.content || "";
    } catch (error) {
      throw new Error(`Failed to generate document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async validateEmergencyFiling(documentContent: string, filingType: 'TRO' | 'PRELIMINARY_INJUNCTION'): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const requirements = filingType === 'TRO' 
        ? "TRO requirements: immediate and irreparable injury, efforts to notify opposing party, specific facts in affidavit"
        : "Preliminary injunction requirements: Winter four-factor test (likelihood of success, irreparable harm, balance of equities, public interest)";

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal compliance expert for Massachusetts Federal District Court emergency filings.
            Validate the document against Federal Rule 65 and local court requirements.
            Respond with JSON: {
              "isValid": boolean,
              "issues": ["array of compliance issues"],
              "recommendations": ["array of specific recommendations"]
            }`
          },
          {
            role: "user",
            content: `Validate this ${filingType} document against these requirements:
            ${requirements}
            
            Document content: ${documentContent.slice(0, 3000)}`
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        isValid: result.isValid || false,
        issues: result.issues || ["Manual review required"],
        recommendations: result.recommendations || ["Consult with attorney"]
      };
    } catch (error) {
      throw new Error(`Failed to validate emergency filing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async extractDocumentData(content: string): Promise<Record<string, any>> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Extract key data from legal documents including case numbers, party names, dates, legal issues, and other relevant information.
            Respond with JSON containing the extracted data with clear key-value pairs.`
          },
          {
            role: "user",
            content: `Extract key data from this legal document: ${content.slice(0, 4000)}`
          },
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      throw new Error(`Failed to extract document data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const documentAnalysisService = new DocumentAnalysisService();
