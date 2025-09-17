import dotenv from "dotenv";
dotenv.config();

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema-sqlite";

const databaseUrl = process.env.DATABASE_URL;

let db: ReturnType<typeof drizzle> | null = null;

if (databaseUrl) {
  try {
    if (databaseUrl.startsWith('file:')) {
      // SQLite database for local development
      const dbPath = databaseUrl.replace('file:', '');
      const sqlite = new Database(dbPath);
      db = drizzle(sqlite, { schema });
      console.log('✅ Connected to SQLite database at:', dbPath);
    } else {
      console.warn('⚠️ Non-SQLite DATABASE_URL detected. For production, use the original PostgreSQL schema.');
      console.warn('Falling back to SQLite for development...');
      const sqlite = new Database('./local.db');
      db = drizzle(sqlite, { schema });
      console.log('✅ Using fallback SQLite database');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    db = null;
  }
} else {
  console.warn('DATABASE_URL not set. Database features will be disabled.');
}

export { db };