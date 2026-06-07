import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { sql } from '@/lib/db';
import MemberDashboardClient from './MemberDashboardClient';

export const dynamic = 'force-dynamic';

export default async function MemberDashboardPage() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser) {
    redirect('/login?error=session_expired');
  }

  // 1. Fetch user detailed settings from DB
  const userRows = await sql`
    SELECT first_name, last_name, email, phone, role, chapter_name, member_id, verification_requested, show_in_directory 
    FROM users 
    WHERE id = ${sessionUser.userId}
  `;

  if (userRows.length === 0) {
    redirect('/login?error=user_not_found');
  }

  const userRecord = userRows[0];

  // 2. Fetch business listings registered by this user
  const userBusinesses = await sql`
    SELECT id, business_name, category, city, status 
    FROM businesses 
    WHERE user_id = ${sessionUser.userId}
    ORDER BY id DESC
  `;

  // 3. Fetch other active members in JCI India Zone 12 depending on the logged-in user's role
  let otherMembers;
  if (sessionUser.role === 'verified_user' || sessionUser.role === 'admin') {
    // Verified users see all claimed active members (both verified and unverified) who opted in, plus all unclaimed preloaded members
    otherMembers = await sql`
      SELECT id, first_name, last_name, email, phone, role, chapter_name 
      FROM users 
      WHERE (
        (status = 'active' AND claimed = TRUE AND show_in_directory = TRUE)
        OR
        (claimed = FALSE)
      ) AND id != ${sessionUser.userId}
      ORDER BY first_name ASC, last_name ASC
    `;
  } else {
    // Unverified users only see verified users (and admins) who opted in
    otherMembers = await sql`
      SELECT id, first_name, last_name, email, phone, role, chapter_name 
      FROM users 
      WHERE status = 'active' AND claimed = TRUE AND show_in_directory = TRUE AND role IN ('verified_user', 'admin') AND id != ${sessionUser.userId}
      ORDER BY first_name ASC, last_name ASC
    `;
  }

  return (
    <MemberDashboardClient 
      initialUser={userRecord} 
      userBusinesses={userBusinesses} 
      otherMembers={otherMembers}
    />
  );
}
