import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Schema-first development with push-based approach
  schema: "./src/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  
  // Push-based configuration (no migrations folder)
  // out: "./src/db/migrations", // Removed for push-based approach
  
  // Development optimizations
  verbose: true,
  strict: false, // Temporarily disable strict mode to handle existing constraints
  
  // Schema filters to focus on public schema only
  schemaFilter: ["public"],
  tablesFilter: "*",
  
  // Introspection settings
  introspect: {
    casing: 'camel',
  },
});