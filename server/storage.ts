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
  users,
  documents,
  documentTemplates,
  legalAidOrganizations,
  filingHistory,
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

  // Subscription plan operations
  async getSubscriptionPlans(): Promise<any[]> {
    // Trial-to-subscription model - users pay after trial
    return [
      {
        id: "free_trial",
        name: "14-Day Free Trial",
        description: "Experience all features free - no credit card required to start",
        price: 0,
        priceId: null,
        interval: "trial",
        trialDays: 14,
        features: [
          "🎉 14-day FREE trial - no credit card to start",
          "✨ Full access to all premium features",
          "🤖 Unlimited AI document analysis",
          "📋 Complete template library (500+)",
          "🆘 Emergency filing support",
          "👥 Pro bono attorney network",
          "🔍 Advanced MPC AI insights",
          "📱 Mobile app access",
          "📤 All export formats",
          "🤝 Team collaboration (up to 5 members)",
          "📊 Analytics dashboard",
          "📞 Priority email support"
        ],
        limits: {
          documentsPerMonth: -1, // Unlimited during trial
          emergencyFilings: -1, // Unlimited during trial
          aiAnalysisMinutes: -1, // Unlimited during trial
          storageGB: -1, // Unlimited during trial
          collaborators: 5,
          templates: -1, // All templates during trial
          trialDays: 14
        },
        isActive: true,
        sortOrder: 1,
        badge: "🎉 START FREE",
        highlight: true,
        ctaText: "Start 14-Day Free Trial",
        afterTrial: "Choose a plan to continue"
      },
      {
        id: "essential_plan",
        name: "Essential Plan",
        description: "Perfect for solo practitioners and small firms",
        price: 29.99,
        priceId: "price_essential_monthly",
        interval: "month",
        annualPrice: 299.99, // 2 months free when paid annually
        annualDiscount: "17% OFF",
        features: [
          "✨ Continue all trial features seamlessly",
          "📋 Unlimited premium templates",
          "🤖 Unlimited AI document analysis",
          "🆘 Priority emergency filing",
          "👥 Team collaboration (10 members)",
          "📊 Advanced analytics dashboard",
          "📞 Priority email support",
          "📱 Mobile app access",
          "💾 Enhanced cloud storage (100GB)",
          "🔄 Document version control",
          "📤 Advanced export options",
          "🔍 Enhanced search capabilities"
        ],
        limits: {
          documentsPerMonth: -1,
          emergencyFilings: -1,
          aiAnalysisMinutes: -1,
          storageGB: 100,
          collaborators: 10,
          templates: -1
        },
        isActive: true,
        sortOrder: 2,
        badge: "MOST POPULAR",
        highlight: true,
        ctaText: "Continue with Essential",
        trialOffer: "First month 50% off - just $14.99"
      },
      {
        id: "professional_plan",
        name: "Professional Plan",
        description: "Advanced features for growing legal practices",
        price: 79.99,
        priceId: "price_professional_monthly",
        interval: "month",
        annualPrice: 799.99, // 2 months free when paid annually
        annualDiscount: "17% OFF",
        features: [
          "✨ Everything in Essential Plan",
          "🎨 Custom branding & white-label",
          "👥 Unlimited team collaboration",
          "🔌 API access & integrations",
          "📊 Advanced analytics & reporting",
          "📞 Priority phone support",
          "🏢 Advanced law firm management",
          "💼 Client portal & communication",
          "🔄 Advanced document workflows",
          "📈 Business intelligence & insights",
          "🎯 Custom template creation tools",
          "🔐 Enterprise-grade security",
          "⚡ Priority processing & filing",
          "🤝 Dedicated customer success manager"
        ],
        limits: {
          documentsPerMonth: -1,
          emergencyFilings: -1,
          aiAnalysisMinutes: -1,
          storageGB: 500,
          collaborators: -1,
          templates: -1,
          customBranding: true,
          apiAccess: true,
          prioritySupport: true,
          dedicatedManager: true
        },
        isActive: true,
        sortOrder: 3,
        badge: "BEST VALUE",
        ctaText: "Upgrade to Professional",
        trialOffer: "First month 40% off - just $47.99"
      },
      {
        id: "enterprise_plan",
        name: "Enterprise Plan",
        description: "Complete solution for large law firms and organizations",
        price: 199.99,
        priceId: "price_enterprise_monthly",
        interval: "month",
        annualPrice: 1999.99, // 2 months free when paid annually
        annualDiscount: "17% OFF",
        customPricing: true,
        features: [
          "✨ Everything in Professional Plan",
          "🏢 Multi-office & multi-location management",
          "🔐 Enterprise security & compliance suite",
          "🤖 Custom AI model training & deployment",
          "📊 Enterprise analytics & business intelligence",
          "🔌 Custom integrations & API development",
          "👨‍💼 Dedicated account manager & support team",
          "📞 24/7 priority support with SLA guarantee",
          "🎯 Custom template development service",
          "📈 Advanced reporting & data insights",
          "🔄 Enterprise-grade backups & disaster recovery",
          "🌐 Full white-label & co-branding options",
          "⚖️ Compliance reporting & audit trails",
          "🔒 SSO integration & advanced authentication",
          "📋 Custom workflows & automation",
          "🎓 Training & onboarding for unlimited users",
          "🔧 Custom feature development",
          "📱 Custom mobile app development"
        ],
        limits: {
          documentsPerMonth: -1,
          emergencyFilings: -1,
          aiAnalysisMinutes: -1,
          storageGB: -1,
          collaborators: -1,
          templates: -1,
          customBranding: true,
          apiAccess: true,
          prioritySupport: true,
          dedicatedSupport: true,
          ssoIntegration: true,
          customWorkflows: true,
          customDevelopment: true
        },
        isActive: true,
        sortOrder: 4,
        badge: "ENTERPRISE",
        ctaText: "Contact Sales",
        trialOffer: "Extended 30-day trial available"
      }
    ];
  }
}

export const storage = new DatabaseStorage();