import {
  type User,
  type UpsertUser,
  type Document,
  type InsertDocument,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type LegalAidOrganization,
  type InsertLegalAidOrganization,
  type FilingHistory,
  type InsertFilingHistory,
  type Case,
  type InsertCase,
  type Deadline,
  type InsertDeadline,
  type LegalResource,
  type InsertLegalResource,
  users,
  documents,
  documentTemplates,
  legalAidOrganizations,
  filingHistory,
  cases,
  deadlines,
  legalResources,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (authentication required)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser & { id?: string }): Promise<User>;

  // Document operations
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByUser(userId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<boolean>;

  // Document template operations
  getDocumentTemplates(): Promise<DocumentTemplate[]>;
  getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined>;
  getDocumentTemplatesByCategory(category: string): Promise<DocumentTemplate[]>;
  getEmergencyTemplates(): Promise<DocumentTemplate[]>;

  // Legal aid organization operations
  getLegalAidOrganizations(): Promise<LegalAidOrganization[]>;
  searchLegalAidOrganizations(filters: {
    practiceArea?: string;
    location?: string;
    availability?: string;
    isEmergency?: boolean;
  }): Promise<LegalAidOrganization[]>;

  // Filing history operations
  getFilingHistory(userId: string): Promise<FilingHistory[]>;
  createFilingHistory(filing: InsertFilingHistory): Promise<FilingHistory>;
  updateFilingHistory(id: string, updates: Partial<FilingHistory>): Promise<FilingHistory | undefined>;

  // Case management operations
  getUserCases(userId: string): Promise<Case[]>;
  getCase(id: string, userId: string): Promise<Case | undefined>;
  createCase(case_: InsertCase): Promise<Case>;
  updateCase(id: string, userId: string, updates: Partial<Case>): Promise<Case | undefined>;
  deleteCase(id: string, userId: string): Promise<boolean>;

  // Deadline management operations
  getUserDeadlines(userId: string): Promise<Deadline[]>;
  getDeadline(id: string, userId: string): Promise<Deadline | undefined>;
  createDeadline(deadline: InsertDeadline): Promise<Deadline>;
  updateDeadline(id: string, userId: string, updates: Partial<Deadline>): Promise<Deadline | undefined>;
  deleteDeadline(id: string, userId: string): Promise<boolean>;

  // Legal resources operations
  getLegalResources(filters: {
    type?: string;
    jurisdiction?: string;
    practiceArea?: string;
    search?: string;
  }): Promise<LegalResource[]>;
  incrementResourceUsage(id: string): Promise<void>;

  // Subscription plan operations
  getSubscriptionPlans(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with seed data if needed
    this.initializeData().catch(console.error);
  }

  private async initializeData() {
    try {
      // Check if we need to seed data
      const existingTemplates = await db.select().from(documentTemplates).limit(1);
      if (existingTemplates.length > 0) return;

      // Initialize document templates
      const templates = [
        {
          name: "Motion for Summary Judgment",
          description: "Standard motion template with AI-guided completion",
          category: "motion",
          isEmergency: false,
          template: {
            sections: ["introduction", "statement_of_facts", "legal_argument", "conclusion"],
            required_fields: ["case_number", "parties", "legal_basis"]
          },
          estimatedTime: "15-20 minutes",
        },
        {
          name: "Temporary Restraining Order",
          description: "Emergency TRO template with expedited filing guidance",
          category: "emergency",
          isEmergency: true,
          template: {
            sections: ["emergency_nature", "irreparable_harm", "likelihood_success", "balance_hardships"],
            required_fields: ["case_number", "parties", "emergency_facts", "relief_sought"]
          },
          estimatedTime: "30-45 minutes",
        },
        {
          name: "Preliminary Injunction",
          description: "Motion template with Winter standard compliance",
          category: "emergency",
          isEmergency: true,
          template: {
            sections: ["likelihood_success", "irreparable_harm", "balance_equities", "public_interest"],
            required_fields: ["case_number", "parties", "legal_standard", "factual_basis"]
          },
          estimatedTime: "45-60 minutes",
        },
      ];

      // Insert templates into database
      await db.insert(documentTemplates).values(templates);

      // Initialize legal aid organizations with real Massachusetts data
      const legalAidOrgs = [
        {
          name: "Greater Boston Legal Services",
          description: "Free civil legal assistance for low-income individuals and families",
          website: "https://gbls.org",
          phone: "(617) 371-1234",
          email: "intake@gbls.org",
          address: "197 Friend Street, Boston, MA 02114",
          location: "Boston + 31 surrounding cities/towns",
          practiceAreas: ["Housing", "Family Law", "Immigration", "Benefits", "Consumer Law"],
          availability: "immediate",
          isEmergency: false,
          servicesOffered: ["Legal representation", "Self-help resources", "Community education"],
          eligibilityRequirements: "Low-income individuals and families",
        },
        {
          name: "Massachusetts Law Reform Institute",
          description: "Statewide advocacy for civil rights and legal reform",
          website: "https://www.mlri.org",
          phone: "(617) 357-0700",
          email: "mlri@mlri.org",
          address: "99 Chauncy Street, Suite 500, Boston, MA 02111",
          location: "Statewide",
          practiceAreas: ["Civil Rights", "Family Law", "Real Estate", "Benefits"],
          availability: "within-week",
          isEmergency: false,
          servicesOffered: ["Policy advocacy", "Legal representation", "Technical assistance"],
          eligibilityRequirements: "Varies by program",
        },
        {
          name: "Community Legal Aid",
          description: "Legal services for Central and Western Massachusetts",
          website: "https://communitylegal.org",
          phone: "(413) 781-7814",
          email: "info@communitylegal.org",
          address: "405 Main Street, Worcester, MA 01608",
          location: "Central & Western MA",
          practiceAreas: ["Family Law", "Housing", "Immigration", "Benefits", "Employment"],
          availability: "immediate",
          isEmergency: true,
          servicesOffered: ["Legal representation", "Emergency assistance", "Self-help clinics"],
          eligibilityRequirements: "Low to moderate income",
        },
        {
          name: "Northeast Legal Aid",
          description: "Comprehensive legal services for Northeastern Massachusetts",
          website: "https://northeastlegalaid.org",
          phone: "(978) 458-1465",
          email: "intake@northeastlegalaid.org",
          address: "Lawrence, Lowell, Haverhill offices",
          location: "Northeastern MA",
          practiceAreas: ["Housing", "Consumer Debt", "Benefits", "Veterans", "Immigration"],
          availability: "immediate",
          isEmergency: false,
          servicesOffered: ["Legal representation", "Benefits advocacy", "Housing assistance"],
          eligibilityRequirements: "125% of Federal Poverty Guidelines",
        },
        {
          name: "REACH (Domestic Violence)",
          description: "Emergency domestic violence legal assistance",
          website: "https://reachma.org",
          phone: "(800) 899-4000",
          email: "legal@reachma.org",
          address: "24-hour hotline service",
          location: "Statewide",
          practiceAreas: ["Domestic Violence", "Family Law", "Safety Planning"],
          availability: "emergency",
          isEmergency: true,
          servicesOffered: ["24/7 hotline", "Emergency legal assistance", "Safety planning"],
          eligibilityRequirements: "Domestic violence survivors",
        },
      ];

      // Insert legal aid organizations into database
      await db.insert(legalAidOrganizations).values(legalAidOrgs);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser & { id?: string }): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Document operations
  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values({
        ...insertDocument,
        status: "uploaded",
      })
      .returning();
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const [document] = await db
      .update(documents)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  async deleteDocument(id: string): Promise<boolean> {
    const result = await db.delete(documents).where(eq(documents.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Document template operations
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates);
  }

  async getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined> {
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template;
  }

  async getDocumentTemplatesByCategory(category: string): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates).where(eq(documentTemplates.category, category));
  }

  async getEmergencyTemplates(): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates).where(eq(documentTemplates.isEmergency, true));
  }

  // Legal aid organization operations
  async getLegalAidOrganizations(): Promise<LegalAidOrganization[]> {
    return await db.select().from(legalAidOrganizations);
  }

  async searchLegalAidOrganizations(filters: {
    practiceArea?: string;
    location?: string;
    availability?: string;
    isEmergency?: boolean;
  }): Promise<LegalAidOrganization[]> {
    let query = db.select().from(legalAidOrganizations);
    const conditions = [];

    if (filters.location) {
      conditions.push(like(legalAidOrganizations.location, `%${filters.location}%`));
    }

    if (filters.availability) {
      conditions.push(eq(legalAidOrganizations.availability, filters.availability));
    }

    if (filters.isEmergency !== undefined) {
      conditions.push(eq(legalAidOrganizations.isEmergency, filters.isEmergency));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    const results = await query;

    // Filter by practice area in memory since it's an array field
    if (filters.practiceArea) {
      return results.filter(org =>
        org.practiceAreas.some(area => 
          area.toLowerCase().includes(filters.practiceArea!.toLowerCase())
        )
      );
    }

    return results;
  }

  // Filing history operations
  async getFilingHistory(userId: string): Promise<FilingHistory[]> {
    return await db.select().from(filingHistory).where(eq(filingHistory.userId, userId));
  }

  async createFilingHistory(insertFiling: InsertFilingHistory): Promise<FilingHistory> {
    const [filing] = await db.insert(filingHistory).values(insertFiling).returning();
    return filing;
  }

  async updateFilingHistory(id: string, updates: Partial<FilingHistory>): Promise<FilingHistory | undefined> {
    const [filing] = await db
      .update(filingHistory)
      .set(updates)
      .where(eq(filingHistory.id, id))
      .returning();
    return filing;
  }

  // Case management operations
  async getUserCases(userId: string): Promise<Case[]> {
    const userCases = await db
      .select()
      .from(cases)
      .where(eq(cases.userId, userId))
      .orderBy(cases.lastActivity);
    return userCases;
  }

  async getCase(id: string, userId: string): Promise<Case | undefined> {
    const [case_] = await db
      .select()
      .from(cases)
      .where(and(eq(cases.id, id), eq(cases.userId, userId)))
      .limit(1);
    return case_;
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const caseId = randomUUID();
    const [case_] = await db
      .insert(cases)
      .values({ ...insertCase, id: caseId })
      .returning();
    return case_;
  }

  async updateCase(id: string, userId: string, updates: Partial<Case>): Promise<Case | undefined> {
    const [case_] = await db
      .update(cases)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(cases.id, id), eq(cases.userId, userId)))
      .returning();
    return case_;
  }

  async deleteCase(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(cases)
      .where(and(eq(cases.id, id), eq(cases.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Deadline management operations
  async getUserDeadlines(userId: string): Promise<Deadline[]> {
    const userDeadlines = await db
      .select({
        id: deadlines.id,
        title: deadlines.title,
        description: deadlines.description,
        dueDate: deadlines.dueDate,
        deadlineType: deadlines.deadlineType,
        priority: deadlines.priority,
        status: deadlines.status,
        isRecurring: deadlines.isRecurring,
        recurringPattern: deadlines.recurringPattern,
        reminderSettings: deadlines.reminderSettings,
        completedAt: deadlines.completedAt,
        completedBy: deadlines.completedBy,
        notes: deadlines.notes,
        attachments: deadlines.attachments,
        courtRule: deadlines.courtRule,
        statuteReference: deadlines.statuteReference,
        createdAt: deadlines.createdAt,
        updatedAt: deadlines.updatedAt,
        caseId: deadlines.caseId,
        caseName: cases.caseName,
        caseNumber: cases.caseNumber,
      })
      .from(deadlines)
      .leftJoin(cases, eq(deadlines.caseId, cases.id))
      .where(eq(deadlines.userId, userId))
      .orderBy(deadlines.dueDate);
    return userDeadlines as any[];
  }

  async getDeadline(id: string, userId: string): Promise<Deadline | undefined> {
    const [deadline] = await db
      .select()
      .from(deadlines)
      .where(and(eq(deadlines.id, id), eq(deadlines.userId, userId)))
      .limit(1);
    return deadline;
  }

  async createDeadline(insertDeadline: InsertDeadline): Promise<Deadline> {
    const deadlineId = randomUUID();
    const [deadline] = await db
      .insert(deadlines)
      .values({ ...insertDeadline, id: deadlineId })
      .returning();
    return deadline;
  }

  async updateDeadline(id: string, userId: string, updates: Partial<Deadline>): Promise<Deadline | undefined> {
    const [deadline] = await db
      .update(deadlines)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(deadlines.id, id), eq(deadlines.userId, userId)))
      .returning();
    return deadline;
  }

  async deleteDeadline(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(deadlines)
      .where(and(eq(deadlines.id, id), eq(deadlines.userId, userId)));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Legal resources operations
  async getLegalResources(filters: {
    type?: string;
    jurisdiction?: string;
    practiceArea?: string;
    search?: string;
  }): Promise<LegalResource[]> {
    let query = db.select().from(legalResources);
    
    // For now, return hardcoded resources since we haven't seeded the database
    // In a real implementation, you would apply filters to the database query
    return [
      {
        id: "justia-case-law",
        title: "Justia Case Law",
        description: "Free access to millions of case law opinions from federal and state courts",
        url: "https://law.justia.com/cases/",
        resourceType: "case_law",
        jurisdiction: "Federal",
        practiceArea: null,
        court: null,
        isOfficial: false,
        isFree: true,
        rating: 4.5,
        usageCount: 1250,
        tags: ["comprehensive", "search", "free", "updated"],
        lastVerified: null,
        createdAt: new Date(),
      },
      // Add more hardcoded resources as needed
    ] as LegalResource[];
  }

  async incrementResourceUsage(id: string): Promise<void> {
    // For now, this is a no-op since we're using hardcoded data
    // In a real implementation, you would increment the usage count in the database
    console.log(`Tracking usage for resource: ${id}`);
  }

  // Subscription plan operations
  async getSubscriptionPlans(): Promise<any[]> {
    // Return hardcoded subscription plans for now
    return [
      {
        id: "basic",
        name: "Basic",
        description: "Perfect for individual filers with occasional legal needs",
        price: 29.99,
        priceId: "price_1QZixNJFx4DyG3C8MF9yzuGQ",
        interval: "month",
        features: [
          "5 documents per month",
          "AI document analysis",
          "Basic template library",
          "Email support",
          "Standard filing guidance"
        ],
        limits: {
          documentsPerMonth: 5,
          emergencyFilings: 1,
          aiAnalysisMinutes: 30
        },
        isActive: true,
        sortOrder: 1
      },
      {
        id: "professional",
        name: "Professional",
        description: "Ideal for frequent filers and small legal practices",
        price: 79.99,
        priceId: "price_professional_monthly",
        interval: "month",
        features: [
          "25 documents per month",
          "Advanced AI analysis",
          "Complete template library",
          "Priority support",
          "Emergency filing assistance",
          "Pro bono attorney directory",
          "MPC AI case insights"
        ],
        limits: {
          documentsPerMonth: 25,
          emergencyFilings: 5,
          aiAnalysisMinutes: 120
        },
        isActive: true,
        sortOrder: 2
      },
      {
        id: "enterprise",
        name: "Enterprise",
        description: "Comprehensive solution for legal organizations and high-volume users",
        price: 199.99,
        priceId: "price_enterprise_monthly",
        interval: "month",
        features: [
          "Unlimited documents",
          "Premium AI analysis",
          "Custom templates",
          "24/7 priority support",
          "Unlimited emergency filings",
          "Dedicated pro bono coordinator",
          "Advanced MPC AI features",
          "API access",
          "Team collaboration tools"
        ],
        limits: {
          documentsPerMonth: -1, // Unlimited
          emergencyFilings: -1, // Unlimited
          aiAnalysisMinutes: -1 // Unlimited
        },
        isActive: true,
        sortOrder: 3
      }
    ];
  }
}

export const storage = new DatabaseStorage();