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
    const { targetSubmissionId, newStatus } = body;

    if (!targetSubmissionId || !newStatus) {
      return NextResponse.json({ error: 'Target submission ID and new status are required.' }, { status: 400 });
    }

    await sql`
      UPDATE contact_submissions 
      SET status = ${newStatus}
      WHERE id = ${targetSubmissionId}
    `;

    return NextResponse.json({ message: 'Submission status updated successfully!' }, { status: 200 });
  } catch (error: any) {
    console.error('Admin contact submission status update API error:', error);
    return NextResponse.json({ error: 'Database update failed due to server error.' }, { status: 500 });
  }
}
