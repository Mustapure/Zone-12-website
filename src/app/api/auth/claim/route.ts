import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, memberId, password } = body;

    if (!email || !memberId || !password) {
      return NextResponse.json(
        { error: 'Email, Member ID, and password are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedMemberId = memberId.trim();

    // Find the user by email and member_id
    const users = await sql`
      SELECT id, claimed FROM users 
      WHERE email = ${normalizedEmail} AND member_id = ${normalizedMemberId}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'No account found matching this email and JCI Member ID. Please check your details or contact the administrator.' },
        { status: 404 }
      );
    }

    const targetUser = users[0];

    if (targetUser.claimed) {
      return NextResponse.json(
        { error: 'This account has already been claimed. Please proceed to the Login page.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user: set password, set claimed to TRUE, and set status to active
    await sql`
      UPDATE users 
      SET 
        password = ${hashedPassword}, 
        claimed = TRUE, 
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${targetUser.id}
    `;

    return NextResponse.json(
      { message: 'Account claimed successfully! You can now log in.' },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Account claim API error:', error);
    return NextResponse.json(
      { error: `Account claiming failed: ${error.message || error}` },
      { status: 500 }
    );
  }
}
