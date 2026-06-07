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
    const { targetBizId, newStatus } = body;

    if (!targetBizId || !newStatus) {
      return NextResponse.json({ error: 'Target business ID and new status are required.' }, { status: 400 });
    }

    await sql`
      UPDATE businesses 
      SET status = ${newStatus}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${targetBizId}
    `;

    return NextResponse.json({ message: 'Business status updated successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Admin business update API error:', error);
    return NextResponse.json({ error: 'Database update failed due to server error.' }, { status: 500 });
  }
}
