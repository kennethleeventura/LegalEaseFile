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

// In-memory storage for demo mode when DB is not available
const memoryStorage = {
  users: new Map<string, User>(),
  documents: new Map<string, Document>(),
  filingHistory: new Map<string, FilingHistory>(),
  templates: new Map<string, DocumentTemplate>(),
  organizations: new Map<string, LegalAidOrganization>(),
};

// Initialize demo data
memoryStorage.users.set('demo-user', {
  id: 'demo-user',
  email: 'demo@legaleasefile.com',
  firstName: 'Demo',
  lastName: 'User',
  createdAt: new Date(),
});

// Add sample legal aid organizations to memory storage
const sampleLegalAidOrgs: LegalAidOrganization[] = [
  {
    id: '1',
    name: "Greater Boston Legal Services",
    description: "Free civil legal assistance for low-income individuals and families",
    website: "https://gbls.org",
    phone: "(617) 371-1234",
    email: "intake@gbls.org",
    address: "197 Friend Street, Boston, MA 02114",
    location: "boston",
    practiceAreas: JSON.stringify(["housing", "family", "immigration", "benefits", "consumer"]),
    availability: "immediate",
    isEmergency: false,
    servicesOffered: JSON.stringify(["Legal representation", "Self-help resources", "Community education"]),
    eligibilityRequirements: "Low-income individuals and families",
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: "Community Legal Aid",
    description: "Legal services for Central and Western Massachusetts",
    website: "https://communitylegal.org",
    phone: "(413) 781-7814",
    email: "info@communitylegal.org",
    address: "405 Main Street, Worcester, MA 01608",
    location: "worcester",
    practiceAreas: JSON.stringify(["family", "housing", "immigration", "benefits", "employment"]),
    availability: "immediate",
    isEmergency: true,
    servicesOffered: JSON.stringify(["Legal representation", "Emergency assistance", "Self-help clinics"]),
    eligibilityRequirements: "Low to moderate income",
    createdAt: Date.now(),
  },
  {
    id: '3',
    name: "Northeast Legal Aid",
    description: "Comprehensive legal services for Northeastern Massachusetts",
    website: "https://northeastlegalaid.org",
    phone: "(978) 458-1465",
    email: "intake@northeastlegalaid.org",
    address: "Lawrence, Lowell, Haverhill offices",
    location: "statewide",
    practiceAreas: JSON.stringify(["housing", "civil-rights", "benefits", "immigration"]),
    availability: "immediate",
    isEmergency: false,
    servicesOffered: JSON.stringify(["Legal representation", "Benefits advocacy", "Housing assistance"]),
    eligibilityRequirements: "125% of Federal Poverty Guidelines",
    createdAt: Date.now(),
  },
  {
    id: '4',
    name: "REACH (Domestic Violence)",
    description: "Emergency domestic violence legal assistance",
    website: "https://reachma.org",
    phone: "(800) 899-4000",
    email: "legal@reachma.org",
    address: "24-hour hotline service",
    location: "statewide",
    practiceAreas: JSON.stringify(["family", "civil-rights"]),
    availability: "emergency",
    isEmergency: true,
    servicesOffered: JSON.stringify(["24/7 hotline", "Emergency legal assistance", "Safety planning"]),
    eligibilityRequirements: "Domestic violence survivors",
    createdAt: Date.now(),
  },
];

// Initialize memory storage with legal aid organizations
sampleLegalAidOrgs.forEach(org => {
  memoryStorage.organizations.set(org.id, org);
});

