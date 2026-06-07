import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, city, message } = body;

    // Simple validation
    if (!name || !email || !phone || !city) {
      return NextResponse.json(
        { error: 'Name, email, phone, and city are required.' },
        { status: 400 }
      );
    }

    // Insert into contact submissions table
    await sql`
      INSERT INTO contact_submissions (name, email, phone, city, message, status)
      VALUES (${name}, ${email}, ${phone}, ${city}, ${message || ''}, 'new')
    `;

    return NextResponse.json(
      { message: 'Submission successfully received.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Server database error: ' + (error.message || error) },
      { status: 500 }
    );
  }
}
