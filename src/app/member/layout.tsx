import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface MemberLayoutProps {
  children: React.ReactNode;
}

export default async function MemberLayout({ children }: MemberLayoutProps) {
  const user = await getCurrentUser();

  // Guard: If guest, redirect to login
  if (!user) {
    redirect('/login?error=session_expired');
  }

  // Guard: Restrict role types allowed in Member portal
  const allowedRoles = ['user', 'verified_user', 'admin'];
  if (!allowedRoles.includes(user.role)) {
    // If they belong to another dashboard, redirect them accordingly
    if (user.role === 'vendor') {
      redirect('/vendor/dashboard');
    } else {
      redirect('/login?error=unauthorized');
    }
  }

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 flex flex-col">
      {children}
    </div>
  );
}
