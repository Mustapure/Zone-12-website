import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect('/login?error=session_expired');
  }

  if (sessionUser.role !== 'admin') {
    redirect('/login?error=unauthorized');
  }

  // 1. Fetch all users
  const users = await sql`
    SELECT id, first_name, last_name, email, phone, role, chapter_name, organization_name, status, verification_requested 
    FROM users 
    ORDER BY id DESC
  `;

  // 2. Fetch all businesses
  const businesses = await sql`
    SELECT id, business_name, owner_name, email, phone, city, category, status 
    FROM businesses 
    ORDER BY id DESC
  `;

  // 3. Fetch all contact submissions
  const submissions = await sql`
    SELECT id, name, email, phone, city, message, status, created_at 
    FROM contact_submissions 
    ORDER BY id DESC
  `;

  // 4. Fetch all events
  const events = await sql`
    SELECT id, title, date, description, category, location, img, featured, published, created_at 
    FROM events 
    ORDER BY id DESC
  `;

  // 5. Calculate metrics
  const totalUsers = users.length;
  const verifiedUsers = users.filter((u: any) => u.role === 'verified_user').length;
  const totalBusinesses = businesses.length;
  const pendingBusinesses = businesses.filter((b: any) => b.status === 'pending').length;
  const pendingVerifications = users.filter((u: any) => u.verification_requested === true).length;
  const newInboxes = submissions.filter((s: any) => s.status === 'new').length;

  return (
    <AdminDashboardClient
      users={users}
      businesses={businesses}
      submissions={submissions}
      events={events}
      metrics={{
        totalUsers,
        verifiedUsers,
        totalBusinesses,
        pendingBusinesses,
        pendingVerifications,
        newInboxes
      }}
    />
  );
}
