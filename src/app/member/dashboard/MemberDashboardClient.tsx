'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, ShieldCheck, ShieldAlert, FileText, PlusCircle, 
  MapPin, LogOut, Home, CheckCircle2, AlertCircle, Clock, 
  Briefcase, Send, Globe, Phone, Mail, Users, Search
} from 'lucide-react';

interface Business {
  id: number;
  business_name: string;
  category: string;
  city: string;
  status: string;
}

interface Member {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  chapter_name?: string;
}

interface MemberDashboardClientProps {
  initialUser: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    chapter_name: string;
    member_id?: string;
    verification_requested: boolean;
    show_in_directory?: boolean;
  };
  userBusinesses: Business[];
  otherMembers: Member[];
}

export default function MemberDashboardClient({ 
  initialUser, 
  userBusinesses,
  otherMembers
}: MemberDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'workspace' | 'mynetwork'>('workspace');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered members list for Network tab
  const filteredMembers = otherMembers.filter(member => {
    const search = searchQuery.toLowerCase();
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const chapter = (member.chapter_name || '').toLowerCase();
    return fullName.includes(search) || chapter.includes(search);
  });
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: initialUser.first_name,
    lastName: initialUser.last_name,
    phone: initialUser.phone || '',
    chapterName: initialUser.chapter_name || '',
    memberId: initialUser.member_id || ''
  });
  
  // Business form state
  const [bizForm, setBizForm] = useState({
    businessName: '',
    ownerName: `${initialUser.first_name} ${initialUser.last_name}`,
    email: initialUser.email,
    phone: initialUser.phone || '',
    website: '',
    address: '',
    city: '',
    category: 'Services',
    description: ''
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [profileError, setProfileError] = useState('');

  const [isSubmittingBiz, setIsSubmittingBiz] = useState(false);
  const [bizStatus, setBizStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [bizError, setBizError] = useState('');

  const [verificationApplied, setVerificationApplied] = useState(initialUser.verification_requested);
  const [showInDirectory, setShowInDirectory] = useState(initialUser.show_in_directory ?? true);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBizForm(prev => ({ ...prev, [name]: value }));
  };

  // Submit Profile update
  const handleSaveProfile = async (e: React.FormEvent, applyVerification: boolean = false) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileStatus('idle');
    setProfileError('');

    try {
      const res = await fetch('/api/member/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          showInDirectory,
          requestVerification: applyVerification
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProfileStatus('success');
        if (applyVerification) {
          setVerificationApplied(true);
        }
        router.refresh();
      } else {
        setProfileStatus('error');
        setProfileError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setProfileStatus('error');
      setProfileError('Network communication error.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Submit business entry
  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBiz(true);
    setBizStatus('idle');
    setBizError('');

    try {
      const res = await fetch('/api/member/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bizForm)
      });

      const data = await res.json();
      if (res.ok) {
        setBizStatus('success');
        setBizForm({
          businessName: '',
          ownerName: `${initialUser.first_name} ${initialUser.last_name}`,
          email: initialUser.email,
          phone: initialUser.phone || '',
          website: '',
          address: '',
          city: '',
          category: 'Services',
          description: ''
        });
        router.refresh();
      } else {
        setBizStatus('error');
        setBizError(data.error || 'Failed to register business profile.');
      }
    } catch (err) {
      setBizStatus('error');
      setBizError('Network communication error.');
    } finally {
      setIsSubmittingBiz(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/login');
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <>
      {/* Top dashboard control panel header */}
      <header className="bg-[#0f172e]/80 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/JCI Zone.png" alt="JCI Logo" className="h-8" />
          <div>
            <h1 className="text-sm font-black text-white tracking-widest leading-none flex items-center gap-1.5">
              <span>MEMBER SPACE</span>
              {initialUser.role === 'verified_user' ? (
                <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <ShieldCheck size={10} />
                  <span>VERIFIED</span>
                </span>
              ) : (
                <span className="text-[9px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <User size={10} />
                  <span>MEMBER</span>
                </span>
              )}
            </h1>
            <p className="text-[10px] text-slate-400 mt-1">JCI India Zone 12 Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-xs font-bold px-3.5 py-2 rounded-xl transition text-slate-300 hover:text-white"
          >
            <Home size={13} />
            <span className="hidden sm:inline">Home Page</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 text-xs font-bold px-3.5 py-2 rounded-xl transition duration-200"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex-1 space-y-8">
        
        {/* Tab Selection */}
        <div className="flex border-b border-slate-800/80 gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`pb-3 relative transition ${
              activeTab === 'workspace' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} />
              <span>My Workspace</span>
            </span>
            {activeTab === 'workspace' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-sky-500 rounded-full" />
            )}
          </button>
          
          {(initialUser.role === 'verified_user' || initialUser.role === 'admin') && (
            <button
              onClick={() => setActiveTab('mynetwork')}
              className={`pb-3 relative transition ${
                activeTab === 'mynetwork' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                <span>My Network</span>
              </span>
              {activeTab === 'mynetwork' && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-sky-500 rounded-full" />
              )}
            </button>
          )}
        </div>

        {/* 2-Column Grid Layout (ALWAYS VISIBLE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Controls & Verification Badge status (ALWAYS VISIBLE) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Badge Alert */}
            {initialUser.role === 'verified_user' ? (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 space-y-3 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Verified Profile Status</h3>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">Approved Active Member 🛡️</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Congratulations! Your JCI member status has been reviewed and verified by administrators. Commercial business listings publishing is fully unlocked below.
                </p>
              </div>
            ) : verificationApplied ? (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 space-y-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 border border-yellow-500/30 rounded-xl text-yellow-400 shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Verification Pending</h3>
                    <p className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mt-0.5">Audit Under Process ⏳</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your request for a verification badge has been successfully logged. Administrators will audit your profile credentials against local JCI chapter rosters soon.
                </p>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 shrink-0">
                    <AlertCircle size={22} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Unverified Member</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Standard Access 🛡️</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your profile is not verified yet. Regular members can explore lists, edit profiles, and request a Proud JCI verification badge.
                </p>
                
                <button
                  type="button"
                  onClick={(e) => handleSaveProfile(e, true)}
                  disabled={isSavingProfile}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold py-3 rounded-xl transition duration-200 shadow-md shadow-sky-500/10"
                >
                  <ShieldCheck size={14} />
                  <span>Apply for Verification Badge</span>
                </button>
              </div>
            )}

            {/* Profile Form */}
            <div className="p-6 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-lg space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <User size={18} className="text-sky-400" />
                  <span>Personal Details</span>
                </h3>
                {initialUser.member_id && (
                  <span className="text-[9px] font-black bg-sky-500/10 text-sky-400 border border-sky-500/30 px-2.5 py-0.5 rounded-full shrink-0">
                    ID: {initialUser.member_id}
                  </span>
                )}
              </div>

              {profileStatus === 'success' && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  <CheckCircle2 size={15} />
                  <span>Profile details saved successfully!</span>
                </div>
              )}

              {profileStatus === 'error' && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-455 text-xs">
                  <AlertCircle size={15} />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={(e) => handleSaveProfile(e, false)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-slate-700 transition"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileForm.phone}
                    onChange={handleProfileChange}
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-slate-700 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">JCI Chapter Name</label>
                  <input
                    type="text"
                    name="chapterName"
                    value={profileForm.chapterName}
                    onChange={handleProfileChange}
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-slate-700 transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">JCI Member ID</label>
                  <input
                    type="text"
                    name="memberId"
                    value={profileForm.memberId}
                    onChange={handleProfileChange}
                    placeholder="e.g. JCI-123456"
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-slate-700 transition"
                  />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    id="showInDirectory"
                    name="showInDirectory"
                    checked={showInDirectory}
                    onChange={(e) => setShowInDirectory(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-850 bg-[#070d1e] text-sky-500 focus:ring-sky-500/20 cursor-pointer"
                  />
                  <label htmlFor="showInDirectory" className="text-xs font-semibold text-slate-300 cursor-pointer select-none">
                    Show my profile in the Member Directory
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full bg-[#101c38] hover:bg-[#132347] border border-slate-800 hover:border-slate-700 text-xs font-bold py-3 rounded-xl transition duration-200 text-white"
                >
                  {isSavingProfile ? 'Saving Details...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Dynamic Pane switching between Workspace Business Forms and Network Directory */}
          <div className="lg:col-span-7 space-y-6">
            
            {activeTab === 'workspace' ? (
              <>
                {/* Business Submission Box depending on Role */}
                {initialUser.role !== 'verified_user' && initialUser.role !== 'admin' ? (
                  <div className="p-8 rounded-3xl bg-[#0f172e]/30 border border-slate-800/80 text-center space-y-4 shadow-xl">
                    <Briefcase className="mx-auto text-slate-650" size={48} />
                    <h3 className="text-base font-black text-white uppercase tracking-wider">Directory Publishing Locked</h3>
                    <p className="text-xs text-slate-450 max-w-sm mx-auto leading-relaxed">
                      Only <strong className="text-sky-400">Verified JCI Members</strong> are permitted to list commercial businesses in the directory catalog to maintain search integrity.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                      <Link
                        href="/directory"
                        className="inline-flex items-center justify-center gap-1.5 bg-[#0e172e] border border-slate-800 hover:bg-[#121c36] text-slate-300 hover:text-white text-xs font-bold px-5 py-3 rounded-xl transition"
                      >
                        <Globe size={13} />
                        <span>Browse Directory</span>
                      </Link>
                      <button
                        onClick={(e) => handleSaveProfile(e, true)}
                        disabled={verificationApplied}
                        className="inline-flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition shadow-md shadow-sky-500/10 disabled:opacity-50"
                      >
                        <ShieldCheck size={13} />
                        <span>Apply for Verification</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-xl space-y-6">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <PlusCircle size={18} className="text-sky-400" />
                        <span>Register a New Business Profile</span>
                      </h3>
                      <p className="text-slate-450 text-xs leading-relaxed">
                        As a verified JCI member, you are invited to add your commercial services or products to the global JCI Zone 12 search index.
                      </p>
                    </div>

                    {bizStatus === 'success' && (
                      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Business Listing Submitted</strong>
                          <p className="text-slate-300 mt-1">Your business listing has been added to our pending audit deck. You will be notified on approval!</p>
                        </div>
                      </div>
                    )}

                    {bizStatus === 'error' && (
                      <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-455 text-xs">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Registration Blocked</strong>
                          <p className="text-slate-300 mt-1">{bizError}</p>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleAddBusiness} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Business Name</label>
                          <input
                            type="text"
                            name="businessName"
                            value={bizForm.businessName}
                            onChange={handleBizChange}
                            placeholder="e.g. Acme Corporation"
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Owner / Representative Name</label>
                          <input
                            type="text"
                            name="ownerName"
                            value={bizForm.ownerName}
                            onChange={handleBizChange}
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Category</label>
                          <select
                            name="category"
                            value={bizForm.category}
                            onChange={handleBizChange}
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 outline-none focus:border-slate-700 transition cursor-pointer"
                          >
                            <option value="Services">Services</option>
                            <option value="Products">Products</option>
                            <option value="Service Provider">Service Provider</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">City / Location</label>
                          <input
                            type="text"
                            name="city"
                            value={bizForm.city}
                            onChange={handleBizChange}
                            placeholder="e.g. Hyderabad"
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Website URL</label>
                          <input
                            type="text"
                            name="website"
                            value={bizForm.website}
                            onChange={handleBizChange}
                            placeholder="e.g. www.acme.com"
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Contact Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={bizForm.phone}
                            onChange={handleBizChange}
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Contact Email</label>
                          <input
                            type="email"
                            name="email"
                            value={bizForm.email}
                            onChange={handleBizChange}
                            className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Physical Address</label>
                        <input
                          type="text"
                          name="address"
                          value={bizForm.address}
                          onChange={handleBizChange}
                          placeholder="e.g. Flat 301, Sector A, IT Park"
                          className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Business Description</label>
                        <textarea
                          name="description"
                          value={bizForm.description}
                          onChange={handleBizChange}
                          placeholder="Write a brief pitch about your trade services, goods, or operations..."
                          rows={3}
                          className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition resize-none"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingBiz}
                        className="w-full mt-2 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md shadow-sky-500/10 active:scale-[0.99] disabled:opacity-50"
                      >
                        <Send size={13} />
                        <span>Submit Listing to Audit Board</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Registered Directories Checklist */}
                {userBusinesses.length > 0 && (
                  <div className="p-6 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-lg space-y-4">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText size={15} className="text-sky-400" />
                      <span>My Registered Directories ({userBusinesses.length})</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {userBusinesses.map((biz) => (
                        <div
                          key={biz.id}
                          className="flex justify-between items-center p-4 bg-[#070d1e] border border-slate-800/80 rounded-2xl"
                        >
                          <div>
                            <h4 className="text-xs font-extrabold text-white">{biz.business_name}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-3">
                              <span>{biz.category}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                              <span>{biz.city}</span>
                            </p>
                          </div>

                          <div>
                            {biz.status === 'active' ? (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                                Active
                              </span>
                            ) : biz.status === 'pending' ? (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full">
                                Pending Audit
                              </span>
                            ) : (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-rose-500/10 text-rose-450 border border-rose-500/20 rounded-full">
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                {/* Header & Search */}
                <div className="p-6 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        <Users size={18} className="text-sky-400" />
                        <span>Member Connection Directory</span>
                      </h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Connect with other active JCI India Zone 12 members.
                      </p>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative max-w-[200px] w-full">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#070d1e] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-slate-700 transition"
                      />
                      <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* Member Directory Grid */}
                {filteredMembers.length === 0 ? (
                  <div className="text-center py-20 text-slate-500 border border-slate-800/80 rounded-3xl bg-slate-900/10 font-bold text-xs uppercase tracking-widest">
                    No active members found matching your search.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="bg-[#0f172e]/60 hover:bg-[#0f172e]/80 border border-slate-800/85 hover:border-slate-700/80 rounded-3xl p-5 transition duration-300 group flex flex-col justify-between space-y-4 shadow-md"
                      >
                        <div className="space-y-3">
                          {/* Name & Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-black text-white text-sm tracking-wide truncate group-hover:text-sky-400 transition">
                                {member.first_name} {member.last_name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {member.chapter_name || 'No Chapter'}
                              </span>
                            </div>
                            
                            {/* Role Badge */}
                            {member.role === 'admin' ? (
                              <span className="text-[8px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full shrink-0">
                                Admin
                              </span>
                            ) : member.role === 'verified_user' ? (
                              <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                                Verified
                              </span>
                            ) : member.role === 'vendor' ? (
                              <span className="text-[8px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full shrink-0">
                                Vendor
                              </span>
                            ) : (
                              <span className="text-[8px] font-black bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full shrink-0">
                                Member
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Panel / Connectivity */}
                        <div className="border-t border-slate-800/40 pt-4 flex items-center justify-between gap-2">
                          <div className="flex gap-2">
                            {member.phone && (
                              <a 
                                href={`tel:${member.phone}`}
                                className="flex items-center justify-center p-2 rounded-xl bg-[#070d1e] hover:bg-[#0f172e] border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white transition duration-150 text-xs gap-1"
                                title={`Call: ${member.phone}`}
                              >
                                <Phone size={12} className="text-sky-400" />
                                <span className="text-[10px] font-bold">Call</span>
                              </a>
                            )}
                            <a 
                              href={`mailto:${member.email}`}
                              className="flex items-center justify-center p-2 rounded-xl bg-[#070d1e] hover:bg-[#0f172e] border border-slate-800/80 hover:border-slate-700 text-slate-300 hover:text-white transition duration-150 text-xs gap-1"
                              title={`Email: ${member.email}`}
                            >
                              <Mail size={12} className="text-sky-400" />
                              <span className="text-[10px] font-bold">Email</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </main>
    </>
  );
}
