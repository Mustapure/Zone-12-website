import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();

  // Guard: If guest, redirect to login
  if (!user) {
    redirect('/login?error=session_expired');
  }

  // Guard: Restrict role types allowed in Admin portal
  if (user.role !== 'admin') {
    if (user.role === 'vendor') {
      redirect('/vendor/dashboard');
    } else if (user.role === 'user' || user.role === 'verified_user') {
      redirect('/member/dashboard');
    } else {
      redirect('/login?error=unauthorized');
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {children}
    </div>
  );
}
