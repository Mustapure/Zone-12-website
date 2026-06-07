'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building, ShieldCheck, FileText, PlusCircle, 
  MapPin, LogOut, Home, CheckCircle2, AlertCircle, 
  BarChart3, Settings, TrendingUp, Eye, Phone, Mail, 
  Globe, Send, HelpCircle 
} from 'lucide-react';

interface Business {
  id: number;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city: string;
  category: string;
  description?: string;
  status: string;
}

interface VendorDashboardClientProps {
  initialUser: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  vendorBusinesses: Business[];
}

export default function VendorDashboardClient({ initialUser, vendorBusinesses }: VendorDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'analytics' | 'editor'>('analytics');
  
  // Select active business to edit, default to first or null
  const [selectedBiz, setSelectedBiz] = useState<Business | null>(
    vendorBusinesses.length > 0 ? vendorBusinesses[0] : null
  );

  // Form State
  const [bizForm, setBizForm] = useState({
    id: selectedBiz ? selectedBiz.id : undefined,
    businessName: selectedBiz ? selectedBiz.business_name : '',
    ownerName: selectedBiz ? selectedBiz.owner_name : `${initialUser.first_name} ${initialUser.last_name}`,
    email: selectedBiz ? selectedBiz.email : initialUser.email,
    phone: selectedBiz ? selectedBiz.phone : initialUser.phone || '',
    website: selectedBiz ? selectedBiz.website || '' : '',
    address: selectedBiz ? selectedBiz.address || '' : '',
    city: selectedBiz ? selectedBiz.city : '',
    category: selectedBiz ? selectedBiz.category : 'Services',
    description: selectedBiz ? selectedBiz.description || '' : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState('');

  const handleBizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBizForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectBusiness = (biz: Business) => {
    setSelectedBiz(biz);
    setBizForm({
      id: biz.id,
      businessName: biz.business_name,
      ownerName: biz.owner_name,
      email: biz.email,
      phone: biz.phone,
      website: biz.website || '',
      address: biz.address || '',
      city: biz.city,
      category: biz.category,
      description: biz.description || ''
    });
    setSubmitStatus('idle');
    setSubmitError('');
  };

  const handleCreateNewClick = () => {
    setSelectedBiz(null);
    setBizForm({
      id: undefined,
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
    setSubmitStatus('idle');
    setSubmitError('');
    setActiveTab('editor');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError('');

    try {
      const res = await fetch('/api/vendor/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bizForm)
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        router.refresh();
      } else {
        setSubmitStatus('error');
        setSubmitError(data.error || 'Failed to update business profile.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError('Network communication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Generate simulated analytics based on business ID
  const simulatedStats = React.useMemo(() => {
    if (!selectedBiz) {
      return { views: 0, clicks: 0, ctr: '0%', calls: 0, emails: 0 };
    }
    const seed = selectedBiz.id * 17;
    const views = (seed % 400) + 120;
    const clicks = (seed % 120) + 40;
    const ctr = ((clicks / views) * 100).toFixed(1) + '%';
    const calls = Math.round(clicks * 0.6);
    const emails = Math.round(clicks * 0.4);
    return { views, clicks, ctr, calls, emails };
  }, [selectedBiz]);

  return (
    <>
      {/* Top dashboard control panel header */}
      <header className="bg-[#0f172e]/80 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/JCI Zone.png" alt="JCI Logo" className="h-8" />
          <div>
            <h1 className="text-sm font-black text-white tracking-widest leading-none flex items-center gap-1.5">
              <span>VENDOR WORKSPACE</span>
              <span className="text-[9px] font-black bg-purple-500/10 text-purple-400 border border-purple-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Building size={10} />
                <span>SELLER</span>
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1">JCI India Zone 12 Commercial Desk</p>
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
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Business Selector Lists */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="p-6 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                <Building size={15} className="text-purple-400" />
                <span>My Listings ({vendorBusinesses.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleCreateNewClick}
                className="text-[10px] font-black text-sky-400 flex items-center gap-1 hover:underline uppercase"
              >
                <PlusCircle size={12} />
                <span>Add New</span>
              </button>
            </div>

            {vendorBusinesses.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                <p>No directories registered yet.</p>
                <button
                  onClick={handleCreateNewClick}
                  className="text-sky-400 font-bold hover:underline"
                >
                  Create one now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {vendorBusinesses.map((biz) => {
                  const isCurrent = selectedBiz?.id === biz.id;
                  return (
                    <button
                      key={biz.id}
                      onClick={() => handleSelectBusiness(biz)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition duration-200 flex flex-col justify-between ${
                        isCurrent 
                          ? 'bg-purple-500/10 border-purple-500/30' 
                          : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/60'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full gap-2">
                        <span className="text-xs font-extrabold text-white line-clamp-1">{biz.business_name}</span>
                        {biz.status === 'active' ? (
                          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                            Active
                          </span>
                        ) : biz.status === 'pending' ? (
                          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
                            Pending
                          </span>
                        ) : (
                          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between w-full mt-2 text-[10px] text-slate-400">
                        <span>{biz.category}</span>
                        <span>{biz.city}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick help banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#101c38]/30 to-[#0c152b]/30 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="text-sky-400" size={15} />
              Seller Directives
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Register commercial listings to showcase your business on the main directories index. Metrics telemetry helps analyze leads.
            </p>
          </div>

        </div>

        {/* Right Side: Tab Switcher (Analytics / Listing Editor Form) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Tab Selection */}
          <div className="flex border-b border-slate-800/80 gap-6 text-sm font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-3 relative transition ${
                activeTab === 'analytics' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BarChart3 size={15} />
                <span>Simulated Reach &amp; Clicks</span>
              </span>
              {activeTab === 'analytics' && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-purple-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`pb-3 relative transition ${
                activeTab === 'editor' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Settings size={15} />
                <span>Listing Details Editor</span>
              </span>
              {activeTab === 'editor' && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-purple-500 rounded-full" />
              )}
            </button>
          </div>

          {/* Render Tab Panel */}
          {activeTab === 'analytics' ? (
            <div className="space-y-6">
              
              {/* If no listing selected */}
              {!selectedBiz ? (
                <div className="p-12 text-center bg-[#0f172e]/30 border border-slate-800/80 rounded-3xl text-slate-500 text-sm space-y-2">
                  <BarChart3 className="mx-auto text-slate-600" size={40} />
                  <p>Please select a business on the left column to audit search telemetry analytics.</p>
                </div>
              ) : (
                <>
                  {/* Status Banner */}
                  {selectedBiz.status !== 'active' && (
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-start gap-3 text-xs leading-relaxed">
                      <AlertCircle className="shrink-0 mt-0.5" size={16} />
                      <div>
                        <strong>Listing Verification Pending Audit</strong>
                        <p className="text-slate-300 mt-0.5">
                          Telemetry reach is currently paused because this directory profile is awaiting administrator approval.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Telemetry Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Eye size={12} className="text-purple-400" />
                        <span>Impressions</span>
                      </span>
                      <h4 className="text-2xl font-black text-white mt-4">{simulatedStats.views}</h4>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-0.5">
                        <TrendingUp size={10} />
                        <span>+12% views</span>
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Phone size={12} className="text-purple-400" />
                        <span>Leads Clicks</span>
                      </span>
                      <h4 className="text-2xl font-black text-white mt-4">{simulatedStats.clicks}</h4>
                      <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mt-1 flex items-center gap-0.5">
                        <TrendingUp size={10} />
                        <span>+8.4% clicks</span>
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <TrendingUp size={12} className="text-purple-400" />
                        <span>Click Rate (CTR)</span>
                      </span>
                      <h4 className="text-2xl font-black text-white mt-4">{simulatedStats.ctr}</h4>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Global average: 18%</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Building size={12} className="text-purple-400" />
                        <span>Profile Status</span>
                      </span>
                      <h4 className="text-lg font-black text-sky-400 mt-5 uppercase tracking-wide">{selectedBiz.status}</h4>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">Audit: Neon DB</span>
                    </div>
                  </div>

                  {/* Reach Telemetry Breakdown */}
                  <div className="p-6 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-lg space-y-6">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <TrendingUp size={15} className="text-purple-400" />
                      <span>Subsequent Lead Breakdown (Dynamic Simulation)</span>
                    </h4>

                    <div className="space-y-4">
                      {/* Call dials */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span className="flex items-center gap-1">
                            <Phone size={12} className="text-sky-400" />
                            <span>Phone Dial Leads</span>
                          </span>
                          <span>{simulatedStats.calls} dials</span>
                        </div>
                        <div className="w-full bg-[#070d1e] h-2 rounded-full overflow-hidden border border-slate-800/40">
                          <div 
                            className="bg-sky-400 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${(simulatedStats.calls / simulatedStats.clicks) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Email inquiries */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span className="flex items-center gap-1">
                            <Mail size={12} className="text-purple-400" />
                            <span>Direct Email Inquiries</span>
                          </span>
                          <span>{simulatedStats.emails} sends</span>
                        </div>
                        <div className="w-full bg-[#070d1e] h-2 rounded-full overflow-hidden border border-slate-800/40">
                          <div 
                            className="bg-purple-400 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${(simulatedStats.emails / simulatedStats.clicks) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            </div>
          ) : (
            /* Listing editor */
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0f172e]/60 border border-slate-800/80 shadow-lg space-y-6">
              
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Building size={18} className="text-purple-400" />
                  <span>{selectedBiz ? 'Edit Active Listing' : 'Register New Vendor Profile'}</span>
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Provide complete, accurate commercial information to represent your enterprise successfully in the JCI directory.
                </p>
              </div>

              {submitStatus === 'success' && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Record Updates Synced</strong>
                    <p className="text-slate-300 mt-1">Your business listing details have been saved to database! It will be reviewed by admin panel soon.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Save Refused</strong>
                    <p className="text-slate-300 mt-1">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Business Name</label>
                    <input
                      type="text"
                      name="businessName"
                      value={bizForm.businessName}
                      onChange={handleBizChange}
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
                    rows={4}
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-slate-700 transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 shadow-md shadow-purple-500/10 active:scale-[0.99] disabled:opacity-50"
                >
                  <Send size={13} />
                  <span>Sync Commercial Listing Details</span>
                </button>
              </form>
            </div>
          )}

        </div>

      </main>
    </>
  );
}
