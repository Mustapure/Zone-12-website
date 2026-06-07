'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LogIn, User, ShieldCheck, ShieldAlert, 
  ArrowLeft, Eye, EyeOff, Sparkles 
} from 'lucide-react';

type PortalType = 'member' | 'vendor' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [activePortal, setActivePortal] = useState<PortalType>('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle portal auto-focus styling or credential preset (optional)
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
  }, [activePortal]);

  // Check if already authenticated on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            // Already authenticated, redirect directly
            setSuccessMsg('Session active! Redirecting to dashboard...');
            setTimeout(() => {
              const role = data.user.role;
              if (role === 'admin') {
                router.push('/admin/dashboard');
              } else if (role === 'vendor') {
                router.push('/vendor/dashboard');
              } else {
                router.push('/member/dashboard');
              }
            }, 800);
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
    checkSession();
  }, [router]);

  // Check for inactivity redirect error params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const error = params.get('error');
      if (error === 'session_expired_inactivity') {
        setErrorMsg('You have been logged out due to inactivity (2 minutes).');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg('Authentication successful! Redirecting...');
        
        // Short delay to let the user see the success alert
        setTimeout(() => {
          if (data.role === 'admin') {
            router.push('/admin/dashboard');
          } else if (data.role === 'vendor') {
            router.push('/vendor/dashboard');
          } else {
            router.push('/member/dashboard');
          }
        }, 1000);
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMsg('Failed to establish contact with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const portalDetails = {
    member: {
      title: "Member Portal",
      desc: "Access your membership profile, request verified status, or submit business listings.",
      badgeColor: "bg-sky-500/10 text-sky-500 border-sky-500/20",
      accent: "sky"
    },
    vendor: {
      title: "Vendor Portal",
      desc: "Manage your business directory catalog, view analytics, and check performance tracking.",
      badgeColor: "bg-sky-400/10 text-sky-400 border-sky-400/20",
      accent: "sky-light"
    },
    admin: {
      title: "Admin Panel",
      desc: "Supervise users, audit verification applications, approve directories, and read inboxes.",
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      accent: "sky"
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/JCI Zone.png" alt="JCI Logo" className="h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Zone 12</span>
          </div>
        </div>

        {/* Outer Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800/80 bg-slate-950/40 p-1.5 gap-1">
            {(['member', 'vendor', 'admin'] as PortalType[]).map((type) => {
              const isActive = activePortal === type;
              return (
                <button
                  key={type}
                  onClick={() => setActivePortal(type)}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive 
                      ? type === 'member'
                        ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                        : type === 'vendor'
                          ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                          : 'bg-sky-500/85 text-white shadow-lg shadow-sky-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Tab Welcome Header */}
            <div className="space-y-2 text-center sm:text-left">
              <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${portalDetails[activePortal].badgeColor}`}>
                <Sparkles size={10} />
                {portalDetails[activePortal].title}
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Welcome Back
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {portalDetails[activePortal].desc}
              </p>
            </div>

            {/* Status Alert Panels */}
            {successMsg && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed animate-fade-in">
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Authentication Success</strong>
                  <p className="text-slate-300 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed animate-fade-in">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Authentication Refused</strong>
                  <p className="text-slate-300 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    activePortal === 'admin' 
                      ? "admin@jcizone12.org" 
                      : "enter your registered email"
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-slate-700 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] text-sky-400 font-bold hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-4 pr-11 py-3 text-sm text-white outline-none focus:border-slate-700 transition duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Login Button with context accent */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-2 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
                  activePortal === 'member'
                    ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/10'
                    : activePortal === 'vendor'
                      ? 'bg-sky-400 hover:bg-sky-500 text-slate-950 shadow-sky-400/10'
                      : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/10'
                }`}
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <LogIn size={15} />
                    <span>Enter {portalDetails[activePortal].title}</span>
                  </>
                )}
              </button>
            </form>

            {/* Register redirection (hidden for admin) */}
            {activePortal !== 'admin' && (
              <div className="text-center pt-2 border-t border-slate-800/40 text-xs text-slate-400">
                Don't have an account yet?{' '}
                <Link href="/register" className="text-sky-400 font-bold hover:underline">
                  Register here
                </Link>
              </div>
            )}

          </div>

        </div>

      </div>
    </main>
  );
}
