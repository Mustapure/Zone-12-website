import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DirectoryClient from './DirectoryClient';
import { sql } from '@/lib/db';
import { PlusCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DirectoryPage() {
  const sessionUser = await getCurrentUser();
  const isVerified = sessionUser && (sessionUser.role === 'verified_user' || sessionUser.role === 'admin');

  let businesses: any[] = [];
  let cities: string[] = [];
  let errorMsg = '';
  const isLimited = !isVerified;

  try {
    if (isVerified) {
      // 1. Fetch all active businesses from database
      businesses = await sql`
        SELECT id, business_name, owner_name, email, phone, website, address, city, category, description, status 
        FROM businesses 
        WHERE status = 'active' 
        ORDER BY business_name ASC
      `;
    } else {
      // 1. Fetch only up to 10 active businesses for unverified/logged out users
      businesses = await sql`
        SELECT id, business_name, owner_name, email, phone, website, address, city, category, description, status 
        FROM businesses 
        WHERE status = 'active' 
        ORDER BY business_name ASC
        LIMIT 10
      `;
    }

    // 2. Fetch distinct cities
    const citiesRows = await sql`
      SELECT DISTINCT city 
      FROM businesses 
      WHERE status = 'active' 
      ORDER BY city ASC
    `;
    cities = citiesRows.map((row: any) => row.city).filter(Boolean);
  } catch (error: any) {
    console.error('Failed to load businesses from database:', error);
    errorMsg = error.message || 'Database connection error';
  }

  return (
    <>
      <Navbar />

      <main className="pt-20 min-h-screen bg-slate-950 text-slate-100">
        
        {/* Banner */}
        <section className="relative py-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-950 to-slate-950 border-b border-slate-800/80">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          
          <div className="relative max-w-7xl mx-auto px-6 sm:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20">
                Business Directory
              </span>
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                JCI India Zone 12 Directory
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Empowering free enterprise and economic partnerships. Connect with verified JCI member-owned commercial businesses, trade partners, and service providers.
              </p>
            </div>
            
            <div className="shrink-0 flex items-center">
              <Link
                href="/login"
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold px-6 py-3.5 rounded-xl transition shadow-lg shadow-sky-500/20 active:scale-[0.98]"
              >
                <PlusCircle size={16} />
                <span>List Your Business</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Directory Listings container */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-12">
          {errorMsg ? (
            <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-455 flex items-start gap-4">
              <ShieldAlert className="shrink-0 mt-1" size={20} />
              <div>
                <strong className="font-extrabold text-white text-sm">Database System Error</strong>
                <p className="text-xs text-slate-300 mt-1">
                  We are experiencing a temporary connection failure with our Neon Serverless Postgres database: {errorMsg}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Please ensure your local environment connection variables are active or contact your database administrator.
                </p>
              </div>
            </div>
          ) : (
            <DirectoryClient initialBusinesses={businesses} cities={cities} isLimited={isLimited} />
          )}
        </section>

      </main>

      <Footer />
    </>
  );
}
