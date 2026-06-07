import fs from 'fs';
import postgres from 'postgres';

// Parse .env.local to find DATABASE_URL
const envContent = fs.readFileSync('.env.local', 'utf-8');
const dbUrlMatch = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
if (!dbUrlMatch) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}
const connectionString = dbUrlMatch[1];

const sql = postgres(connectionString, { ssl: 'require' });

try {
  console.log("=== Querying info@aratha.in ===");
  const targetUsers = await sql`
    SELECT id, first_name, last_name, email, role, status, claimed, show_in_directory 
    FROM users 
    WHERE email = 'info@aratha.in'
  `;
  console.log(targetUsers);

  console.log("\n=== Querying all users where claimed = TRUE and show_in_directory = TRUE ===");
  const directoryUsers = await sql`
    SELECT id, first_name, last_name, email, role, status, claimed, show_in_directory 
    FROM users 
    WHERE claimed = TRUE AND show_in_directory = TRUE
  `;
  console.log(`Found ${directoryUsers.length} users:`);
  for (const u of directoryUsers) {
    console.log(`ID: ${u.id} | Name: ${u.first_name} ${u.last_name} | Email: ${u.email} | Role: ${u.role} | Status: ${u.status}`);
  }
} catch (error) {
  console.error("Error running query:", error);
} finally {
  await sql.end();
}
