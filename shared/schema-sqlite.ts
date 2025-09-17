import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = sqliteTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(), // JSON as text in SQLite
  expire: integer("expire", { mode: "timestamp" }).notNull(),
});

// User table with authentication and subscription fields
export const users = sqliteTable("users", {
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
  subscriptionStartDate: integer("subscription_start_date", { mode: "timestamp" }),
  subscriptionEndDate: integer("subscription_end_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const documents = sqliteTable("documents", {
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
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const documentTemplates = sqliteTable("document_templates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // motion, pleading, discovery, etc.
  isEmergency: integer("is_emergency", { mode: "boolean" }).default(false),
  template: text("template").notNull(), // JSON as text in SQLite
  estimatedTime: text("estimated_time"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const legalAidOrganizations = sqliteTable("legal_aid_organizations", {
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
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const filingHistory = sqliteTable("filing_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id).notNull(),
  documentId: text("document_id").references(() => documents.id),
  filingType: text("filing_type").notNull(),
  status: text("status").notNull(), // draft, submitted, filed, rejected
  courtResponse: text("court_response"),
  filedAt: integer("filed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Subscription plans and pricing
export const subscriptionPlans = sqliteTable("subscription_plans", {
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
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
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