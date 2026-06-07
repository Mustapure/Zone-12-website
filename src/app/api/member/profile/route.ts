import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, chapterName, memberId, requestVerification, showInDirectory } = body;

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'First name and last name are required.' }, { status: 400 });
    }

    // Prepare update parameters
    if (requestVerification) {
      await sql`
        UPDATE users 
        SET 
          first_name = ${firstName}, 
          last_name = ${lastName}, 
          phone = ${phone || null}, 
          chapter_name = ${chapterName || null}, 
          member_id = ${memberId || null}, 
          verification_requested = TRUE,
          show_in_directory = ${showInDirectory ?? true}
        WHERE id = ${user.userId}
      `;
    } else {
      await sql`
        UPDATE users 
        SET 
          first_name = ${firstName}, 
          last_name = ${lastName}, 
          phone = ${phone || null}, 
          chapter_name = ${chapterName || null}, 
          member_id = ${memberId || null},
          show_in_directory = ${showInDirectory ?? true}
        WHERE id = ${user.userId}
      `;
    }

    return NextResponse.json({ message: 'Profile updated successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Member profile update API error:', error);
    return NextResponse.json({ error: 'Server database update error.' }, { status: 500 });
  }
}
