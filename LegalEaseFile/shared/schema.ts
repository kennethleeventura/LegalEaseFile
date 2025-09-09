import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer, real, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User table with authentication and subscription fields
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  pacerAccountLinked: boolean("pacer_account_linked").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("inactive"), // inactive, active, canceled, past_due
  subscriptionTier: text("subscription_tier").default("free"), // free, basic, pro, enterprise
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  content: text("content"), // base64 or file path
  documentType: text("document_type"), // AI-detected type
  aiAnalysis: jsonb("ai_analysis"), // AI analysis results
  status: text("status").notNull().default("uploaded"), // uploaded, analyzed, validated, filed
  isEmergency: boolean("is_emergency").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentTemplates = pgTable("document_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // motion, pleading, discovery, etc.
  isEmergency: boolean("is_emergency").default(false),
  template: jsonb("template").notNull(), // template structure
  estimatedTime: text("estimated_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const legalAidOrganizations = pgTable("legal_aid_organizations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  website: text("website"),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  location: text("location").notNull(), // city/region
  practiceAreas: text("practice_areas").array().notNull(),
  availability: text("availability"), // immediate, emergency, within-week
  isEmergency: boolean("is_emergency").default(false),
  servicesOffered: text("services_offered").array(),
  eligibilityRequirements: text("eligibility_requirements"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const filingHistory = pgTable("filing_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  documentId: varchar("document_id").references(() => documents.id),
  filingType: text("filing_type").notNull(),
  status: text("status").notNull(), // draft, submitted, filed, rejected
  courtResponse: text("court_response"),
  filedAt: timestamp("filed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscription plans and pricing
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(), // Free, Basic, Pro, Enterprise
  displayName: text("display_name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(), // Monthly price in USD
  yearlyPrice: real("yearly_price"), // Yearly price (with discount)
  stripePriceId: varchar("stripe_price_id"),
  stripeYearlyPriceId: varchar("stripe_yearly_price_id"),
  features: jsonb("features").notNull(), // Array of features
  limits: jsonb("limits").notNull(), // Usage limits
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// MPC case data cache (stores Airtable data locally for performance)
export const mpcCaseData = pgTable("mpc_case_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  airtableRecordId: varchar("airtable_record_id").notNull().unique(),
  caseNumber: text("case_number"),
  caseType: text("case_type"),
  jurisdiction: text("jurisdiction"),
  exhibits: jsonb("exhibits"), // Array of exhibit objects
  templates: jsonb("templates"), // Recommended templates
  insights: jsonb("insights"), // Case insights and patterns
  encryptedData: text("encrypted_data"), // AES-256 encrypted sensitive data
  lastSyncedAt: timestamp("last_synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
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