// Add some sample document templates
const sampleTemplates: DocumentTemplate[] = [
  {
    id: '1',
    name: 'Motion for Temporary Restraining Order',
    category: 'emergency',
    description: 'Emergency motion for immediate court intervention',
    template: JSON.stringify({}),
    isEmergency: true,
    estimatedTime: "30 minutes",
    createdAt: Date.now(),
  },
  {
    id: '2', 
    name: 'Complaint for Civil Rights Violation',
    category: 'civil_rights',
    description: 'Standard complaint for civil rights violations under Section 1983',
    templateContent: 'COMPLAINT FOR VIOLATION OF CIVIL RIGHTS\n\nCOMES NOW the Plaintiff...',
    requiredFields: ['plaintiff_name', 'defendant_name', 'violation_details', 'damages_sought'],
    isEmergency: false,
    estimatedTime: 60,
  },
  {
    id: '3',
    name: 'Emergency Motion for Preliminary Injunction',
    category: 'emergency',
    description: 'Motion seeking preliminary injunctive relief',
    templateContent: 'EMERGENCY MOTION FOR PRELIMINARY INJUNCTION\n\nTO THE HONORABLE COURT:\n\nPlaintiff respectfully moves...',
    requiredFields: ['plaintiff_name', 'defendant_name', 'case_number', 'injunction_sought', 'irreparable_harm'],
    isEmergency: true,
    estimatedTime: 45,
  }
];

sampleTemplates.forEach(template => {
  memoryStorage.templates.set(template.id, template);
});

