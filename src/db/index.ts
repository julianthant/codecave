import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let client: postgres.Sql | undefined;
let db: ReturnType<typeof drizzle> | undefined;

export function getDb() {
  if (!db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    // Disable prefetch for Supabase Transaction pool mode
    client = postgres(process.env.DATABASE_URL, {
      prepare: false,  // Required for Supabase connection pooling
      max: 1,
      idle_timeout: 20,
      max_lifetime: 60 * 30,
    });

    db = drizzle(client, { schema });
  }

  return db;
}

export function closeDb() {
  if (client) {
    client.end();
    client = undefined;
    db = undefined;
  }
}

export * from "./schema";