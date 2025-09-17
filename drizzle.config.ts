import { defineConfig } from "drizzle-kit";
import path from "path";

const databaseUrl = process.env.DATABASE_URL || 'file:./local.db';
const dbPath = databaseUrl.startsWith('file:') 
  ? path.resolve(process.cwd(), databaseUrl.replace('file:', ''))
  : databaseUrl;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath
  },
});
