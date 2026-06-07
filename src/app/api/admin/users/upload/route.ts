import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const { csvText } = await request.json();
    if (!csvText) {
      return NextResponse.json({ error: 'CSV data is required.' }, { status: 400 });
    }

    // Parse CSV
    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'No data found in CSV.' }, { status: 400 });
    }

    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Check if the first row is a header
    let startIndex = 0;
    if (rows.length > 0) {
      const firstRow = rows[0];
      const isHeader = firstRow.some(cell => 
        cell.toLowerCase().includes('email') || 
        cell.toLowerCase().includes('first') || 
        cell.toLowerCase().includes('member')
      );
      if (isHeader) {
        startIndex = 1;
      }
    }

    for (let i = startIndex; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 3) {
        // Must at least have first_name, last_name, email
        errorCount++;
        errors.push(`Row ${i + 1}: Missing required columns.`);
        continue;
      }

      const firstName = row[0]?.trim();
      const lastName = row[1]?.trim();
      const email = row[2]?.trim().toLowerCase();
      const phone = row[3]?.trim() || null;
      const chapterName = row[4]?.trim() || null;
      const memberId = row[5]?.trim() || null;

      if (!firstName || !lastName || !email) {
        errorCount++;
        errors.push(`Row ${i + 1}: First name, last name, and email are required.`);
        continue;
      }

      if (!email.includes('@')) {
        errorCount++;
        errors.push(`Row ${i + 1}: Invalid email format (${email}).`);
        continue;
      }

      try {
        // Check if email already exists
        const existing = await sql`
          SELECT id FROM users WHERE email = ${email}
        `;

        if (existing.length > 0) {
          duplicateCount++;
          continue;
        }

        // Generate a random temporary password and hash it
        const tempPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        await sql`
          INSERT INTO users (
            first_name, last_name, email, password, phone, 
            user_type, role, chapter_name, member_id, 
            status, claimed, show_in_directory
          )
          VALUES (
            ${firstName},
            ${lastName},
            ${email},
            ${hashedPassword},
            ${phone},
            'individual',
            'user',
            ${chapterName},
            ${memberId},
            'inactive',
            FALSE,
            FALSE
          )
        `;
        successCount++;
      } catch (err: any) {
        errorCount++;
        errors.push(`Row ${i + 1}: Database error - ${err.message || err}`);
      }
    }

    return NextResponse.json({
      message: `Import completed: ${successCount} imported successfully, ${duplicateCount} skipped as duplicates, ${errorCount} errors.`,
      successCount,
      duplicateCount,
      errorCount,
      errors
    }, { status: 200 });

  } catch (error: any) {
    console.error('Member upload API error:', error);
    return NextResponse.json({ error: 'Failed to process member upload.' }, { status: 500 });
  }
}

function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/);
  const result: string[][] = [];
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    const row: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    row.push(currentValue.trim());
    result.push(row);
  }
  return result;
}
