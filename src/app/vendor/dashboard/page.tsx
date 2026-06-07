import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import VendorDashboardClient from './VendorDashboardClient';

export const dynamic = 'force-dynamic';

export default async function VendorDashboardPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect('/login?error=session_expired');
  }

  // 1. Fetch user detailed settings from DB
  const userRows = await sql`
    SELECT first_name, last_name, email, phone, role 
    FROM users 
    WHERE id = ${sessionUser.userId}
  `;

  if (userRows.length === 0) {
    redirect('/login?error=user_not_found');
  }

  const userRecord = userRows[0];

  // 2. Fetch business listings registered by this user
  const vendorBusinesses = await sql`
    SELECT id, business_name, owner_name, email, phone, website, address, city, category, description, status 
    FROM businesses 
    WHERE user_id = ${sessionUser.userId}
    ORDER BY id DESC
  `;

  return (
    <VendorDashboardClient 
      initialUser={userRecord} 
      vendorBusinesses={vendorBusinesses} 
    />
  );
}
