'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogIn, LogOut, Menu, X, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch session
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to check session:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [pathname]); // Check on page navigation

  // Inactivity auto-logout (2 minutes)
  useEffect(() => {
    if (!user) return;

    let inactivityTimeout: NodeJS.Timeout;

    const resetTimer = () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      
      inactivityTimeout = setTimeout(async () => {
        try {
          const res = await fetch('/api/auth/logout', { method: 'POST' });
          if (res.ok) {
            setUser(null);
            window.location.href = '/login?error=session_expired_inactivity';
          }
        } catch (err) {
          console.error('Auto-logout failed:', err);
        }
      }, 2 * 60 * 1000); // 2 minutes
    };

    // Initial trigger
    resetTimer();

    // Event listeners for activity
    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Clean up
    return () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'DIR', path: '/directory' },
    { name: 'Leaders', path: '/leaders' },
    { name: 'Events', path: '/events' },
    { name: 'Partner', path: '/partner' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 inset-x-0 h-20 z-50 transition-all duration-300 flex items-center justify-between px-6 sm:px-12 ${
          isScrolled 
            ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img src="/JCI Zone.png" alt="JCI Logo" className="h-9 hover:opacity-90 transition" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-black text-white tracking-wider leading-none">JCI INDIA</h1>
            <p className="text-[10px] text-brand-500 font-bold uppercase tracking-widest mt-0.5">Zone 12</p>
          </div>
        </Link>

        {/* Desktop Navigation Items */}
        <div className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-semibold tracking-wide transition relative py-1 hover:text-white ${
                  isActive ? 'text-white font-bold' : 'text-slate-300'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-sky-400 rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
          
          {!loading && user ? (
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="text-slate-400">
                Hi, <strong className="text-white">{user.name.split(' ')[0]}</strong>
              </span>
              <Link
                href={
                  user.role === 'admin' 
                    ? '/admin/dashboard' 
                    : user.role === 'vendor' 
                      ? '/vendor/dashboard' 
                      : '/member/dashboard'
                }
                className="text-sky-400 hover:text-sky-300 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-md shadow-sky-500/20 active:scale-[0.98]"
            >
              <LogIn size={15} />
              <span>Portal</span>
            </Link>
          )}
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-slate-300 hover:text-white p-2"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div 
        className={`fixed inset-x-0 top-20 bg-slate-950 border-b border-slate-800 shadow-xl transition-all duration-300 z-40 lg:hidden flex flex-col p-6 gap-4 ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
        }`}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-sm font-bold tracking-wide py-2 border-b border-slate-800/40 transition hover:text-sky-400 ${
                isActive ? 'text-sky-400' : 'text-slate-300'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
        
        {!loading && user ? (
          <div className="pt-2 border-t border-slate-800/60 flex flex-col gap-3">
            <div className="text-xs text-slate-400 font-bold px-2">
              Logged in as <strong className="text-white">{user.name}</strong>
            </div>
            <Link
              href={
                user.role === 'admin' 
                  ? '/admin/dashboard' 
                  : user.role === 'vendor' 
                    ? '/vendor/dashboard' 
                    : '/member/dashboard'
              }
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 text-white text-sm font-bold py-2.5 rounded-xl transition hover:bg-slate-850"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-455 hover:text-white border border-rose-500/20 text-sm font-bold py-2.5 rounded-xl transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold py-3 rounded-xl transition active:scale-[0.99] mt-2 shadow-md shadow-sky-500/10"
          >
            <LogIn size={16} />
            <span>Gateway Portal</span>
          </Link>
        )}
      </div>
    </>
  );
}
