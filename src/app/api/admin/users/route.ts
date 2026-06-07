import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
    }

    const body = await request.json();
    const { targetUserId, newRole, newStatus, approveVerification } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required.' }, { status: 400 });
    }

    if (approveVerification) {
      // Approve verification: promote to verified_user and set requested=false
      await sql`
        UPDATE users 
        SET role = 'verified_user', verification_requested = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${targetUserId}
      `;
      return NextResponse.json({ message: 'User verification approved!' }, { status: 200 });
    }

    if (newRole) {
      await sql`
        UPDATE users 
        SET role = ${newRole}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${targetUserId}
      `;
    }

    if (newStatus) {
      await sql`
        UPDATE users 
        SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${targetUserId}
      `;
    }

    return NextResponse.json({ message: 'User settings updated successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Admin users update API error:', error);
    return NextResponse.json({ error: 'Database update failed due to server error.' }, { status: 500 });
  }
}
