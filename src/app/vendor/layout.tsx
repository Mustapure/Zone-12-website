import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface VendorLayoutProps {
  children: React.ReactNode;
}

export default async function VendorLayout({ children }: VendorLayoutProps) {
  const user = await getCurrentUser();

  // Guard: If guest, redirect to login
  if (!user) {
    redirect('/login?error=session_expired');
  }

  // Guard: Restrict role types allowed in Vendor portal
  const allowedRoles = ['vendor', 'admin'];
  if (!allowedRoles.includes(user.role)) {
    // If they are regular members, redirect them to member space
    if (user.role === 'user' || user.role === 'verified_user') {
      redirect('/member/dashboard');
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
