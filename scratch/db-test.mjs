import { neon } from '@neondatabase/serverless';

const url = "postgresql://neondb_owner:npg_x5G4wJeblSND@ep-bold-sun-a1p639o9.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const sql = neon(url);

async function test() {
  try {
    console.log("Querying database tables...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables:", tables);

    console.log("\nChecking users columns...");
    try {
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
      `;
      console.log("Users columns:", columns);
    } catch (e) {
      console.error("Error querying users table:", e.message);
    }

  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
}

test();
