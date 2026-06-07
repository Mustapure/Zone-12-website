import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      userType, // 'individual' or 'business'
      chapterName, 
      organizationName 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: 'First name, last name, email, and password are required.' },
        { status: 400 }
      );
    }

    // Basic email format check
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine initial role: if userType is 'business', make them a 'vendor'
    const role = userType === 'business' ? 'vendor' : 'user';

    // Insert user into table
    await sql`
      INSERT INTO users (
        first_name, last_name, email, password, phone, 
        user_type, role, chapter_name, organization_name, status
      )
      VALUES (
        ${firstName},
        ${lastName},
        ${email.toLowerCase()},
        ${hashedPassword},
        ${phone || null},
        ${userType || 'individual'},
        ${role},
        ${chapterName || null},
        ${organizationName || null},
        'active'
      )
    `;

    return NextResponse.json(
      { message: 'User registered successfully!' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: `Registration failed due to a database error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
