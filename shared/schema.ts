import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  pacerAccountLinked: boolean("pacer_account_linked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
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

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

export type InsertLegalAidOrganization = z.infer<typeof insertLegalAidOrganizationSchema>;
export type LegalAidOrganization = typeof legalAidOrganizations.$inferSelect;

export type InsertFilingHistory = z.infer<typeof insertFilingHistorySchema>;
export type FilingHistory = typeof filingHistory.$inferSelect;

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