const useFallbackStorage = !process.env.DATABASE_URL;

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

  private throwIfNoDatabase() {
    if (!db) {
      throw new Error('Database not connected. Database features are disabled.');
    }
  }

  private async initializeData() {
    try {
      // Skip database initialization if database is not connected
      if (!db) {
        console.log('Database not connected, skipping data initialization');
        return;
      }
      
      // Check if we need to seed data
      const existingTemplates = await db.select().from(documentTemplates).limit(1);
      if (existingTemplates.length > 0) return;

      // First, create demo user for development
      await db.insert(users).values({
        id: 'demo-user',
        email: 'demo@legaleasefile.com',
        firstName: 'Demo',
        lastName: 'User',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }).onConflictDoNothing();

      // Initialize document templates - matching exact schema fields
      const templates = [
        // Barnstable County Probate Court Templates
        {
          name: "Petition for Probate of Will",
          description: "Petition to probate a will in Barnstable County Probate Court",
          category: "probate",
          jurisdiction: "MA",
          court_type: "state_probate",
          isEmergency: false,
          template: JSON.stringify({
            sections: ["petitioner_information", "deceased_information", "will_information", "assets_overview", "prayer_for_relief"],
            required_fields: ["petitioner_name", "deceased_name", "date_of_death", "domicile", "will_date", "assets_estimate"]
          }),
          rule_references: JSON.stringify(["Massachusetts General Laws Ch. 190B", "Probate Rule 6", "SJC Rule 3:09"]),
          compliance_requirements: JSON.stringify({
            filing_fee: 375,
            required_documents: ["certified_death_certificate", "original_will", "filing_fee"],
            notice_requirements: "Publication in local newspaper for 3 consecutive weeks",
            page_limit: "No specific limit",
            font_requirements: "12pt, Times New Roman or equivalent"
          }),
          estimatedTime: "45-60 minutes",
          popularity_score: 95,
          filing_fees: JSON.stringify({
            base_fee: 375,
            publication_fee: 150,
            certified_copies: 8.00
          }),
          last_rule_update: Date.now(),
        },
        {
          name: "Petition for Administration (Intestate)",
          description: "Petition for administration when no will exists",
          category: "probate",
          jurisdiction: "MA",
          court_type: "state_probate",
          isEmergency: false,
          template: JSON.stringify({
            sections: ["petitioner_information", "deceased_information", "heirs_information", "assets_overview", "prayer_for_relief"],
            required_fields: ["petitioner_name", "deceased_name", "date_of_death", "domicile", "heirs_list", "assets_estimate"]
          }),
          rule_references: JSON.stringify(["Massachusetts General Laws Ch. 190B §3-203", "Probate Rule 7"]),
          compliance_requirements: JSON.stringify({
            filing_fee: 375,
            required_documents: ["certified_death_certificate", "affidavit_of_heirs", "filing_fee"],
            notice_requirements: "Notice to all heirs and next of kin",
            bond_requirements: "Bond may be required based on estate value"
          }),
          estimatedTime: "60-75 minutes",
          popularity_score: 85,
          filing_fees: JSON.stringify({
            base_fee: 375,
            bond_fee_varies: true,
            publication_fee: 150
          }),
          last_rule_update: Date.now(),
        },
        {
          name: "Emergency Petition for Temporary Administration",
          description: "Emergency petition for immediate appointment of temporary administrator",
          category: "emergency",
          jurisdiction: "MA",
          court_type: "state_probate",
          isEmergency: true,
          template: JSON.stringify({
            sections: ["emergency_circumstances", "deceased_information", "immediate_need", "temporary_powers_requested", "notice_waiver"],
            required_fields: ["emergency_nature", "deceased_name", "urgent_matters", "requested_powers"]
          }),
          rule_references: JSON.stringify(["Massachusetts General Laws Ch. 190B §3-614", "Probate Rule 6"]),
          compliance_requirements: JSON.stringify({
            filing_fee: 375,
            emergency_fee: 100,
            expedited_processing: "Same day or next business day",
            notice_requirements: "Notice may be waived for emergency circumstances",
            hearing_timeline: "Within 48-72 hours"
          }),
          estimatedTime: "30-45 minutes",
          popularity_score: 70,
          filing_fees: JSON.stringify({
            base_fee: 375,
            emergency_fee: 100,
            expedited_service: 50
          }),
          last_rule_update: Date.now(),
        },
        {
          name: "Petition for Guardianship of Minor",
          description: "Petition for appointment of guardian for minor child",
          category: "guardianship",
          jurisdiction: "MA",
          court_type: "state_probate",
          isEmergency: false,
          template: JSON.stringify({
            sections: ["petitioner_information", "minor_information", "parents_information", "necessity_of_guardianship", "proposed_guardian_qualifications"],
            required_fields: ["petitioner_name", "minor_name", "minor_dob", "parents_status", "guardianship_reason"]
          }),
          rule_references: JSON.stringify(["Massachusetts General Laws Ch. 190B §5-203", "Probate Rule 24"]),
          compliance_requirements: JSON.stringify({
            filing_fee: 220,
            required_documents: ["birth_certificate", "consent_forms", "background_check"],
            notice_requirements: "Notice to parents, relatives, and interested parties",
            hearing_required: true,
            guardian_training: "Required within 30 days of appointment"
          }),
          estimatedTime: "90-120 minutes",
          popularity_score: 80,
          filing_fees: JSON.stringify({
            base_fee: 220,
            background_check: 25,
            certified_copies: 8.00
          }),
          last_rule_update: Date.now(),
        },
        {
          name: "Motion for Summary Judgment",
          description: "Standard motion template with AI-guided completion",
          category: "motion",
          jurisdiction: "FEDERAL",
          court_type: "federal_district",
          isEmergency: false,
          template: JSON.stringify({
            sections: ["introduction", "statement_of_facts", "legal_argument", "conclusion"],
            required_fields: ["case_number", "parties", "legal_basis"]
          }),
          rule_references: JSON.stringify(["Rule 56", "FRCP"]),
          compliance_requirements: JSON.stringify({
            page_limit: 25,
            font_size: "12pt",
            margins: "1 inch"
          }),
          estimatedTime: "15-20 minutes",
          popularity_score: 100,
          filing_fees: JSON.stringify({ base_fee: 350 }),
          last_rule_update: Date.now(),
        },
        {
          name: "Temporary Restraining Order",
          description: "Emergency TRO template with expedited filing guidance",
          category: "emergency",
          jurisdiction: "FEDERAL",
          court_type: "federal_district",
          isEmergency: true,
          template: JSON.stringify({
            sections: ["emergency_nature", "irreparable_harm", "likelihood_success", "balance_hardships"],
            required_fields: ["case_number", "parties", "emergency_facts", "relief_sought"]
          }),
          rule_references: JSON.stringify(["Rule 65(b)", "FRCP"]),
          compliance_requirements: JSON.stringify({
            notice_requirements: "ex parte or minimal notice",
            time_limit: "14 days maximum"
          }),
          estimatedTime: "30-45 minutes",
          popularity_score: 85,
          filing_fees: JSON.stringify({ base_fee: 350, expedited_fee: 100 }),
          last_rule_update: Date.now(),
        },
        {
          name: "Preliminary Injunction",
          description: "Motion template with Winter standard compliance",
          category: "emergency",
          jurisdiction: "FEDERAL",
          court_type: "federal_district",
          isEmergency: true,
          template: JSON.stringify({
            sections: ["likelihood_success", "irreparable_harm", "balance_equities", "public_interest"],
            required_fields: ["case_number", "parties", "legal_standard", "factual_basis"]
          }),
          rule_references: JSON.stringify(["Rule 65(a)", "FRCP", "Winter v. Natural Resources Defense Council"]),
          compliance_requirements: JSON.stringify({
            standard: "Winter four-factor test",
            notice_requirements: "full notice and hearing"
          }),
          estimatedTime: "45-60 minutes",
          popularity_score: 75,
          filing_fees: JSON.stringify({ base_fee: 350 }),
          last_rule_update: Date.now(),
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
    this.throwIfNoDatabase();
    const [user] = await db!.select().from(users).where(eq(users.id, id));
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
          updatedAt: Date.now(),
        },
      })
      .returning();
    return user;
  }

  // Document operations
  async getDocument(id: string): Promise<Document | undefined> {
    if (!db) {
      return memoryStorage.documents.get(id);
    }
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    if (!db) {
      return Array.from(memoryStorage.documents.values()).filter(d => d.userId === userId);
    }
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    if (!db) {
      const document: Document = {
        id: randomUUID(),
        ...insertDocument,
        status: "uploaded",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStorage.documents.set(document.id, document);
      return document;
    }
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
    if (!db) {
      return Array.from(memoryStorage.templates.values());
    }
    return await db.select().from(documentTemplates);
  }

  async getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined> {
    if (!db) {
      return memoryStorage.templates.get(id);
    }
    const [template] = await db.select().from(documentTemplates).where(eq(documentTemplates.id, id));
    return template;
  }

  async getDocumentTemplatesByCategory(category: string): Promise<DocumentTemplate[]> {
    if (!db) {
      return Array.from(memoryStorage.templates.values()).filter(t => t.category === category);
    }
    return await db.select().from(documentTemplates).where(eq(documentTemplates.category, category));
  }

  async getEmergencyTemplates(): Promise<DocumentTemplate[]> {
    if (!db) {
      return Array.from(memoryStorage.templates.values()).filter(t => t.isEmergency);
    }
    return await db.select().from(documentTemplates).where(eq(documentTemplates.isEmergency, true));
  }

  // Legal aid organization operations
  async getLegalAidOrganizations(): Promise<LegalAidOrganization[]> {
    if (!db) {
      return Array.from(memoryStorage.organizations.values());
    }
    return await db.select().from(legalAidOrganizations);
  }

  async searchLegalAidOrganizations(filters: {
    practiceArea?: string;
    location?: string;
    availability?: string;
    isEmergency?: boolean;
  }): Promise<LegalAidOrganization[]> {
    if (!db) {
      // Use memory storage when database is not available
      let results = Array.from(memoryStorage.organizations.values());

      // Apply filters
      if (filters.location) {
        results = results.filter(org =>
          org.location.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }

      if (filters.availability) {
        results = results.filter(org => org.availability === filters.availability);
      }

      if (filters.isEmergency !== undefined) {
        results = results.filter(org => org.isEmergency === filters.isEmergency);
      }

      if (filters.practiceArea) {
        results = results.filter(org => {
          const practiceAreas = JSON.parse(org.practiceAreas || "[]");
          return practiceAreas.some((area: string) =>
            area.toLowerCase().includes(filters.practiceArea!.toLowerCase())
          );
        });
      }

      return results;
    }

    // Database query for when database is available
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
      return results.filter(org => {
        const practiceAreas = JSON.parse(org.practiceAreas || "[]");
        return practiceAreas.some((area: string) =>
          area.toLowerCase().includes(filters.practiceArea!.toLowerCase())
        );
      });
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