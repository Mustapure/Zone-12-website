import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signSessionToken, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // Fetch user from DB
    const users = await sql`
      SELECT id, first_name, last_name, email, password, role, user_type, status, claimed FROM users WHERE email = ${email.toLowerCase()}
    `;

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Check if account is unclaimed
    if (user.claimed === false) {
      return NextResponse.json(
        { error: 'This JCI member profile has not been claimed yet. Please go to the Register page and click "Claim your account" to activate it.' },
        { status: 403 }
      );
    }

    // Check account status
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Your account is suspended. Please contact system admin.' },
        { status: 403 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Sign session token
    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      userType: user.user_type,
      role: user.role
    });

    // Write HttpOnly secure cookie
    await setSessionCookie(token);

    return NextResponse.json(
      { 
        message: 'Login successful!', 
        role: user.role 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { error: `Authentication failed due to a server error: ${error.message || error}` },
      { status: 500 }
    );
  }
}
