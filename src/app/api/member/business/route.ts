import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    // Check if user is eligible to submit businesses (verified_user, vendor, admin)
    const allowedRoles = ['verified_user', 'vendor', 'admin'];
    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Only verified members or vendors can register directories.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      businessName, 
      ownerName, 
      email, 
      phone, 
      website, 
      address, 
      city, 
      category, 
      description 
    } = body;

    // Validate inputs
    if (!businessName || !ownerName || !email || !phone || !city || !category) {
      return NextResponse.json(
        { error: 'Business name, owner name, email, phone, city, and category are required.' },
        { status: 400 }
      );
    }

    // Insert business entry as 'pending'
    await sql`
      INSERT INTO businesses (
        user_id, business_name, owner_name, email, phone, 
        website, address, city, category, description, status
      )
      VALUES (
        ${user.userId},
        ${businessName},
        ${ownerName},
        ${email},
        ${phone},
        ${website || null},
        ${address || null},
        ${city},
        ${category},
        ${description || null},
        'pending'
      )
    `;

    return NextResponse.json(
      { message: 'Business listing submitted successfully! Waiting for administrator approval.' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Business submission API error:', error);
    return NextResponse.json(
      { error: 'Failed to record business due to database error.' },
      { status: 500 }
    );
  }
}
