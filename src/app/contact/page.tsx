'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Mail, Phone, MapPin, Send, CheckCircle, AlertTriangle, 
  Clock, ShieldCheck, Heart, Users 
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', city: '', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMsg(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setSubmitStatus('error');
      setStatusMsg('Failed to connect to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactCards = [
    {
      icon: <Phone className="text-sky-400" size={24} />,
      title: "Call Us",
      value: "+91 98765 43210",
      description: "Mon-Sat from 9am to 6pm",
      link: "tel:+919876543210"
    },
    {
      icon: <Mail className="text-sky-400" size={24} />,
      title: "Email Us",
      value: "contact@jcizone12.org",
      description: "We reply within 24 hours",
      link: "mailto:contact@jcizone12.org"
    },
    {
      icon: <MapPin className="text-sky-400" size={24} />,
      title: "Zone Secretariat",
      value: "Hyderabad, Telangana, India",
      description: "JCI India Zone 12 Headquarters",
      link: "#"
    }
  ];

  return (
    <>
      <Navbar />

      <main className="pt-20 min-h-screen bg-slate-950 text-slate-100">
        
        {/* Banner Section */}
        <section className="relative py-20 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-950 to-slate-950 border-b border-slate-800/80">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          
          <div className="relative max-w-5xl mx-auto px-6 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Connect With JCI Zone 12
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Have questions about registration, membership chapters, or partnership programs? We are here to help you lead the change.
            </p>
          </div>
        </section>

        {/* Core Contact Grid */}
        <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Contact Info & Support Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <h2 className="text-2xl font-black text-white">Contact Information</h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Join a global movement of young leaders creating positive change. Feel free to contact our administrative desk through any of the channels below.
                </p>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 gap-4">
                {contactCards.map((card, idx) => (
                  <a
                    key={idx}
                    href={card.link}
                    className="flex gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-800/60 transition duration-300 group"
                  >
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl group-hover:bg-slate-800/80 group-hover:border-sky-500/30 transition duration-300 shrink-0 h-fit">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">{card.title}</h4>
                      <p className="text-base font-extrabold text-sky-400 mt-1">{card.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{card.description}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* Additional highlights */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-950/40 border border-slate-800/80 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={16} />
                  Membership Core Values
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Heart size={12} className="text-sky-400" />
                    <span>Active citizenship</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className="text-sky-400" />
                    <span>Global Networking</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-sky-400" />
                    <span>Professional Skills</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-sky-400" />
                    <span>Community Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Premium Interactive Glass Form */}
            <div className="lg:col-span-7">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-400/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10 space-y-6">
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-extrabold text-white">Be a Part of JCI</h3>
                    <p className="text-slate-400 text-xs sm:text-sm">
                      Fill out the form below to apply for membership or voice your query, and a chapter lead will reach out shortly.
                    </p>
                  </div>

                  {submitStatus === 'success' && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 animate-fade-in text-sm leading-relaxed">
                      <CheckCircle className="shrink-0 mt-0.5" size={18} />
                      <div>
                        <strong className="font-bold">Form Submitted Successfully!</strong>
                        <p className="text-xs text-slate-300 mt-1">Thank you for joining JCI India Zone 12. We will contact you soon!</p>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-fade-in text-sm leading-relaxed">
                      <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                      <div>
                        <strong className="font-bold">Submission Failed</strong>
                        <p className="text-xs text-slate-300 mt-1">{statusMsg}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition duration-200"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. rahul@example.com"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition duration-200"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +91 99999 88888"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition duration-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="city" className="text-xs font-bold text-slate-300 uppercase tracking-wider">City / Location</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Hyderabad"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition duration-200"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Why do you want to join JCI? / Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us a little bit about yourself or ask your query..."
                        rows={4}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/30 transition duration-200 resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-4 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-xl transition duration-300 shadow-lg shadow-sky-500/10 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span>Submitting Contact Form...</span>
                      ) : (
                        <>
                          <Send size={15} />
                          <span>Submit Message</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
