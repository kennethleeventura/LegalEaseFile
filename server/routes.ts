import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import Stripe from "stripe";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { upload, DocumentProcessor } from "./services/document-processor";
import { documentAnalysisService } from "./services/openai";
import { airtableMPC } from "./services/airtable-mpc";
import { mpcAI } from "./services/mpc-ai";
import {
  insertDocumentSchema,
  insertFilingHistorySchema,
  type DocumentAnalysisResult,
  type EmergencyFilingRequest,
  type AuthenticatedUser,
} from "@shared/schema";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Subscription management
  app.post("/api/create-subscription", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has an active subscription
      if (user.stripeSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        if (subscription.status === 'active') {
          return res.json({
            subscriptionId: subscription.id,
            status: subscription.status
          });
        }
      }

      // Create Stripe customer if needed
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email || undefined,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          metadata: { userId }
        });
        customerId = customer.id;
        
        await storage.upsertUser({
          id: userId,
          stripeCustomerId: customerId
        });
      }

      // Create subscription - using a basic price for now
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: 'price_1QZixNJFx4DyG3C8MF9yzuGQ' }], // Basic plan price ID
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.upsertUser({
        id: userId,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status
      });

      res.json({
        subscriptionId: subscription.id,
        status: subscription.status
      });
    } catch (error: any) {
      console.error("Subscription creation error:", error);
      res.status(500).json({ message: "Failed to create subscription", error: error.message });
    }
  });

  // Get subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });
  
  // Document upload and analysis (authenticated)
  app.post("/api/documents/upload", isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = req.user.claims.sub;

      // Extract text content
      const textContent = await DocumentProcessor.extractTextFromBuffer(
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

  // Get user filing history (authenticated)
  app.get("/api/filing-history/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getFilingHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch filing history" 
      });
    }
  });

  // CM/ECF system status check (requires PACER account)
  app.get("/api/cmecf/status", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "User ID not found in claims" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user || !user.pacerAccountLinked) {
        return res.status(400).json({
          message: "PACER account required",
          requiresPacer: true
        });
      }

      // Real CM/ECF status would require PACER API integration
      // For now, return error until real PACER credentials are provided
      res.status(503).json({
        message: "CM/ECF integration requires valid PACER API credentials",
        requiresSetup: true
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to check CM/ECF status" 
      });
    }
  });

  // PACER account linking (requires real PACER credentials)
  app.post("/api/pacer/link", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as AuthenticatedUser)?.claims?.sub;
      
      if (!userId) {
        return res.status(401).json({ message: "User ID not found in claims" });
      }
      
      const { pacerUsername, pacerPassword } = req.body;
      
      if (!pacerUsername || !pacerPassword) {
        return res.status(400).json({ 
          message: "PACER username and password are required for account linking" 
        });
      }

      // Real PACER validation would happen here
      // This requires actual PACER API integration which needs valid credentials
      res.status(501).json({
        message: "PACER integration requires valid API credentials and approval from PACER/Administrative Office",
        documentation: "https://pacer.uscourts.gov/help/pacer-case-management-electronic-case-files-cm-ecf",
        requiresApproval: true
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

  // ===== MPC AI ENDPOINTS =====
  
  // Generate exhibit list from existing case database
  app.post("/api/mpc/exhibit-list/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      
      if (!caseId) {
        return res.status(400).json({ message: "Case ID is required" });
      }
      
      const exhibitList = await mpcAI.generateExhibitList(caseId);
      
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
  app.post("/api/mpc/auto-populate", async (req, res) => {
    try {
      const { clientName, caseType, documentType, formType } = req.body;
      
      if (!formType) {
        return res.status(400).json({ message: "Form type is required" });
      }
      
      const populatedData = await mpcAI.autoPopulateForm({
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
  app.get("/api/mpc/insights/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      
      if (!caseId) {
        return res.status(400).json({ message: "Case ID is required" });
      }
      
      const insights = await mpcAI.generateCaseInsights(caseId);
      
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
  app.post("/api/mpc/select-template", async (req, res) => {
    try {
      const { documentType, emergencyType, clientName } = req.body;
      
      if (!documentType || !clientName) {
        return res.status(400).json({ message: "Document type and client name are required" });
      }
      
      const template = await mpcAI.selectOptimalTemplate({
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
