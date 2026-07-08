import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set — database features will be unavailable. " +
    "Set DATABASE_URL in .env to enable persistence.",
  );
}

export const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : (null as unknown as Pool);

export const db = process.env.DATABASE_URL
  ? drizzle({ client: pool, schema })
  : (null as unknown as ReturnType<typeof drizzle>);