import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Authorize Admin
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authorization required.' }, { status: 401 });
    }

    // 2. Parse Multipart Form Data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // 3. Validate File Type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.' }, { status: 400 });
    }

    // 4. Validate File Size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 5MB.' }, { status: 400 });
    }

    // 5. Read File Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 6. Ensure Upload Directory Exists
    const uploadDir = path.join(process.cwd(), 'public', 'img', 'event');
    await fs.mkdir(uploadDir, { recursive: true });

    // 7. Sanitize and Format Filename
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${sanitizedOriginalName}`;
    const filepath = path.join(uploadDir, filename);

    // 8. Write File to Destination
    await fs.writeFile(filepath, buffer);

    // 9. Return the relative URL
    const fileUrl = `/img/event/${filename}`;
    return NextResponse.json({ url: fileUrl }, { status: 200 });

  } catch (error: any) {
    console.error('Error during image upload:', error);
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 });
  }
}
