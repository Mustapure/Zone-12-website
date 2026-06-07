'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setStatusMsg('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setStatusMsg(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Failed to subscribe.');
      }
    } catch (err) {
      setStatus('error');
      setStatusMsg('Network communication error.');
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Description */}
        <div className="space-y-4">
          <img src="/JCI Zone.png" alt="JCI Zone 12 Logo" className="h-10" />
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            JCI India Zone 12 is a voluntary, membership-based organisation of young active citizens aged 18–40. 
            We create positive change in our communities through leadership development, partnerships, and collective action.
          </p>
          <div className="flex items-center gap-3 pt-2">
            {['facebook-f', 'instagram', 'youtube', 'x-twitter', 'linkedin-in'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center text-xs text-slate-400 hover:bg-sky-500 hover:text-white transition duration-200"
              >
                <i className={`fab fa-${social}`}></i>
              </a>
            ))}
          </div>
        </div>

        {/* Menu Links */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link href="/" className="hover:text-white transition">Home</Link></li>
            <li><Link href="/directory" className="hover:text-white transition">Business Directory</Link></li>
            <li><Link href="/leaders" className="hover:text-white transition">Board of Directors</Link></li>
            <li><Link href="/events" className="hover:text-white transition">News &amp; Events</Link></li>
            <li><Link href="/partner" className="hover:text-white transition">Partnerships</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact Us</Link></li>
          </ul>
        </div>

        {/* JCI Connect */}
        <div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">JCI Connect</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><a href="#" className="hover:text-white transition">JCI Senate</a></li>
            <li><a href="#" className="hover:text-white transition">JCI Foundation</a></li>
            <li><a href="#" className="hover:text-white transition">JCI Masterclass</a></li>
            <li><a href="#" className="hover:text-white transition">JCI Club 100</a></li>
            <li><a href="#" className="hover:text-white transition">JCI Store</a></li>
            <li><a href="#" className="hover:text-white transition">Toolkits &amp; Resources</a></li>
          </ul>
        </div>

        {/* Newsletter Sub */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Stay Updated</h4>
          <p className="text-xs text-slate-400 leading-normal">
            Subscribe to our newsletter to receive the latest news, events, and updates from JCI India Zone 12.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2 text-xs">
            <input 
              type="email" 
              placeholder="Your Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 transition text-white"
              required
              disabled={status === 'loading'}
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {statusMsg && (
            <p className={`text-[11px] font-semibold transition mt-2 ${
              status === 'success' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {statusMsg}
            </p>
          )}
        </div>

      </div>

      <div className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <p>
          <strong className="text-slate-400">Aratha.in</strong> &nbsp;|&nbsp; &copy; {currentYear} JCI India Zone 12. All Rights Reserved.
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Use</a>
        </div>
      </div>
    </footer>
  );
}
