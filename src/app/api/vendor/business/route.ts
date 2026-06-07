import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized session.' }, { status: 401 });
    }

    if (user.role !== 'vendor' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Vendor privileges required.' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      id, // If provided, we update. Otherwise, we insert.
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

    // Validate fields
    if (!businessName || !ownerName || !email || !phone || !city || !category) {
      return NextResponse.json(
        { error: 'Business name, owner name, email, phone, city, and category are required.' },
        { status: 400 }
      );
    }

    if (id) {
      // Update existing listing (ensure it belongs to the vendor)
      const queryParams = [
        businessName,
        ownerName,
        email,
        phone,
        website || null,
        address || null,
        city,
        category,
        description || null,
        id
      ];

      // Admin can update any business, vendors can only update their own
      if (user.role === 'admin') {
        await sql`
          UPDATE businesses 
          SET business_name = ${businessName}, owner_name = ${ownerName}, email = ${email}, phone = ${phone}, 
              website = ${website || null}, address = ${address || null}, city = ${city}, category = ${category}, description = ${description || null}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
        `;
      } else {
        await sql`
          UPDATE businesses 
          SET business_name = ${businessName}, owner_name = ${ownerName}, email = ${email}, phone = ${phone}, 
              website = ${website || null}, address = ${address || null}, city = ${city}, category = ${category}, description = ${description || null}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id} AND user_id = ${user.userId}
        `;
      }

      return NextResponse.json({ message: 'Business listing updated successfully!' }, { status: 200 });
    } else {
      // Insert new listing
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

      return NextResponse.json({ message: 'Business listing registered successfully!' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Vendor business update API error:', error);
    return NextResponse.json({ error: 'Database update failed due to server error.' }, { status: 500 });
  }
}
