import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// SQLite imports for local development
import {
  sqliteTable as createTable,
  text,
  integer,
  real,
  index,
  unique
} from "drizzle-orm/sqlite-core";

// Session storage table for authentication
export const sessions = createTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: text("sess").notNull(), // JSON as text in SQLite
    expire: integer("expire").notNull(), // Unix timestamp
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table with authentication and subscription fields
export const users = createTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  pacerAccountLinked: integer("pacer_account_linked", { mode: "boolean" }).default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // inactive, active, canceled, past_due
  subscriptionTier: text("subscription_tier").default("free"), // free, basic, pro, enterprise
  subscriptionStartDate: integer("subscription_start_date"), // Unix timestamp
  subscriptionEndDate: integer("subscription_end_date"), // Unix timestamp
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const documents = createTable("documents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  content: text("content"), // base64 or file path
  documentType: text("document_type"), // AI-detected type
  aiAnalysis: text("ai_analysis"), // JSON as text in SQLite
  status: text("status").notNull().default("uploaded"), // uploaded, analyzed, validated, filed
  isEmergency: integer("is_emergency", { mode: "boolean" }).default(false),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

export const documentTemplates = createTable("document_templates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // motion, pleading, discovery, etc.
  jurisdiction: text("jurisdiction").notNull(), // state abbreviation (CA, NY, TX, etc.) or "FEDERAL"
  court_type: text("court_type").notNull(), // "state_trial", "state_appellate", "federal_district", "federal_appellate", "federal_supreme"
  isEmergency: integer("is_emergency", { mode: "boolean" }).default(false),
  template: text("template").notNull(), // JSON as text in SQLite
  rule_references: text("rule_references"), // JSON array of applicable court rules
  compliance_requirements: text("compliance_requirements"), // JSON object of formatting/filing requirements
  estimatedTime: text("estimated_time"),
  popularity_score: integer("popularity_score").default(0), // for ranking templates
  filing_fees: text("filing_fees"), // JSON object with fee structure
  last_rule_update: integer("last_rule_update").$defaultFn(() => Date.now()),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

export const legalAidOrganizations = createTable("legal_aid_organizations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  location: text("location").notNull(), // city/region
  practiceAreas: text("practice_areas").notNull(), // JSON array as text
  availability: text("availability"), // immediate, emergency, within-week
  isEmergency: integer("is_emergency", { mode: "boolean" }).default(false),
  servicesOffered: text("services_offered"), // JSON array as text
  eligibilityRequirements: text("eligibility_requirements"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

export const filingHistory = createTable("filing_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  documentId: text("document_id").references(() => documents.id),
  filingType: text("filing_type").notNull(),
  status: text("status").notNull(), // draft, submitted, filed, rejected
  courtResponse: text("court_response"),
  filedAt: integer("filed_at"), // Unix timestamp
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Subscription plans and pricing
export const subscriptionPlans = createTable("subscription_plans", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(), // Free, Basic, Pro, Enterprise
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(), // Monthly price in USD
  yearlyPrice: real("yearly_price"), // Yearly price (with discount)
  stripePriceId: text("stripe_price_id"),
  stripeYearlyPriceId: text("stripe_yearly_price_id"),
  features: text("features").notNull(), // JSON array as text
  limits: text("limits").notNull(), // JSON object as text
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// MPC case data cache (stores Airtable data locally for performance)
export const mpcCaseData = createTable("mpc_case_data", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  airtableRecordId: text("airtable_record_id").notNull().unique(),
  caseNumber: text("case_number"),
  caseType: text("case_type"),
  jurisdiction: text("jurisdiction"),
  exhibits: text("exhibits"), // JSON array as text
  templates: text("templates"), // JSON array as text
  insights: text("insights"), // JSON object as text
  encryptedData: text("encrypted_data"), // AES-256 encrypted sensitive data
  lastSyncedAt: integer("last_synced_at").$defaultFn(() => Date.now()),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Tier 1 Feature: Intelligent Case Assessment & Triage
export const caseAssessments = createTable("case_assessments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  caseType: text("case_type").notNull(),
  jurisdiction: text("jurisdiction").notNull(),
  factPattern: text("fact_pattern").notNull(), // User's case description
  aiAnalysis: text("ai_analysis"), // JSON object with AI assessment
  recommendedForms: text("recommended_forms"), // JSON array of suggested templates
  deadlines: text("deadlines"), // JSON array of critical deadlines
  statuteOfLimitations: text("statute_of_limitations"), // JSON object with SOL info
  riskAssessment: text("risk_assessment"), // JSON object with risk factors
  strategicRecommendations: text("strategic_recommendations"), // JSON array
  estimatedComplexity: text("estimated_complexity"), // "simple", "moderate", "complex"
  estimatedCost: real("estimated_cost"),
  status: text("status").default("draft"), // "draft", "active", "completed"
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
  updatedAt: integer("updated_at").$defaultFn(() => Date.now()),
});

// Tier 1 Feature: E-Filing Integration Hub
export const eFilingIntegrations = createTable("e_filing_integrations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(), // "CM/ECF", "Tyler", "File&ServeXpress", etc.
  jurisdiction: text("jurisdiction").notNull(),
  courtSystem: text("court_system").notNull(), // "federal", "state", "local"
  apiEndpoint: text("api_endpoint"),
  apiVersion: text("api_version"),
  supportedDocumentTypes: text("supported_document_types"), // JSON array
  filingFees: text("filing_fees"), // JSON object with fee structure
  maxFileSize: integer("max_file_size"), // in bytes
  supportedFormats: text("supported_formats"), // JSON array ["PDF", "DOC", etc.]
  authenticationMethod: text("authentication_method"), // "certificate", "username_password", "saml"
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  lastStatusCheck: integer("last_status_check").$defaultFn(() => Date.now()),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// E-Filing Transactions
export const eFilingTransactions = createTable("e_filing_transactions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  documentId: text("document_id").references(() => documents.id),
  integrationId: text("integration_id").references(() => eFilingIntegrations.id).notNull(),
  transactionId: text("transaction_id"), // External system transaction ID
  status: text("status").notNull(), // "pending", "submitted", "accepted", "rejected", "error"
  submittedAt: integer("submitted_at"),
  completedAt: integer("completed_at"),
  filingFee: real("filing_fee"),
  confirmationNumber: text("confirmation_number"),
  rejectionReason: text("rejection_reason"),
  serverResponse: text("server_response"), // JSON response from e-filing system
  retryCount: integer("retry_count").default(0),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Court Rules and Updates (for real-time compliance)
export const courtRules = createTable("court_rules", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  jurisdiction: text("jurisdiction").notNull(),
  courtType: text("court_type").notNull(),
  ruleNumber: text("rule_number").notNull(),
  ruleTitle: text("rule_title").notNull(),
  ruleText: text("rule_text").notNull(),
  effectiveDate: integer("effective_date"),
  lastUpdated: integer("last_updated").$defaultFn(() => Date.now()),
  category: text("category"), // "filing", "format", "service", "deadlines"
  impactedTemplates: text("impacted_templates"), // JSON array of template IDs
  changeDescription: text("change_description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Insert schemas
export const upsertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertLegalAidOrganizationSchema = createInsertSchema(legalAidOrganizations).omit({
  id: true,
  createdAt: true,
});

export const insertFilingHistorySchema = createInsertSchema(filingHistory).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export const insertMpcCaseDataSchema = createInsertSchema(mpcCaseData).omit({
  id: true,
  createdAt: true,
  lastSyncedAt: true,
});

export const insertCaseAssessmentSchema = createInsertSchema(caseAssessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEFilingIntegrationSchema = createInsertSchema(eFilingIntegrations).omit({
  id: true,
  createdAt: true,
  lastStatusCheck: true,
});

export const insertEFilingTransactionSchema = createInsertSchema(eFilingTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertCourtRuleSchema = createInsertSchema(courtRules).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

// Types
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

export type InsertLegalAidOrganization = z.infer<typeof insertLegalAidOrganizationSchema>;
export type LegalAidOrganization = typeof legalAidOrganizations.$inferSelect;

export type InsertFilingHistory = z.infer<typeof insertFilingHistorySchema>;
export type FilingHistory = typeof filingHistory.$inferSelect;

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

export type InsertMpcCaseData = z.infer<typeof insertMpcCaseDataSchema>;
export type MpcCaseData = typeof mpcCaseData.$inferSelect;

export type InsertCaseAssessment = z.infer<typeof insertCaseAssessmentSchema>;
export type CaseAssessment = typeof caseAssessments.$inferSelect;

export type InsertEFilingIntegration = z.infer<typeof insertEFilingIntegrationSchema>;
export type EFilingIntegration = typeof eFilingIntegrations.$inferSelect;

export type InsertEFilingTransaction = z.infer<typeof insertEFilingTransactionSchema>;
export type EFilingTransaction = typeof eFilingTransactions.$inferSelect;

export type InsertCourtRule = z.infer<typeof insertCourtRuleSchema>;
export type CourtRule = typeof courtRules.$inferSelect;

// Additional types for API responses
export type DocumentAnalysisResult = {
  docType: string;
  jurisdiction: string;
  compliance: string;
  recommendations: string[];
  extractedData: Record<string, any>;
};

export type EmergencyFilingRequest = {
  documentType: 'TRO' | 'PRELIMINARY_INJUNCTION';
  urgencyLevel: 'IMMEDIATE' | 'WITHIN_24_HOURS' | 'WITHIN_WEEK';
  description: string;
  supportingDocuments: string[];
};

// Tier 1 API Types
export type CaseAssessmentRequest = {
  caseType: string;
  jurisdiction: string;
  factPattern: string;
  partyType?: 'plaintiff' | 'defendant' | 'petitioner' | 'respondent';
  urgency?: 'low' | 'medium' | 'high' | 'emergency';
};

export type JurisdictionSpecificTemplate = {
  templateId: string;
  jurisdiction: string;
  courtType: string;
  localRules: any[];
  filingRequirements: {
    format: string[];
    pageLimit?: number;
    fontRequirements?: string;
    marginRequirements?: string;
    serviceRequirements: string[];
  };
  estimatedFees: {
    filingFee: number;
    serviceFee?: number;
    otherFees?: { name: string; amount: number }[];
  };
};

export type SmartDocumentRequest = {
  templateId: string;
  jurisdiction: string;
  clientData: Record<string, any>;
  caseData: Record<string, any>;
  autoPopulate?: boolean;
  includeCitations?: boolean;
};

export type EFilingRequest = {
  documentId: string;
  targetCourt: string;
  jurisdiction: string;
  caseNumber?: string;
  filingType: string;
  urgency: 'standard' | 'expedited' | 'emergency';
  serviceList?: string[];
  paymentMethod?: 'credit_card' | 'bank_account' | 'court_account';
};

export type ComplianceCheckResult = {
  isCompliant: boolean;
  violations: {
    rule: string;
    severity: 'error' | 'warning' | 'info';
    description: string;
    suggestion: string;
  }[];
  missingRequirements: string[];
  estimatedFixTime: string;
};

// =============================================================================
// CONTENT MANAGEMENT & SEO SYSTEMS
// =============================================================================

// Blog Posts Table - Automated AI-generated legal content
export const blogPosts = createTable("blog_posts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author_id: text("author_id"),
  status: text("status").notNull().default("draft"), // draft, published, scheduled
  category: text("category").notNull(),
  tags: text("tags"), // JSON array
  featured_image: text("featured_image"),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  seo_keywords: text("seo_keywords"),
  canonical_url: text("canonical_url"),
  reading_time: integer("reading_time"), // minutes
  view_count: integer("view_count").default(0),
  is_ai_generated: integer("is_ai_generated", { mode: "boolean" }).default(true),
  ai_prompt_used: text("ai_prompt_used"),
  legal_area: text("legal_area"), // jurisdiction or practice area
  target_audience: text("target_audience"), // lawyers, pro_se, general
  content_score: integer("content_score"), // AI quality score 1-100
  internal_links: text("internal_links"), // JSON array of internal links
  external_links: text("external_links"), // JSON array of external links
  glossary_terms: text("glossary_terms"), // JSON array of terms to link
  last_updated: integer("last_updated").$defaultFn(() => Date.now()),
  published_at: integer("published_at"),
  scheduled_for: integer("scheduled_for"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Glossary Terms Table - Automated legal dictionary
export const glossaryTerms = createTable("glossary_terms", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  term: text("term").notNull().unique(),
  definition: text("definition").notNull(),
  pronunciation: text("pronunciation"),
  etymology: text("etymology"),
  category: text("category").notNull(), // procedural, substantive, evidence, etc.
  difficulty_level: text("difficulty_level").notNull(), // beginner, intermediate, advanced
  related_terms: text("related_terms"), // JSON array
  synonyms: text("synonyms"), // JSON array
  antonyms: text("antonyms"), // JSON array
  example_usage: text("example_usage"),
  legal_citation: text("legal_citation"),
  jurisdiction_specific: text("jurisdiction_specific"), // JSON array of jurisdictions
  practice_areas: text("practice_areas"), // JSON array
  seo_keywords: text("seo_keywords"),
  usage_frequency: integer("usage_frequency").default(0),
  is_ai_generated: integer("is_ai_generated", { mode: "boolean" }).default(true),
  ai_confidence_score: integer("ai_confidence_score"),
  last_reviewed: integer("last_reviewed"),
  review_status: text("review_status").default("pending"), // pending, approved, rejected
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// SEO Analytics Table - Track SEO performance
export const seoAnalytics = createTable("seo_analytics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  page_url: text("page_url").notNull(),
  page_type: text("page_type").notNull(), // blog, tool, glossary, landing
  title: text("title").notNull(),
  meta_description: text("meta_description"),
  target_keywords: text("target_keywords"), // JSON array
  current_rankings: text("current_rankings"), // JSON object with keyword rankings
  organic_traffic: integer("organic_traffic").default(0),
  bounce_rate: real("bounce_rate"),
  time_on_page: integer("time_on_page"), // seconds
  conversion_rate: real("conversion_rate"),
  backlinks_count: integer("backlinks_count").default(0),
  domain_authority: integer("domain_authority"),
  page_speed_score: integer("page_speed_score"),
  mobile_friendliness: integer("mobile_friendliness", { mode: "boolean" }).default(true),
  schema_markup: text("schema_markup"), // JSON-LD schema
  internal_links_count: integer("internal_links_count").default(0),
  external_links_count: integer("external_links_count").default(0),
  word_count: integer("word_count"),
  readability_score: integer("readability_score"),
  last_crawled: integer("last_crawled"),
  last_updated: integer("last_updated").$defaultFn(() => Date.now()),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Link Management Table - Internal and external linking strategy
export const linkManagement = createTable("link_management", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  source_page: text("source_page").notNull(),
  target_page: text("target_page").notNull(),
  link_type: text("link_type").notNull(), // internal, external, glossary, tool
  anchor_text: text("anchor_text").notNull(),
  link_context: text("link_context"), // surrounding text for relevance
  link_position: text("link_position"), // header, body, footer, sidebar
  is_auto_generated: integer("is_auto_generated", { mode: "boolean" }).default(true),
  relevance_score: integer("relevance_score"), // AI-calculated relevance 1-100
  click_count: integer("click_count").default(0),
  conversion_value: real("conversion_value"),
  status: text("status").default("active"), // active, inactive, broken
  last_checked: integer("last_checked"),
  priority: text("priority").default("medium"), // high, medium, low
  campaign_tag: text("campaign_tag"), // for tracking specific campaigns
  notes: text("notes"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// Content Topics Table - AI content planning and generation
export const contentTopics = createTable("content_topics", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  topic: text("topic").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull(), // high, medium, low
  content_type: text("content_type").notNull(), // blog, guide, faq, glossary
  target_keywords: text("target_keywords"), // JSON array
  search_volume: integer("search_volume"),
  competition_level: text("competition_level"), // low, medium, high
  seasonal_trends: text("seasonal_trends"), // JSON object
  target_audience: text("target_audience"),
  content_angle: text("content_angle"),
  related_tools: text("related_tools"), // JSON array of tool IDs
  ai_prompt_template: text("ai_prompt_template"),
  generation_status: text("generation_status").default("planned"), // planned, generating, generated, published
  generated_content_id: text("generated_content_id"),
  performance_metrics: text("performance_metrics"), // JSON object
  last_generated: integer("last_generated"),
  next_update_due: integer("next_update_due"),
  createdAt: integer("created_at").$defaultFn(() => Date.now()),
});

// SEO Schemas for different content types
export type BlogPostSEO = {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  structuredData: any;
};

export type GlossaryTermSEO = {
  term: string;
  definition: string;
  keywords: string[];
  relatedTerms: string[];
  category: string;
};
