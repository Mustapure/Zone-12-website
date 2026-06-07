import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, date, description, category, location, img, featured, published } = body;

    if (!title || !date || !category || !location) {
      return NextResponse.json({ error: 'Title, date, category, and location are required.' }, { status: 400 });
    }

    await sql`
      INSERT INTO events (title, date, description, category, location, img, featured, published)
      VALUES (
        ${title},
        ${date},
        ${description || null},
        ${category},
        ${location},
        ${img || '/img/img10.jpeg'},
        ${featured ?? false},
        ${published ?? true}
      )
    `;

    return NextResponse.json({ message: 'Event successfully created!' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, date, description, category, location, img, featured, published, togglePublishOnly } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    if (togglePublishOnly) {
      await sql`
        UPDATE events 
        SET published = ${published}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;
      return NextResponse.json({ message: 'Publication status updated successfully.' }, { status: 200 });
    }

    if (!title || !date || !category || !location) {
      return NextResponse.json({ error: 'Title, date, category, and location are required.' }, { status: 400 });
    }

    await sql`
      UPDATE events 
      SET 
        title = ${title},
        date = ${date},
        description = ${description || null},
        category = ${category},
        location = ${location},
        img = ${img || '/img/img10.jpeg'},
        featured = ${featured ?? false},
        published = ${published ?? true},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Event successfully updated!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Event ID is required.' }, { status: 400 });
    }

    await sql`
      DELETE FROM events WHERE id = ${id}
    `;

    return NextResponse.json({ message: 'Event successfully deleted!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
