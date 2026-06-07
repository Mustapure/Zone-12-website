'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, User, Building, Phone, Mail, 
  MapPin, ShieldAlert, ShieldCheck, ArrowLeft, 
  Eye, EyeOff, Sparkles 
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<'individual' | 'business'>('individual');
  const [isClaiming, setIsClaiming] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    chapterName: '',
    organizationName: ''
  });
  const [claimData, setClaimData] = useState({
    email: '',
    memberId: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Client-side validations
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          userType, // 'individual' or 'business'
          chapterName: userType === 'individual' ? formData.chapterName : null,
          organizationName: userType === 'business' ? formData.organizationName : null
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSuccessMsg('Account registered successfully! Redirecting to login...');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          chapterName: '',
          organizationName: ''
        });
        
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Registration failed. Please check details.');
      }
    } catch (err) {
      setErrorMsg('Failed to establish contact with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (claimData.password !== claimData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (claimData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: claimData.email,
          memberId: claimData.memberId,
          password: claimData.password
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Account claimed successfully! Redirecting to login...');
        setClaimData({
          email: '',
          memberId: '',
          password: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setErrorMsg(data.error || 'Failed to claim account.');
      }
    } catch (err) {
      setErrorMsg('Failed to establish contact with server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition" />
            <span>Back to Login</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/JCI Zone.png" alt="JCI Logo" className="h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Zone 12</span>
          </div>
        </div>

        {/* Outer Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* User Type Toggle (Only if not claiming) */}
          {!isClaiming && (
            <div className="grid grid-cols-2 border-b border-slate-800/80 bg-slate-950/40 p-1.5 gap-1">
              <button
                type="button"
                onClick={() => setUserType('individual')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                  userType === 'individual'
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <User size={14} />
                <span>Individual Member</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('business')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                  userType === 'business'
                    ? 'bg-sky-400 text-slate-950 shadow-lg shadow-sky-400/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Building size={14} />
                <span>Business Owner</span>
              </button>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Title */}
            <div className="space-y-1 text-center sm:text-left">
              <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                isClaiming 
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : userType === 'individual' 
                    ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' 
                    : 'bg-sky-400/10 text-sky-400 border-sky-400/20'
              }`}>
                <Sparkles size={10} />
                {isClaiming ? "JCI Claim Portal" : userType === 'individual' ? "JCI Member Space" : "JCI Commercial Desk"}
              </span>
              <h2 className="text-2xl font-black text-white leading-tight mt-1.5">
                {isClaiming ? "Claim JCI Member Account" : "Create Account"}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {isClaiming
                  ? 'Verify your pre-loaded JCI Member credentials to set a password and activate your user profile.'
                  : userType === 'individual' 
                    ? 'Join JCI India Zone 12 to network, build leadership skills, and apply for verified member profile statuses.' 
                    : 'Register as a Vendor seller to post your business listing in the directory and unlock view/click tracking analytics.'
                }
              </p>
            </div>

            {/* Claim Account Toggle Promo */}
            {isClaiming ? (
              <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/20 text-xs text-center space-y-2">
                <p className="text-slate-300">
                  Want to register a brand new account instead?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsClaiming(false);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-sky-400 font-extrabold hover:underline uppercase tracking-wider text-[10px]"
                >
                  &larr; Switch to Standard Registration
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-xs text-center space-y-2">
                <p className="text-slate-350">
                  Are you a JCI member pre-registered by the administrator?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsClaiming(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-rose-400 font-extrabold hover:underline uppercase tracking-wider text-[10px]"
                >
                  Claim your account here &rarr;
                </button>
              </div>
            )}

            {/* Alert boxes */}
            {successMsg && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed animate-fade-in">
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Success</strong>
                  <p className="text-slate-300 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs leading-relaxed animate-fade-in">
                <ShieldAlert size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Registration Refused</strong>
                  <p className="text-slate-300 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Form */}
            {isClaiming ? (
              <form onSubmit={handleClaimAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={claimData.email}
                    onChange={(e) => setClaimData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. amit@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">JCI Member ID</label>
                  <input
                    type="text"
                    name="memberId"
                    value={claimData.memberId}
                    onChange={(e) => setClaimData(prev => ({ ...prev, memberId: e.target.value }))}
                    placeholder="e.g. JCI-998811"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">New Password</label>
                    <input
                      type="password"
                      name="password"
                      value={claimData.password}
                      onChange={(e) => setClaimData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={claimData.confirmPassword}
                      onChange={(e) => setClaimData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/10"
                >
                  {isSubmitting ? (
                    <span>Claiming Account...</span>
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      <span>Verify &amp; Claim JCI Account</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Amit"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Reddy"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. amit@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98989 77777"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                    />
                  </div>
                </div>

                {/* Conditional Field depending on Account Type */}
                {userType === 'individual' ? (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">JCI Chapter Name</label>
                    <input
                      type="text"
                      name="chapterName"
                      value={formData.chapterName}
                      onChange={handleInputChange}
                      placeholder="e.g. JCI Hyderabad Greater"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                    />
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Business / Organization Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      placeholder="e.g. Apex Consulting Services"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-2 flex items-center justify-center gap-2 font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed ${
                    userType === 'individual'
                      ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/10'
                      : 'bg-sky-400 hover:bg-sky-500 text-slate-950 shadow-sky-400/10'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Registering Account...</span>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      <span>Create My Account</span>
                    </>
                  )}
                </button>

              </form>
            )}

            <div className="text-center pt-2 border-t border-slate-800/40 text-xs text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-sky-400 font-bold hover:underline">
                Login here
              </Link>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
