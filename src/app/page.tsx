'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Rocket, Calendar, Users, Eye, Target, Sparkles, BookOpen, 
  Award, Globe, Shield, Send, CheckCircle, AlertTriangle 
} from 'lucide-react';

export default function Home() {
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      img: '/join.jpg',
      badge: 'JCI India Zone 12',
      title: 'Welcome to JCI Zone 12',
      desc: 'Empowering young leaders to create positive change in communities across Telangana & Andhra Pradesh.'
    },
    {
      img: '/img/Img0.png',
      badge: 'Lead the Change',
      title: 'Build Your Leadership',
      desc: 'Join a global network of young leaders making a difference across communities and beyond.'
    },
    {
      img: '/img/img2.png',
      badge: 'Global Impact',
      title: 'Build Your Future Today',
      desc: 'Develop leadership skills, foster innovation, and create lasting impact in your community.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Tabs State
  const [activeTab, setActiveTab] = useState<'vision' | 'mission'>('vision');

  // Contact Form State
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

  return (
    <>
      <Navbar />

      {/* ====== HERO SECTION ====== */}
      <section className="relative h-screen min-h-[600px] overflow-hidden flex items-center bg-slate-950">
        <div className="absolute inset-0">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
              style={{ backgroundImage: `url('${slide.img}')` }}
            >
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[1px]"></div>
            </div>
          ))}
        </div>

        {/* Slide Content */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 w-full z-10 text-left pt-20">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20 animate-fade-in mb-4">
            <Sparkles size={12} />
            {slides[currentSlide].badge}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight max-w-3xl">
            {slides[currentSlide].title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl leading-relaxed">
            {slides[currentSlide].desc}
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <a href="#join" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-sky-500/20 active:scale-[0.98]">
              <Rocket size={16} />
              <span>Join Us Today</span>
            </a>
            <Link href="/events" className="flex items-center gap-2 border border-slate-700 bg-slate-900/50 hover:bg-slate-900 text-white font-bold px-6 py-3 rounded-xl transition">
              <Calendar size={16} />
              <span>View Events</span>
            </Link>
          </div>
        </div>

        {/* Slider Arrows */}
        <button 
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition hidden md:block"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition hidden md:block"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </section>

      {/* ====== IMPACT ANALYTICS ====== */}
      <section className="bg-slate-950 py-8 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-3xl font-extrabold text-white">28+</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Local Chapters</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-sky-400">1200+</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Active Members</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white">48+</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Projects Completed</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-sky-400">12+</h3>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Districts Covered</p>
          </div>
        </div>
      </section>

      {/* ====== CREED, VISION & MISSION ====== */}
      <section className="py-20 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          {/* Left Col: President Card */}
          <div className="w-full lg:w-2/5 shrink-0">
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <img src="/img/Img40.png" alt="Zone President" className="w-full object-cover aspect-[4/5] object-top grayscale group-hover:grayscale-0 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 inset-x-6 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
                <h4 className="text-md font-bold text-white leading-none">JFP Goutam Kumar Jain</h4>
                <p className="text-xs text-sky-400 font-bold uppercase tracking-widest mt-1.5">Zone President 2026</p>
                <p className="text-[10px] text-slate-400 mt-0.5">JCI India Zone 12</p>
              </div>
            </div>
          </div>

          {/* Right Col: Creed & Tabs */}
          <div className="w-full lg:w-3/5 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">Our Foundation</span>
            <h3 className="text-3xl lg:text-4xl font-extrabold text-white">Creed, Vision &amp; Mission</h3>
            
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl relative">
              <span className="absolute -top-3 left-4 bg-sky-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">JCI Creed</span>
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed pt-2">
                "We believe: That faith in God gives meaning and purpose to human life; That the brotherhood of man transcends the sovereignty of nations; That economic justice can best be won by free men through free enterprise; That government should be of laws rather than of men; That earth's great treasure lies in human personality; And that service to humanity is the best work of life."
              </p>
            </div>

            {/* Interactive Vision/Mission Tabs */}
            <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl overflow-hidden mt-6">
              <div className="flex border-b border-slate-800 bg-slate-900/40 p-1">
                <button
                  onClick={() => setActiveTab('vision')}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition ${
                    activeTab === 'vision' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Vision Statement
                </button>
                <button
                  onClick={() => setActiveTab('mission')}
                  className={`flex-1 py-3 text-xs font-bold rounded-xl transition ${
                    activeTab === 'mission' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Mission Statement
                </button>
              </div>
              <div className="p-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
                {activeTab === 'vision' ? (
                  <p>
                    To be the foremost global network of young leaders creating positive change in communities and beyond. We envision a world where every young person has the opportunity to grow, lead, and make a lasting difference in their society.
                  </p>
                ) : (
                  <p>
                    To provide leadership development opportunities that empower young people to create sustainable impact in society. We fulfill this through business entrepreneurship, international cooperation, individual growth, and community action.
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====== WHY JOIN ====== */}
      <section className="bg-slate-900/40 py-20 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">Why Join JCI</span>
            <h3 className="text-3xl font-black text-white mt-2">Why Join JCI India?</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Joining JCI offers a unique platform to enhance leadership capabilities, expand your global professional network, engage in community impact projects, and drive personal development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs sm:text-sm">
            {[
              { icon: <Target className="text-sky-400" />, title: 'Leadership Growth', desc: 'Develop real-world leadership skills through hands-on training and mentorship programmes.' },
              { icon: <Globe className="text-sky-400" />, title: 'Global Network', desc: 'Connect with over 200,000 JCI members across 120 nations and build a powerful global network.' },
              { icon: <Users className="text-sky-400" />, title: 'Community Impact', desc: 'Drive meaningful change in your local community through impactful projects and initiatives.' },
              { icon: <BookOpen className="text-sky-400" />, title: 'Skill Building', desc: 'Enhance your professional skills through workshops, training sessions, and real-world challenges.' },
              { icon: <Award className="text-sky-400" />, title: 'Global Recognition', desc: 'Earn prestigious awards and certifications that are recognised by global organisations.' },
              { icon: <Users className="text-sky-400" />, title: 'Business Partnerships', desc: 'Access exclusive business networking events and entrepreneurship development platforms.' }
            ].map((card, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20 shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">{card.title}</h4>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== JOIN JCI APPLICATION FORM ====== */}
      <section id="join" className="py-20 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[500px]">
          
          {/* Left visual panel */}
          <div className="lg:w-2/5 p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url('/join.jpg')` }}>
            <div className="absolute inset-0 bg-slate-950/90"></div>
            <div className="relative z-10 space-y-4">
              <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20 inline-block">Application Gateway</span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">Be a Part of JCI</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Take the first step. Submit your interest application below, and our respective local chapters will reach out to you with opportunities.
              </p>
            </div>
            
            <div className="relative z-10 text-[10px] border-t border-slate-800/80 pt-6 space-y-3 text-slate-400 mt-8">
              <p><i className="fa-solid fa-check text-sky-500 mr-2"></i>Access exclusive training modules</p>
              <p><i className="fa-solid fa-check text-sky-500 mr-2"></i>Join regional business councils</p>
            </div>
          </div>

          {/* Right form panel */}
          <div className="lg:w-3/5 p-8 lg:p-12">
            <h4 className="text-xl font-bold text-white">Membership Application</h4>
            <p className="text-xs text-slate-400 mt-1 mb-6">Complete the details below to submit your profile to JCI India Zone 12.</p>

            {submitStatus === 'success' && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-6 text-xs flex gap-2.5 items-start">
                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Application Received successfully!</p>
                  <p className="mt-0.5">Thank you. Our chapter administrators will review your credentials and contact you soon.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-xs flex gap-2.5 items-start">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Failed to submit application</p>
                  <p className="mt-0.5">{statusMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="form-group">
                <label className="block text-slate-400 font-bold uppercase mb-1.5">Full Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name" 
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-500 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="block text-slate-400 font-bold uppercase mb-1.5">Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@domain.com" 
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-500 transition"
                  />
                </div>
                <div className="form-group">
                  <label className="block text-slate-400 font-bold uppercase mb-1.5">Phone Number *</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    required 
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX" 
                    className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-500 transition"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="block text-slate-400 font-bold uppercase mb-1.5">City / Location *</label>
                <input 
                  type="text" 
                  name="city" 
                  required 
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Hyderabad, Mumbai" 
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-500 transition"
                />
              </div>

              <div className="form-group">
                <label className="block text-slate-400 font-bold uppercase mb-1.5">Briefly explain why you want to join JCI?</label>
                <textarea 
                  name="message" 
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your motivation..." 
                  className="w-full bg-slate-900/40 border border-slate-800 rounded-xl px-4 py-2.5 text-white outline-none focus:border-sky-500 transition resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-sky-500/20 active:scale-[0.99] flex items-center justify-center gap-2 text-xs"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
