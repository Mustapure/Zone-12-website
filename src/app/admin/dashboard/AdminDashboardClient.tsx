'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, ShieldAlert, FileText, MapPin, 
  LogOut, Home, CheckCircle2, AlertCircle, 
  Users, Briefcase, Mail, Phone, BarChart3, Clock, 
  ChevronRight, RefreshCw, Star, Ban, Check, 
  MessageSquare, Trash2, Calendar, PlusCircle, Upload
} from 'lucide-react';

interface UserRecord {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
  chapter_name?: string;
  organization_name?: string;
  status: string;
  verification_requested: boolean;
}

interface BusinessRecord {
  id: number;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  category: string;
  status: string;
}

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
  status: string;
  created_at: string;
}

interface EventRecord {
  id: number;
  title: string;
  date: string;
  description?: string;
  category: string;
  location: string;
  img?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
}

interface AdminDashboardClientProps {
  users: UserRecord[];
  businesses: BusinessRecord[];
  submissions: ContactSubmission[];
  events: EventRecord[];
  metrics: {
    totalUsers: number;
    verifiedUsers: number;
    totalBusinesses: number;
    pendingBusinesses: number;
    pendingVerifications: number;
    newInboxes: number;
  };
}

export default function AdminDashboardClient({ 
  users, 
  businesses, 
  submissions, 
  events,
  metrics 
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'users' | 'businesses' | 'inbox' | 'events'>('users');
  const [isUpdating, setIsUpdating] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvFileText, setCsvFileText] = useState('');
  const [isUploadingRoster, setIsUploadingRoster] = useState(false);

  const showAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  // Events CRUD state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventRecord | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    description: '',
    category: 'conference',
    location: '',
    img: '',
    featured: false,
    published: true
  });

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showAlert('error', 'Only image files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('error', 'Image size must be less than 5MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/events/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setEventForm(prev => ({ ...prev, img: data.url }));
        showAlert('success', 'Image uploaded successfully!');
      } else {
        const data = await res.json();
        showAlert('error', data.error || 'Failed to upload image.');
      }
    } catch (err) {
      showAlert('error', 'Network error during image upload.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      date: '',
      description: '',
      category: 'conference',
      location: '',
      img: '/img/img10.jpeg',
      featured: false,
      published: true
    });
    setShowEventModal(true);
  };

  const handleOpenEditModal = (event: EventRecord) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      date: event.date,
      description: event.description || '',
      category: event.category,
      location: event.location,
      img: event.img || '/img/img10.jpeg',
      featured: event.featured,
      published: event.published
    });
    setShowEventModal(true);
  };

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEventCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEventForm(prev => ({ ...prev, [name]: checked }));
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const url = '/api/admin/events';
      const method = editingEvent ? 'PUT' : 'POST';
      const payload = editingEvent 
        ? { id: editingEvent.id, ...eventForm } 
        : eventForm;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showAlert('success', editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
        setShowEventModal(false);
        router.refresh();
      } else {
        const data = await res.json();
        showAlert('error', data.error || 'Failed to save event.');
      }
    } catch (err) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleEventPublish = async (eventId: number, currentPublished: boolean) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: eventId, published: !currentPublished, togglePublishOnly: true })
      });

      if (res.ok) {
        showAlert('success', !currentPublished ? 'Event published!' : 'Event set to draft.');
        router.refresh();
      } else {
        showAlert('error', 'Failed to update publication status.');
      }
    } catch (err) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/events?id=${eventId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showAlert('success', 'Event deleted successfully!');
        router.refresh();
      } else {
        showAlert('error', 'Failed to delete event.');
      }
    } catch (err) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 1. Approve member verification
  const handleApproveVerification = async (userId: number) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, approveVerification: true })
      });
      if (res.ok) {
        showAlert('success', 'User verification approved!');
        router.refresh();
      } else {
        showAlert('error', 'Failed to approve verification.');
      }
    } catch (e) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 2. Change user role
  const handleRoleChange = async (userId: number, newRole: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newRole })
      });
      if (res.ok) {
        showAlert('success', `User role updated to ${newRole}!`);
        router.refresh();
      } else {
        showAlert('error', 'Failed to update user role.');
      }
    } catch (e) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. Toggle user account status
  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    setIsUpdating(true);
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId, newStatus })
      });
      if (res.ok) {
        showAlert('success', `User account status changed to ${newStatus}!`);
        router.refresh();
      } else {
        showAlert('error', 'Failed to update account status.');
      }
    } catch (e) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 4. Change business listing status
  const handleBusinessStatusChange = async (bizId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetBizId: bizId, newStatus })
      });
      if (res.ok) {
        showAlert('success', `Business status marked as ${newStatus}!`);
        router.refresh();
      } else {
        showAlert('error', 'Failed to update business status.');
      }
    } catch (e) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Change contact submission status
  const handleSubmissionStatusChange = async (subId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetSubmissionId: subId, newStatus })
      });
      if (res.ok) {
        showAlert('success', `Submission marked as ${newStatus}!`);
        router.refresh();
      } else {
        showAlert('error', 'Failed to update submission status.');
      }
    } catch (e) {
      showAlert('error', 'Network communication error.');
    } finally {
      setIsUpdating(false);
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

  const handleCSVFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvFileText(text);
      showAlert('success', `File loaded: ${file.name}`);
    };
    reader.onerror = () => {
      showAlert('error', 'Failed to read CSV file.');
    };
    reader.readAsText(file);
  };

  const handleRosterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFileText.trim()) {
      showAlert('error', 'Please select a CSV file or paste valid CSV data first.');
      return;
    }

    setIsUploadingRoster(true);
    try {
      const res = await fetch('/api/admin/users/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText: csvFileText })
      });

      const data = await res.json();
      if (res.ok) {
        showAlert('success', data.message || 'Member roster imported successfully!');
        setShowUploadModal(false);
        setCsvFileText('');
        router.refresh();
      } else {
        showAlert('error', data.error || 'Failed to upload member roster.');
      }
    } catch (err) {
      showAlert('error', 'Network error during member roster upload.');
    } finally {
      setIsUploadingRoster(false);
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
              <span>ADMIN CONSOLE</span>
              <span className="text-[9px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse">
                <ShieldCheck size={10} />
                <span>ROOT</span>
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-1">JCI India Zone 12 Supervisor</p>
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
      <main className="max-w-7xl mx-auto px-6 sm:px-12 py-8 flex-1 space-y-8">
        
        {/* Alerts panel */}
        {alertMsg && (
          <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-xl animate-fade-in ${
            alertMsg.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            {alertMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span className="text-xs font-bold">{alertMsg.text}</span>
          </div>
        )}

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Users size={12} className="text-rose-400" />
              <span>Total Members</span>
            </span>
            <h4 className="text-2xl font-black text-white mt-3">{metrics.totalUsers}</h4>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Star size={12} className="text-emerald-400" />
              <span>Verified Members</span>
            </span>
            <h4 className="text-2xl font-black text-white mt-3 text-emerald-400">{metrics.verifiedUsers}</h4>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Briefcase size={12} className="text-sky-400" />
              <span>Directories</span>
            </span>
            <h4 className="text-2xl font-black text-white mt-3">{metrics.totalBusinesses}</h4>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Clock size={12} className="text-yellow-400" />
              <span>Pending Reviews</span>
            </span>
            <h4 className="text-2xl font-black text-yellow-400 mt-3">{metrics.pendingVerifications}</h4>
            <p className="text-[9px] text-slate-500 mt-1">Badge Verifications</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0f172e]/60 border border-slate-800/80 col-span-2 lg:col-span-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Mail size={12} className="text-rose-400" />
              <span>New Inboxes</span>
            </span>
            <h4 className="text-2xl font-black text-rose-400 mt-3">{metrics.newInboxes}</h4>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800/80 gap-6 text-xs sm:text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 relative transition ${
              activeTab === 'users' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Users size={14} />
              <span>Member Supervisor</span>
            </span>
            {activeTab === 'users' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-rose-500 rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('businesses')}
            className={`pb-3 relative transition ${
              activeTab === 'businesses' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} />
              <span>Business Approvals</span>
            </span>
            {activeTab === 'businesses' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`pb-3 relative transition ${
              activeTab === 'inbox' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Mail size={14} />
              <span>Inboxes / Messages</span>
            </span>
            {activeTab === 'inbox' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-rose-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 relative transition ${
              activeTab === 'events' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Events Supervisor</span>
            </span>
            {activeTab === 'events' && (
              <span className="absolute bottom-0 inset-x-0 h-[2px] bg-rose-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab contents */}
        {activeTab === 'users' && (
          <div className="bg-[#0f172e]/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Account Roster Management</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white text-[10px] uppercase font-black px-3 py-1.5 rounded-lg transition"
                >
                  <Upload size={12} />
                  <span>Upload Roster (CSV)</span>
                </button>
                <RefreshCw 
                  size={14} 
                  className="text-slate-400 hover:text-white cursor-pointer transition active:rotate-180" 
                  onClick={() => router.refresh()} 
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/10">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email / Phone</th>
                    <th className="p-4">Chapter / Biz</th>
                    <th className="p-4">Role System</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/20 transition">
                      <td className="p-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <span>{u.first_name} {u.last_name}</span>
                          {u.verification_requested && (
                            <span className="text-[8px] font-black bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.2 rounded uppercase animate-pulse">
                              Pending Review 🛡️
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 space-y-0.5">
                        <div className="text-slate-300 font-semibold">{u.email}</div>
                        <div className="text-slate-450 text-[10px]">{u.phone || 'no phone'}</div>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">
                        {u.role === 'vendor' ? (
                          <span className="text-purple-400 font-bold">{u.organization_name || 'Commercial Seller'}</span>
                        ) : (
                          <span>{u.chapter_name || 'No Chapter'}</span>
                        )}
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[#070d1e] border border-slate-800 text-[11px] text-slate-300 rounded px-2.5 py-1 outline-none cursor-pointer focus:border-slate-700 font-semibold"
                        >
                          <option value="user">user</option>
                          <option value="verified_user">verified_user</option>
                          <option value="vendor">vendor</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {u.status === 'active' ? (
                          <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {u.verification_requested && (
                          <button
                            onClick={() => handleApproveVerification(u.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px] transition"
                          >
                            Verify Badge
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status)}
                          className={`font-bold px-2 py-1 rounded text-[10px] transition ${
                            u.status === 'active'
                              ? 'bg-rose-500/10 text-rose-450 hover:bg-rose-500 hover:text-white'
                              : 'bg-emerald-500/10 text-emerald-450 hover:bg-emerald-500 hover:text-white'
                          }`}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'businesses' && (
          <div className="bg-[#0f172e]/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Business Directory Listings Auditor</h3>
              <RefreshCw 
                size={14} 
                className="text-slate-400 hover:text-white cursor-pointer transition" 
                onClick={() => router.refresh()} 
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/10">
                    <th className="p-4">Business</th>
                    <th className="p-4">Owner / Contact</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-900/20 transition">
                      <td className="p-4 font-bold text-white">{b.business_name}</td>
                      <td className="p-4 space-y-0.5">
                        <div className="text-slate-300 font-semibold">{b.owner_name}</div>
                        <div className="text-slate-450 text-[10px]">{b.phone}</div>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">{b.category}</td>
                      <td className="p-4 text-slate-300 font-semibold">{b.city}</td>
                      <td className="p-4">
                        {b.status === 'active' ? (
                          <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        ) : b.status === 'pending' ? (
                          <span className="text-[9px] font-black uppercase bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
                            Pending Audit
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {b.status !== 'active' && (
                          <button
                            onClick={() => handleBusinessStatusChange(b.id, 'active')}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px] transition"
                          >
                            Approve
                          </button>
                        )}
                        {b.status !== 'inactive' && (
                          <button
                            onClick={() => handleBusinessStatusChange(b.id, 'inactive')}
                            className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-bold px-2 py-1 rounded text-[10px] transition"
                          >
                            Disable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {businesses.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                        No business listings submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inbox' && (
          <div className="bg-[#0f172e]/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Contact Form Inboxes</h3>
              <RefreshCw 
                size={14} 
                className="text-slate-400 hover:text-white cursor-pointer transition" 
                onClick={() => router.refresh()} 
              />
            </div>

            <div className="divide-y divide-slate-800/80">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-6 hover:bg-slate-900/10 transition space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-white">{sub.name}</h4>
                      <span className="text-[10px] text-slate-400">({sub.city || 'no location'})</span>
                      {sub.status === 'new' ? (
                        <span className="text-[8px] font-black uppercase px-2 py-0.2 bg-rose-500/10 text-rose-450 border border-rose-500/20 rounded">
                          New
                        </span>
                      ) : sub.status === 'contacted' ? (
                        <span className="text-[8px] font-black uppercase px-2 py-0.2 bg-yellow-500/10 text-yellow-455 border border-yellow-500/20 rounded">
                          Contacted
                        </span>
                      ) : (
                        <span className="text-[8px] font-black uppercase px-2 py-0.2 bg-slate-850 text-slate-400 border border-slate-800 rounded">
                          Closed
                        </span>
                      )}
                    </div>
                    
                    <div className="text-[10px] text-slate-500">
                      {new Date(sub.created_at).toLocaleString()}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#070d1e]/60 border border-slate-800/80 p-3.5 rounded-xl font-medium">
                    {sub.message || 'No custom query message added.'}
                  </p>

                  <div className="flex justify-between items-center text-xs">
                    <div className="flex gap-4 text-[11px] text-slate-400">
                      <a href={`mailto:${sub.email}`} className="flex items-center gap-1 hover:text-white transition">
                        <Mail size={12} className="text-rose-400" />
                        <span>{sub.email}</span>
                      </a>
                      <a href={`tel:${sub.phone}`} className="flex items-center gap-1 hover:text-white transition">
                        <Phone size={12} className="text-rose-400" />
                        <span>{sub.phone}</span>
                      </a>
                    </div>

                    <div className="space-x-2">
                      {sub.status === 'new' && (
                        <button
                          onClick={() => handleSubmissionStatusChange(sub.id, 'contacted')}
                          className="bg-yellow-500/10 hover:bg-yellow-500 text-yellow-400 hover:text-white border border-yellow-500/20 px-2 py-1 rounded text-[10px] font-bold transition"
                        >
                          Mark Contacted
                        </button>
                      )}
                      {sub.status !== 'closed' && (
                        <button
                          onClick={() => handleSubmissionStatusChange(sub.id, 'closed')}
                          className="bg-emerald-500/10 hover:bg-emerald-500 text-emerald-450 hover:text-white border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold transition"
                        >
                          Close Ticket
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {submissions.length === 0 && (
                <div className="p-12 text-center text-slate-500 font-semibold text-xs space-y-2">
                  <Mail className="mx-auto text-slate-650" size={32} />
                  <p>Your administrator inbox has no messages recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-[#0f172e]/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl animate-fade-in">
            <div className="p-5 border-b border-slate-800/60 bg-slate-950/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Events &amp; Summit Planner</h3>
                <button
                  onClick={handleOpenCreateModal}
                  className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-black px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider transition duration-150 flex items-center gap-1"
                >
                  <PlusCircle size={12} />
                  <span>Create Event</span>
                </button>
              </div>
              <RefreshCw 
                size={14} 
                className="text-slate-400 hover:text-white cursor-pointer transition" 
                onClick={() => router.refresh()} 
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider bg-slate-950/10">
                    <th className="p-4">Event Info</th>
                    <th className="p-4">Date / Time</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {events.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-900/20 transition">
                      <td className="p-4 font-bold text-white max-w-xs truncate">
                        <div className="flex items-center gap-2">
                          <img src={e.img || '/img/img10.jpeg'} className="w-8 h-8 rounded-lg object-cover" />
                          <span>{e.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">{e.date}</td>
                      <td className="p-4 text-slate-300 font-semibold">{e.location}</td>
                      <td className="p-4 text-slate-300 font-semibold capitalize">{e.category}</td>
                      <td className="p-4">
                        {e.featured ? (
                          <span className="text-[9px] font-black uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full">
                            ★ Featured
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-slate-500">Standard</span>
                        )}
                      </td>
                      <td className="p-4">
                        {e.published ? (
                          <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                            Published
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase bg-slate-850 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => handleToggleEventPublish(e.id, e.published)}
                          className={`font-bold px-2 py-1 rounded text-[10px] transition ${
                            e.published
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/20'
                              : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/20'
                          }`}
                        >
                          {e.published ? 'Set Draft' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(e)}
                          className="bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 border border-sky-500/20 font-bold px-2 py-1 rounded text-[10px] transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(e.id)}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-bold px-2 py-1 rounded text-[10px] transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-semibold">
                        No events records found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Event Add/Edit Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0f172e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar size={18} className="text-sky-400" />
                <span>{editingEvent ? 'Edit Event Record' : 'Create New Event'}</span>
              </h3>
              <button 
                onClick={() => setShowEventModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold font-mono border border-slate-800 hover:border-slate-700 bg-slate-950/20 px-2.5 py-1 rounded-xl transition"
              >
                ESC
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={eventForm.title}
                  onChange={handleEventFormChange}
                  placeholder="e.g. Zone Midcon 2026"
                  className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-slate-700 transition"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Date / Time Display</label>
                  <input
                    type="text"
                    name="date"
                    value={eventForm.date}
                    onChange={handleEventFormChange}
                    placeholder="e.g. June 12, 2026"
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-slate-700 transition"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Category</label>
                  <select
                    name="category"
                    value={eventForm.category}
                    onChange={handleEventFormChange}
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 outline-none focus:border-slate-700 transition cursor-pointer"
                  >
                    <option value="conference">Conference</option>
                    <option value="training">Training</option>
                    <option value="awards">Awards</option>
                    <option value="community">Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={eventForm.location}
                    onChange={handleEventFormChange}
                    placeholder="e.g. City Hall or Zoom"
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-slate-700 transition"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center justify-between">
                    <span>Event Image / Banner</span>
                    {isUploadingImage && <span className="text-sky-400 font-bold animate-pulse text-[9px] lowercase">Uploading image...</span>}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="img"
                      value={eventForm.img}
                      onChange={handleEventFormChange}
                      placeholder="e.g. /img/img10.jpeg"
                      className="flex-1 bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-slate-700 transition"
                    />
                    <label className="flex items-center gap-1 bg-sky-500 hover:bg-sky-600 text-slate-950 font-black px-4 py-2.5 rounded-xl transition cursor-pointer text-xs select-none shadow-md shadow-sky-500/10 active:scale-95 shrink-0">
                      <Upload size={13} />
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>
                  {eventForm.img && (
                    <div className="mt-2 flex items-center gap-3 bg-slate-950/40 border border-slate-800/60 p-2 rounded-xl">
                      <img 
                        src={eventForm.img} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/img/img10.jpeg';
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Selected Image Preview</span>
                        <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{eventForm.img}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Description</label>
                <textarea
                  name="description"
                  value={eventForm.description}
                  onChange={handleEventFormChange}
                  placeholder="Provide a detailed explanation of the scheduled event..."
                  rows={3}
                  className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-slate-700 transition resize-none"
                ></textarea>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={eventForm.featured}
                    onChange={handleEventCheckboxChange}
                    className="accent-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold">★ Highlight as Featured Event</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                  <input
                    type="checkbox"
                    name="published"
                    checked={eventForm.published}
                    onChange={handleEventCheckboxChange}
                    className="accent-sky-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-bold">Publish Instantly</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-5 py-2.5 rounded-xl font-bold transition duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-sky-500 hover:bg-sky-600 text-slate-950 font-black px-6 py-2.5 rounded-xl transition duration-150"
                >
                  {isUpdating ? 'Saving...' : editingEvent ? 'Save Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Roster Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0f172e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-6 p-6 sm:p-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Upload size={18} className="text-rose-455" />
                <span>Upload Member Roster (CSV)</span>
              </h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setCsvFileText('');
                }}
                className="text-slate-400 hover:text-white text-xs font-bold font-mono border border-slate-800 hover:border-slate-700 bg-slate-950/20 px-2.5 py-1 rounded-xl transition"
              >
                ESC
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 text-slate-300 space-y-2 leading-relaxed">
                <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">Required Columns (in exact order or with headers):</h4>
                <code className="block bg-[#070d1e] p-2 rounded-lg text-rose-400 font-mono text-[10px] break-all">
                  first_name, last_name, email, phone, chapter_name, member_id
                </code>
                <p className="text-[10px] text-slate-450 mt-1">
                  Note: Duplicate emails will be skipped. Password will be randomly generated until claimed. Account status defaults to Inactive and claimed to FALSE.
                </p>
              </div>

              <form onSubmit={handleRosterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest block">Choose CSV File</label>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleCSVFileChange}
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-slate-700 transition file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-rose-500 file:text-white cursor-pointer file:cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Or Paste CSV Text</label>
                  <textarea
                    value={csvFileText}
                    onChange={(e) => setCsvFileText(e.target.value)}
                    placeholder="John,Doe,john@example.com,9876543210,Chapter A,JCI-998811"
                    rows={6}
                    className="w-full bg-[#070d1e] border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono outline-none focus:border-slate-700 transition resize-none text-[10px]"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false);
                      setCsvFileText('');
                    }}
                    className="bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-5 py-2.5 rounded-xl font-bold transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploadingRoster}
                    className="bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-2.5 rounded-xl transition duration-150"
                  >
                    {isUploadingRoster ? 'Uploading & Processing...' : 'Process Import'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
