import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { upload, DocumentProcessor } from "./services/document-processor";
import { documentAnalysisService } from "./services/openai";
import { airtableMPC } from "./services/airtable-mpc";
import { nbcAI } from "./services/nbc-ai";
import {
  insertDocumentSchema,
  insertFilingHistorySchema,
  type DocumentAnalysisResult,
  type EmergencyFilingRequest,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Document upload and analysis
  app.post("/api/documents/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Extract text content
      const textContent = DocumentProcessor.extractTextFromBuffer(
        req.file.buffer,
        req.file.mimetype
      );

      // Create document record
      const document = await storage.createDocument({
        userId,
        filename: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        content: req.file.buffer.toString('base64'),
        status: "uploaded",
        isEmergency: false,
      });

      // Analyze document with AI
      try {
        const analysis = await documentAnalysisService.analyzeDocument(
          textContent,
          req.file.originalname
        );

        // Update document with analysis
        await storage.updateDocument(document.id, {
          documentType: analysis.docType,
          aiAnalysis: analysis,
          status: "analyzed",
        });

        res.json({
          document,
          analysis,
          success: true,
        });
      } catch (analysisError) {
        // If AI analysis fails, still return the uploaded document
        res.json({
          document,
          analysis: null,
          success: true,
          warning: "Document uploaded but AI analysis failed",
        });
      }
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  // Get user documents
  app.get("/api/documents/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const documents = await storage.getDocumentsByUser(userId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch documents" 
      });
    }
  });

  // Get document templates
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getDocumentTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch templates" 
      });
    }
  });

  // Get emergency templates
  app.get("/api/templates/emergency", async (req, res) => {
    try {
      const templates = await storage.getEmergencyTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch emergency templates" 
      });
    }
  });

  // Generate document from template
  app.post("/api/documents/generate", async (req, res) => {
    try {
      const { templateId, userInputs, userId } = req.body;
      
      const template = await storage.getDocumentTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const generatedContent = await documentAnalysisService.generateDocumentFromTemplate(
        template.template,
        userInputs
      );

      // Format for CM/ECF
      const formattedContent = DocumentProcessor.formatForCMECF(
        generatedContent,
        userInputs
      );

      // Create document record
      const document = await storage.createDocument({
        userId,
        filename: `${template.name}_Generated.docx`,
        fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        fileSize: formattedContent.length,
        content: Buffer.from(formattedContent).toString('base64'),
        documentType: template.name,
        status: "generated",
        isEmergency: template.isEmergency,
      });

      res.json({ document, content: formattedContent });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate document" 
      });
    }
  });

  // Emergency filing validation
  app.post("/api/emergency/validate", async (req, res) => {
    try {
      const validationSchema = z.object({
        documentId: z.string(),
        filingType: z.enum(['TRO', 'PRELIMINARY_INJUNCTION']),
      });

      const { documentId, filingType } = validationSchema.parse(req.body);
      
      const document = await storage.getDocument(documentId);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }

      const content = Buffer.from(document.content || '', 'base64').toString('utf-8');
      const validation = await documentAnalysisService.validateEmergencyFiling(
        content,
        filingType
      );

      res.json(validation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Validation failed" 
      });
    }
  });

  // Legal aid organization search
  app.get("/api/legal-aid", async (req, res) => {
    try {
      const { practiceArea, location, availability, isEmergency } = req.query;
      
      const filters = {
        practiceArea: practiceArea as string,
        location: location as string,
        availability: availability as string,
        isEmergency: isEmergency === 'true',
      };

      const organizations = await storage.searchLegalAidOrganizations(filters);
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to search legal aid organizations" 
      });
    }
  });

  // Get all legal aid organizations
  app.get("/api/legal-aid/all", async (req, res) => {
    try {
      const organizations = await storage.getLegalAidOrganizations();
      res.json(organizations);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch legal aid organizations" 
      });
    }
  });

  // Create filing history entry
  app.post("/api/filing-history", async (req, res) => {
    try {
      const filingData = insertFilingHistorySchema.parse(req.body);
      const filing = await storage.createFilingHistory(filingData);
      res.json(filing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid filing data", errors: error.errors });
      }
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create filing history" 
      });
    }
  });

  // Get user filing history
  app.get("/api/filing-history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const history = await storage.getFilingHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch filing history" 
      });
    }
  });

  // Mock CM/ECF status check
  app.get("/api/cmecf/status", async (req, res) => {
    try {
      // Mock CM/ECF system status
      res.json({
        systemStatus: "online",
        version: "1.8.3",
        lastUpdated: new Date().toISOString(),
        maintenanceScheduled: false,
        emergencyFilingAvailable: true,
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to check CM/ECF status" 
      });
    }
  });

  // Mock PACER account linking
  app.post("/api/pacer/link", async (req, res) => {
    try {
      const { userId, pacerUsername } = req.body;
      
      // Mock PACER account validation
      if (!pacerUsername) {
        return res.status(400).json({ message: "PACER username is required" });
      }

      // Update user's PACER account status
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // In a real implementation, this would validate with PACER
      res.json({
        success: true,
        message: "PACER account linked successfully",
        linkedAt: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to link PACER account" 
      });
    }
  });

  // Airtable MPC Integration Routes
  
  // Create case in Airtable with MPC security
  app.post("/api/airtable/cases", async (req, res) => {
    try {
      const { caseNumber, clientName, documentType, filingStatus, emergencyType, attorneyAssigned } = req.body;
      
      if (!caseNumber || !clientName || !documentType) {
        return res.status(400).json({ message: "Case number, client name, and document type are required" });
      }
      
      const recordId = await airtableMPC.createCase({
        caseNumber,
        clientName,
        documentType,
        filingStatus: filingStatus || "Draft",
        emergencyType,
        attorneyAssigned,
        dateCreated: new Date().toISOString()
      });
      
      res.json({
        success: true,
        recordId,
        message: "Case created successfully in secure Airtable database"
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to create case"
      });
    }
  });
  
  // Get case from Airtable with decryption
  app.get("/api/airtable/cases/:recordId", async (req, res) => {
    try {
      const { recordId } = req.params;
      const caseData = await airtableMPC.getCase(recordId);
      
      res.json({
        success: true,
        case: caseData
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to retrieve case"
      });
    }
  });
  
  // Update case status
  app.patch("/api/airtable/cases/:recordId/status", async (req, res) => {
    try {
      const { recordId } = req.params;
      const { status, notes } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      await airtableMPC.updateCaseStatus(recordId, status, notes);
      
      res.json({
        success: true,
        message: "Case status updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to update case status"
      });
    }
  });
  
  // Search cases with filters
  app.get("/api/airtable/cases", async (req, res) => {
    try {
      const { caseNumber, documentType, filingStatus, emergencyType } = req.query;
      
      const cases = await airtableMPC.searchCases({
        caseNumber: caseNumber as string,
        documentType: documentType as string,
        filingStatus: filingStatus as string,
        emergencyType: emergencyType as string
      });
      
      res.json({
        success: true,
        cases,
        count: cases.length
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to search cases"
      });
    }
  });
  
  // Store document metadata with encryption
  app.post("/api/airtable/documents", async (req, res) => {
    try {
      const { caseId, fileName, fileType, fileSize, analysisResult, cmecfStatus } = req.body;
      
      if (!caseId || !fileName || !fileType || !fileSize) {
        return res.status(400).json({ message: "Case ID, file name, type, and size are required" });
      }
      
      const documentId = await airtableMPC.storeDocumentMetadata(caseId, {
        fileName,
        fileType,
        fileSize,
        analysisResult,
        cmecfStatus
      });
      
      res.json({
        success: true,
        documentId,
        message: "Document metadata stored securely"
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to store document metadata"
      });
    }
  });
  
  // Assign pro bono attorney
  app.post("/api/airtable/assign-attorney", async (req, res) => {
    try {
      const { caseId, attorneyName, organizationName, contactPhone, practiceAreas, emergencyAvailable } = req.body;
      
      if (!caseId || !attorneyName || !organizationName) {
        return res.status(400).json({ message: "Case ID, attorney name, and organization are required" });
      }
      
      await airtableMPC.assignProBonoAttorney(caseId, {
        attorneyName,
        organizationName,
        contactPhone: contactPhone || "",
        practiceAreas: practiceAreas || [],
        emergencyAvailable: emergencyAvailable || false
      });
      
      res.json({
        success: true,
        message: "Attorney assigned successfully"
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to assign attorney"
      });
    }
  });
  
  // Generate compliance report
  app.get("/api/airtable/reports/compliance", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const report = await airtableMPC.generateComplianceReport({
        start: startDate as string,
        end: endDate as string
      });
      
      res.json({
        success: true,
        report,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to generate compliance report"
      });
    }
  });

  // ===== NBC AI ENDPOINTS =====
  
  // Generate exhibit list from existing case database
  app.post("/api/nbc/exhibit-list/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      
      if (!caseId) {
        return res.status(400).json({ message: "Case ID is required" });
      }
      
      const exhibitList = await nbcAI.generateExhibitList(caseId);
      
      res.json({
        success: true,
        exhibitList,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to generate exhibit list"
      });
    }
  });
  
  // Auto-populate forms based on existing case database
  app.post("/api/nbc/auto-populate", async (req, res) => {
    try {
      const { clientName, caseType, documentType, formType } = req.body;
      
      if (!formType) {
        return res.status(400).json({ message: "Form type is required" });
      }
      
      const populatedData = await nbcAI.autoPopulateForm({
        clientName,
        caseType,
        documentType,
        formType
      });
      
      res.json({
        success: true,
        data: populatedData,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to auto-populate form"
      });
    }
  });
  
  // Generate case insights based on database patterns
  app.get("/api/nbc/insights/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      
      if (!caseId) {
        return res.status(400).json({ message: "Case ID is required" });
      }
      
      const insights = await nbcAI.generateCaseInsights(caseId);
      
      res.json({
        success: true,
        insights,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to generate case insights"
      });
    }
  });
  
  // Smart template selection based on case database
  app.post("/api/nbc/select-template", async (req, res) => {
    try {
      const { documentType, emergencyType, clientName } = req.body;
      
      if (!documentType || !clientName) {
        return res.status(400).json({ message: "Document type and client name are required" });
      }
      
      const template = await nbcAI.selectOptimalTemplate({
        documentType,
        emergencyType,
        clientName
      });
      
      res.json({
        success: true,
        template,
        selectedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to select optimal template"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
