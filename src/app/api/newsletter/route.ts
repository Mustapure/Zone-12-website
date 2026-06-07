import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // Insert into contact submissions table
    await sql`
      INSERT INTO contact_submissions (name, email, phone, city, message, status)
      VALUES (
        'Newsletter Subscriber', 
        ${email}, 
        'N/A', 
        'N/A', 
        'Requested newsletter subscription from Stay Updated footer form.', 
        'new'
      )
    `;

    return NextResponse.json({ message: 'Thank you for subscribing to our newsletter!' }, { status: 200 });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to record subscription. Please try again later.' },
      { status: 500 }
    );
  }
}
