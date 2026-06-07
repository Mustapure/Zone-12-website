import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL environment variable is not defined. Make sure .env.local contains the Supabase pooler connection string.');
}

const connectionString = process.env.DATABASE_URL || '';

// Prevent multiple database connections in Next.js development (hot-reload) using global singleton
const globalForDb = globalThis as unknown as {
  sql: any | undefined;
};

export const sql =
  globalForDb.sql ||
  postgres(connectionString, {
    ssl: 'require',
    max: 5,            // Keep pool size small to avoid Supabase connection exhaustion
    idle_timeout: 15,  // Terminate idle connections after 15 seconds to free up slots
    connect_timeout: 10, // Time out quickly if connection cannot be established
    prepare: false,    // Required for Supabase PgBouncer (Transaction mode pooler)
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sql = sql;
}


