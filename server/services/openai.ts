import OpenAI from "openai";
import { type DocumentAnalysisResult } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "your-openai-api-key" 
});

export class DocumentAnalysisService {
  async analyzeDocument(content: string, filename: string): Promise<DocumentAnalysisResult> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a legal document analysis expert specializing in Massachusetts Federal District Court filings. 
            Analyze the provided document and determine its type, compliance with CM/ECF requirements, and provide recommendations.
            Respond with JSON in this exact format: {
              "docType": "string - specific document type",
              "jurisdiction": "string - applicable jurisdiction",
              "compliance": "string - compliance status with specific issues",
              "recommendations": ["array of specific recommendations"],
              "extractedData": {"key": "value pairs of important data"}
            }`
          },
          {
            role: "user",
            content: `Analyze this legal document:
            Filename: ${filename}
            Content: ${content.slice(0, 4000)}` // Limit content to avoid token limits
          },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        docType: result.docType || "Unknown Document Type",
        jurisdiction: result.jurisdiction || "Massachusetts Federal District Court",
        compliance: result.compliance || "Needs Review",
        recommendations: result.recommendations || ["Manual review required"],
        extractedData: result.extractedData || {}
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
