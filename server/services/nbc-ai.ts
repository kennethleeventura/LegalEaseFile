import OpenAI from "openai";
import { airtableMPC } from "./airtable-mpc.js";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ExhibitListItem {
  exhibitNumber: string;
  description: string;
  documentType: string;
  dateCreated: string;
  relevance: string;
  source: string;
}

interface FormPopulationData {
  caseNumber: string;
  clientName: string;
  documentType: string;
  jurisdiction: string;
  emergencyType?: string;
  priorFilings: string[];
  relatedCases: string[];
  suggestedContent: Record<string, any>;
}

export class NBCAIService {
  
  /**
   * Generate exhibit list based on existing case data
   */
  async generateExhibitList(caseId: string): Promise<ExhibitListItem[]> {
    try {
      // Get case data from Airtable MPC
      const caseData = await airtableMPC.getCase(caseId);
      if (!caseData) {
        throw new Error('Case not found');
      }

      // Get related cases and documents
      const relatedCases = await airtableMPC.searchCases({
        clientName: caseData.clientName,
        documentType: caseData.documentType
      });

      const systemPrompt = `You are NBC, an AI legal assistant specializing in Massachusetts Federal District Court procedures. 
      Generate a comprehensive exhibit list based on the case data provided. 
      Follow Federal Rules of Civil Procedure for exhibit formatting and numbering.
      
      Return a JSON array of exhibits with this structure:
      {
        "exhibitNumber": "A-1", 
        "description": "Brief description",
        "documentType": "Contract/Motion/Affidavit/etc",
        "dateCreated": "YYYY-MM-DD",
        "relevance": "How this exhibit supports the case",
        "source": "Where document originated"
      }`;

      const userPrompt = `Case Information:
      - Case Number: ${caseData.caseNumber}
      - Client: ${caseData.clientName}
      - Document Type: ${caseData.documentType}
      - Emergency Type: ${caseData.emergencyType || 'None'}
      - Filing Status: ${caseData.filingStatus}
      
      Related Cases: ${JSON.stringify(relatedCases.slice(0, 5), null, 2)}
      
      Generate a comprehensive exhibit list for this case, including all relevant documents that should be filed with the court.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{"exhibits": []}');
      return result.exhibits || [];

    } catch (error) {
      console.error('Error generating exhibit list:', error);
      throw new Error('Failed to generate exhibit list');
    }
  }

  /**
   * Auto-populate form fields based on existing case database
   */
  async autoPopulateForm(params: {
    clientName?: string;
    caseType?: string;
    documentType?: string;
    formType: string;
  }): Promise<FormPopulationData> {
    try {
      const { clientName, caseType, documentType, formType } = params;

      // Search for similar cases in the database
      const searchCriteria: any = {};
      if (clientName) searchCriteria.clientName = clientName;
      if (documentType) searchCriteria.documentType = documentType;

      const existingCases = await airtableMPC.searchCases(searchCriteria);
      
      const systemPrompt = `You are NBC, an AI legal assistant for Massachusetts Federal District Court.
      Based on existing case data, auto-populate form fields for a ${formType} form.
      
      Analyze the historical case data and suggest appropriate values for form fields.
      Include jurisdiction-specific requirements and Federal Rules compliance.
      
      Return JSON with this structure:
      {
        "caseNumber": "Generated case number format",
        "clientName": "Client name",
        "documentType": "Document type",
        "jurisdiction": "Massachusetts Federal District Court",
        "emergencyType": "If applicable",
        "priorFilings": ["List of related filings"],
        "relatedCases": ["Similar case numbers"],
        "suggestedContent": {
          "caption": "Case caption text",
          "background": "Case background summary",
          "legalBasis": "Legal authority citations",
          "relief": "Relief requested"
        }
      }`;

      const userPrompt = `Form Type: ${formType}
      Client Name: ${clientName || 'Not specified'}
      Case Type: ${caseType || 'Not specified'}  
      Document Type: ${documentType || 'Not specified'}
      
      Existing Cases Database:
      ${JSON.stringify(existingCases.slice(0, 10), null, 2)}
      
      Generate auto-populated form data based on this historical information.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;

    } catch (error) {
      console.error('Error auto-populating form:', error);
      throw new Error('Failed to auto-populate form');
    }
  }

  /**
   * Generate case insights based on database patterns
   */
  async generateCaseInsights(caseId: string): Promise<{
    similarCases: any[];
    riskFactors: string[];
    recommendations: string[];
    timelineEstimate: string;
    requiredDocuments: string[];
  }> {
    try {
      const caseData = await airtableMPC.getCase(caseId);
      if (!caseData) {
        throw new Error('Case not found');
      }

      // Get comprehensive case patterns
      const allCases = await airtableMPC.searchCases({});
      const similarCases = allCases.filter(c => 
        c.documentType === caseData.documentType ||
        c.emergencyType === caseData.emergencyType
      ).slice(0, 15);

      const systemPrompt = `You are NBC, an AI legal analyst for Massachusetts Federal District Court.
      Analyze case patterns and provide strategic insights based on historical data.
      
      Return JSON with this structure:
      {
        "similarCases": [{"caseNumber": "", "outcome": "", "timeline": ""}],
        "riskFactors": ["List of potential risks"],
        "recommendations": ["Strategic recommendations"],
        "timelineEstimate": "Expected timeline",
        "requiredDocuments": ["Essential documents needed"]
      }`;

      const userPrompt = `Current Case:
      ${JSON.stringify(caseData, null, 2)}
      
      Similar Historical Cases:
      ${JSON.stringify(similarCases, null, 2)}
      
      Provide comprehensive case insights and strategic recommendations.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;

    } catch (error) {
      console.error('Error generating case insights:', error);
      throw new Error('Failed to generate case insights');
    }
  }

  /**
   * Smart document template selection based on case database
   */
  async selectOptimalTemplate(caseData: {
    documentType: string;
    emergencyType?: string;
    clientName: string;
  }): Promise<{
    templateId: string;
    templateName: string;
    customizations: Record<string, any>;
    confidence: number;
  }> {
    try {
      // Get similar cases for template analysis
      const similarCases = await airtableMPC.searchCases({
        documentType: caseData.documentType
      });

      const systemPrompt = `You are NBC, an AI legal template selector for Massachusetts Federal District Court.
      Based on case history, select the optimal document template and suggest customizations.
      
      Return JSON with this structure:
      {
        "templateId": "Template identifier",
        "templateName": "Template display name", 
        "customizations": {
          "jurisdiction": "Mass. Fed. Dist. Court",
          "specialProvisions": ["List of special clauses needed"],
          "urgencyLevel": "standard|expedited|emergency"
        },
        "confidence": 0.95
      }`;

      const userPrompt = `Case Requirements:
      Document Type: ${caseData.documentType}
      Emergency Type: ${caseData.emergencyType || 'None'}
      Client: ${caseData.clientName}
      
      Historical Success Patterns:
      ${JSON.stringify(similarCases.slice(0, 8), null, 2)}
      
      Select the most effective template based on historical outcomes.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result;

    } catch (error) {
      console.error('Error selecting template:', error);
      throw new Error('Failed to select optimal template');
    }
  }
}

export const nbcAI = new NBCAIService();