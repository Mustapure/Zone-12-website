import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await sql`
      SELECT id, title, date, description AS "desc", category, location, img, featured, published 
      FROM events 
      WHERE published = true 
      ORDER BY id DESC
    `;
    return NextResponse.json(events);
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to retrieve events from database.' }, { status: 500 });
  }
}
