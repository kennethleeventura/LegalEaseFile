import {
  type User,
  type InsertUser,
  type Document,
  type InsertDocument,
  type DocumentTemplate,
  type InsertDocumentTemplate,
  type LegalAidOrganization,
  type InsertLegalAidOrganization,
  type FilingHistory,
  type InsertFilingHistory,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private documents: Map<string, Document>;
  private documentTemplates: Map<string, DocumentTemplate>;
  private legalAidOrganizations: Map<string, LegalAidOrganization>;
  private filingHistory: Map<string, FilingHistory>;

  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.documentTemplates = new Map();
    this.legalAidOrganizations = new Map();
    this.filingHistory = new Map();
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize document templates
    const templates: DocumentTemplate[] = [
      {
        id: randomUUID(),
        name: "Motion for Summary Judgment",
        description: "Standard motion template with AI-guided completion",
        category: "motion",
        isEmergency: false,
        template: {
          sections: ["introduction", "statement_of_facts", "legal_argument", "conclusion"],
          required_fields: ["case_number", "parties", "legal_basis"]
        },
        estimatedTime: "15-20 minutes",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Temporary Restraining Order",
        description: "Emergency TRO template with expedited filing guidance",
        category: "emergency",
        isEmergency: true,
        template: {
          sections: ["emergency_nature", "irreparable_harm", "likelihood_success", "balance_hardships"],
          required_fields: ["case_number", "parties", "emergency_facts", "relief_sought"]
        },
        estimatedTime: "30-45 minutes",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Preliminary Injunction",
        description: "Motion template with Winter standard compliance",
        category: "emergency",
        isEmergency: true,
        template: {
          sections: ["likelihood_success", "irreparable_harm", "balance_equities", "public_interest"],
          required_fields: ["case_number", "parties", "legal_standard", "factual_basis"]
        },
        estimatedTime: "45-60 minutes",
        createdAt: new Date(),
      },
    ];

    templates.forEach(template => {
      this.documentTemplates.set(template.id, template);
    });

    // Initialize legal aid organizations with real Massachusetts data
    const legalAidOrgs: LegalAidOrganization[] = [
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
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
        createdAt: new Date(),
      },
    ];

    legalAidOrgs.forEach(org => {
      this.legalAidOrganizations.set(org.id, org);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      pacerAccountLinked: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Document operations
  async getDocument(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = {
      ...insertDocument,
      id,
      status: "uploaded",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(id, document);
    return document;
  }

  async updateDocument(id: string, updates: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) return undefined;
    
    const updatedDocument = {
      ...document,
      ...updates,
      updatedAt: new Date(),
    };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteDocument(id: string): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Document template operations
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return Array.from(this.documentTemplates.values());
  }

  async getDocumentTemplate(id: string): Promise<DocumentTemplate | undefined> {
    return this.documentTemplates.get(id);
  }

  async getDocumentTemplatesByCategory(category: string): Promise<DocumentTemplate[]> {
    return Array.from(this.documentTemplates.values()).filter(
      template => template.category === category
    );
  }

  async getEmergencyTemplates(): Promise<DocumentTemplate[]> {
    return Array.from(this.documentTemplates.values()).filter(
      template => template.isEmergency
    );
  }

  // Legal aid organization operations
  async getLegalAidOrganizations(): Promise<LegalAidOrganization[]> {
    return Array.from(this.legalAidOrganizations.values());
  }

  async searchLegalAidOrganizations(filters: {
    practiceArea?: string;
    location?: string;
    availability?: string;
    isEmergency?: boolean;
  }): Promise<LegalAidOrganization[]> {
    let results = Array.from(this.legalAidOrganizations.values());

    if (filters.practiceArea) {
      results = results.filter(org =>
        org.practiceAreas.some(area => 
          area.toLowerCase().includes(filters.practiceArea!.toLowerCase())
        )
      );
    }

    if (filters.location) {
      results = results.filter(org =>
        org.location.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.availability) {
      results = results.filter(org =>
        org.availability === filters.availability
      );
    }

    if (filters.isEmergency !== undefined) {
      results = results.filter(org => org.isEmergency === filters.isEmergency);
    }

    return results;
  }

  // Filing history operations
  async getFilingHistory(userId: string): Promise<FilingHistory[]> {
    return Array.from(this.filingHistory.values()).filter(
      filing => filing.userId === userId
    );
  }

  async createFilingHistory(insertFiling: InsertFilingHistory): Promise<FilingHistory> {
    const id = randomUUID();
    const filing: FilingHistory = {
      ...insertFiling,
      id,
      createdAt: new Date(),
    };
    this.filingHistory.set(id, filing);
    return filing;
  }

  async updateFilingHistory(id: string, updates: Partial<FilingHistory>): Promise<FilingHistory | undefined> {
    const filing = this.filingHistory.get(id);
    if (!filing) return undefined;
    
    const updatedFiling = { ...filing, ...updates };
    this.filingHistory.set(id, updatedFiling);
    return updatedFiling;
  }
}

export const storage = new MemStorage();
