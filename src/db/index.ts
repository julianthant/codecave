import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Serverless optimization: Move connection and db instance outside function scope
// This enables connection reuse across function invocations in serverless environments
let client: postgres.Sql | undefined;
let db: ReturnType<typeof drizzle> | undefined;

// Initialize connection outside of handler for serverless reuse
function initializeConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  // Optimized connection settings for serverless environments
  client = postgres(process.env.DATABASE_URL, {
    prepare: false,  // Required for Supabase connection pooling
    max: 1,          // Single connection for serverless
    idle_timeout: 20,
    max_lifetime: 60 * 30,
    connection: {
      // Reduce connection overhead
      application_name: 'codecave-app',
    },
  });

  db = drizzle(client, { 
    schema,
    // Enable logging in development
    logger: process.env.NODE_ENV === 'development',
  });
}

// Main database getter with lazy initialization
export function getDb() {
  if (!db) {
    initializeConnection();
  }
  return db!;
}

// Graceful connection cleanup (for local development)
export function closeDb() {
  if (client) {
    client.end();
    client = undefined;
    db = undefined;
  }
}

// For serverless environments, initialize connection immediately
// This allows connection reuse across multiple function invocations
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  // Only auto-initialize in production/development, not in tests
  try {
    initializeConnection();
  } catch (error) {
    // Silent fail for environments without DATABASE_URL (like build time)
    console.warn('Database initialization deferred:', error instanceof Error ? error.message : 'Unknown error');
  }
}

// Prepared statement cache for serverless performance
const preparedStatements = new Map<string, any>();

export function getPreparedStatement<T>(key: string, statement: () => T): T {
  if (!preparedStatements.has(key)) {
    preparedStatements.set(key, statement());
  }
  return preparedStatements.get(key);
}

// Export all schema items for convenience
export * from "./schema";