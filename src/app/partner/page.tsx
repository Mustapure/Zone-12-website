'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Handshake, Target, Sparkles, Building, Landmark, GraduationCap, Globe } from 'lucide-react';

export default function Partner() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-16 bg-[#070d1e]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20 mb-4">
              <Sparkles size={12} />
              Zone Partnerships
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Collaborate with JCI India</h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Unlock mutual growth by aligning with JCI Zone 12. Connect your brand with energetic active citizens making a concrete impact in cities and communities.
            </p>
          </div>

          {/* Why Partner Grid */}
          <div className="mb-20">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-2xl font-extrabold text-white">Why Partner With Us?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="bg-[#101c38]/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                  <Target className="text-sky-400" />
                </div>
                <h4 className="font-bold text-white text-base">Community Reach</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Access an expanding network of 1,200+ members and 28 local chapters covering multiple districts across Telangana and Andhra Pradesh.
                </p>
              </div>
              <div className="bg-[#101c38]/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                  <Sparkles className="text-sky-400" />
                </div>
                <h4 className="font-bold text-white text-base">Brand Visibility</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Showcase your brand at prominent conventions, award ceremonies, and directories viewed by hundreds of young leaders.
                </p>
              </div>
              <div className="bg-[#101c38]/40 border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
                  <Handshake className="text-sky-400" />
                </div>
                <h4 className="font-bold text-white text-base">Shared Impact</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Co-create CSR programmes and leadership training workshops that make concrete, sustainable impact in local communities.
                </p>
              </div>
            </div>
          </div>

          {/* Partnership Categories */}
          <div className="mb-16">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h3 className="text-2xl font-extrabold text-white">Collaboration Sectors</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
              {[
                { icon: <Building size={20} className="text-sky-400" />, title: 'Corporate Partners', desc: 'Alliances with businesses to fund community expansion and build corporate active citizenship.' },
                { icon: <GraduationCap size={20} className="text-sky-400" />, title: 'Institutions', desc: 'Collaboration with schools and colleges to foster active leadership skills in students.' },
                { icon: <Landmark size={20} className="text-sky-400" />, title: 'NGOs &amp; Foundations', desc: 'Joint action initiatives aimed at sustainability, civic hygiene, and community health.' },
                { icon: <Globe size={20} className="text-sky-400" />, title: 'International Councils', desc: 'Global cooperation programs aligning with UN Sustainable Development Goals (SDGs).' }
              ].map((cat, idx) => (
                <div key={idx} className="bg-[#101c38]/20 hover:bg-[#101c38]/40 border border-slate-850 p-6 rounded-2xl transition text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center border border-sky-500/20 mx-auto">
                    {cat.icon}
                  </div>
                  <h4 className="font-bold text-white text-sm">{cat.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-sky-500/10 via-slate-850 to-slate-850 border border-slate-800 rounded-3xl p-8 lg:p-12 text-center max-w-4xl mx-auto mt-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 space-y-4 max-w-xl mx-auto">
              <h3 className="text-2xl font-black text-white">Become a Partner</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect with our partnership executives today to explore customized sponsorship decks, community co-branding packages, and business directory integrations.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-3">
                <a href="/contact" className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl transition text-xs shadow-md shadow-sky-500/20">
                  <i className="fa-solid fa-envelope"></i>
                  <span>Contact Us</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
