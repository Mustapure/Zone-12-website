'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Mail, Sparkles } from 'lucide-react';

const Linkedin = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Leaders() {
  const leaders = {
    president: {
      name: 'JFP Goutam Kumar Jain',
      role: 'Zone President 2026',
      position: 'Zone President',
      org: 'JCI India Zone 12',
      img: '/img/Img40.png'
    },
    advisers: [
      {
        name: 'JCI PPP Nagesh Pampati',
        role: 'Zone Adviser 2026',
        position: 'Zone Adviser',
        org: 'JCI India Zone 12',
        img: '/img/img202.jpeg'
      },
      {
        name: 'JFP PDM Vinay Mehta',
        role: 'Zone Adviser 2026',
        position: 'Zone Adviser',
        org: 'JCI India Zone 12',
        img: '/img/img201.jpeg'
      }
    ],
    board: [
      { name: 'JFS Chaturvedi Vutkuru', role: 'Immediate Past Zone President', position: 'Immediate Past Zone President', img: '/img/img11.jpeg' },
      { name: 'JC Anil Kumar Dhoti', role: 'ZVP Region A', position: 'ZVP Region A', img: '/img/img2.png' },
      { name: 'JFM Mahendra Gundam', role: 'ZVP Region B', position: 'ZVP Region B', img: '/img/img21.png' },
      { name: 'JFP Pankaj Kapoor', role: 'ZVP Region C', position: 'ZVP Region C', img: '/img/img28.jpeg' },
      { name: 'JC Aayuush Saraogi', role: 'Zone Secretary', position: 'Zone Secretary', img: '/img/img34.jpeg' },
      { name: 'JFD Prashant Agarwal', role: 'Zone Director', position: 'Zone Director Management', img: '/img/img6.jpeg' },
      { name: 'JC Vajja Mahendra', role: 'Zone Director', position: 'Zone Director Training', img: '/img/img20.jpeg' },
      { name: 'JFM Samkit Jain', role: 'Zone Director', position: 'Zone Director G&D', img: '/img/img17.jpeg' },
      { name: 'JFP Satish Kumar Thumu', role: 'Zone Director', position: 'Zone Director Business', img: '/img/img19.jpeg' },
      { name: 'JC Manideep Proddatoori', role: 'Zone Coordinator', position: 'Zone J.COM Chairman', img: '/img/img5.jpeg' },
      { name: 'JC Sarvesh Malani', role: 'Zone Director', position: 'Zone Director Community Development', img: '/img/img26.jpeg' },
      { name: 'JC Virija Vidapu', role: 'Zone Director', position: 'Zone Director PR & Marketing', img: '/img/img181.jpeg' },
      { name: 'JC Fayazoodin', role: 'Zone Director', position: 'Zone Director Junior Jaycee', img: '/img/img3.jpeg' },
      { name: 'JC Akhay Sadhu', role: 'Zone Director', position: 'Zone Director International', img: '/img/img22.jpeg' },
      { name: 'JC Aparna Reddy', role: 'Zone Director', position: 'Zone Director Lady Jaycee', img: '/img/img1010.jpeg' }
    ],
    coordinators: [
      { name: 'JFM Shreya Dixit', role: 'Zone Coordinator', position: 'Zone Co-ordinator PR & Marketing', img: '/img/img27.jpeg' },
      { name: 'JC Sundeep Nerlakanti', role: 'Zone Coordinator', position: 'Zone Co-ordinator Training', img: '/img/img15.jpeg' },
      { name: 'JC Narlapuram Raju', role: 'Zone Coordinator', position: 'Zone Co-ordinator 100% Efficiency', img: '/img/img13.jpeg' },
      { name: 'JC Sayyam Saibabu', role: 'Zone Coordinator', position: 'Zone Co-ordinator Greetings', img: '/img/img8.jpeg' },
      { name: 'JC Vivek Chauglle', role: 'Zone Coordinator', position: 'Zone Co-ordinator MRF', img: '/img/img16.jpeg' },
      { name: 'JC Jayanth Shetty Sura', role: 'Zone Coordinator', position: 'Zone Co-ordinator JCI India Officer\'s Visit & Sports Activity', img: '/img/img4.jpeg' },
      { name: 'JFS Roshan Agarwal', role: 'Zone Coordinator', position: 'Zone Co-ordinator Community Development', img: '/img/img25.jpeg' },
      { name: 'JFM Rose M Vase', role: 'Zone Coordinator', position: 'Zone Co-ordinator CSR Connect', img: '/img/img14.jpeg' },
      { name: 'JC Nayan Jilkaar', role: 'Zone Coordinator', position: 'Zone Co-ordinator Youth Safety', img: '/img/img23.jpeg' },
      { name: 'JC Ritesh Battad', role: 'Zone Coordinator', position: 'Zone Co-ordinator Fund Raising', img: '/img/img7.jpeg' },
      { name: 'JC Sailesh Proddaturu', role: 'Zone Coordinator', position: 'Zone Co-ordinator International', img: '/img/img9.jpeg' },
      { name: 'JC Santosh Kumar Gunti', role: 'Zone Coordinator', position: 'Zone Co-ordinator Business', img: '/img/img18.jpeg' },
      { name: 'JC Mekala Lingaraju', role: 'Zone Coordinator', position: 'Zone Co-ordinator JCI Week', img: '/img/img24.jpeg' },
      { name: 'JC Abhishek Boddu', role: 'Zone Coordinator', position: 'Zone Co-ordinator CSR', img: '/img/img10.jpeg' },
      { name: 'JFP Nilesh Karia', role: 'Zone Coordinator', position: 'Zone Co-ordinator Challenge & Bulletin Editior', img: '/img/img103.jpeg' },
      { name: 'JC Sumathi Kattoju', role: 'Zone Coordinator', position: 'Zone Co-ordinator Business', img: '/img/img104.jpeg' }
    ]
  };

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen pt-28 pb-16 bg-[#070d1e]">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20 mb-4">
              <Sparkles size={12} />
              Zone 12 Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Zone Governing Body</h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Zone Governing Body is composed of dynamic young leaders from around Zone 12 who provide strategic direction and visionary leadership.
            </p>
          </div>

          {/* Zone President Section */}
          <div className="mb-16">
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 mb-8 flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-400" />
              <span>Zone President</span>
            </h3>
            
            <div className="flex justify-center">
              <div className="w-full max-w-sm bg-[#101c38]/40 border border-slate-800 rounded-3xl overflow-hidden shadow-xl group">
                <img src={leaders.president.img} alt={leaders.president.name} className="w-full aspect-[4/5] object-cover object-top grayscale group-hover:grayscale-0 transition duration-500" />
                <div className="p-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20">{leaders.president.role}</span>
                  <h4 className="text-lg font-bold text-white mt-3">{leaders.president.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{leaders.president.org}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zone Advisers Section */}
          <div className="mb-16">
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 mb-8 flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-400" />
              <span>Zone Advisers</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto text-xs sm:text-sm">
              {leaders.advisers.map((member, idx) => (
                <div key={idx} className="bg-[#101c38]/20 hover:bg-[#101c38]/40 border border-slate-800 rounded-2xl overflow-hidden transition group">
                  <img src={member.img} alt={member.name} className="w-full aspect-square object-cover object-top grayscale group-hover:grayscale-0 transition duration-500" />
                  <div className="p-4">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-sky-400">{member.role}</p>
                    <h4 className="font-bold text-white text-sm mt-1">{member.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">{member.position}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{member.org}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Board of Directors Section */}
          <div className="mb-16">
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 mb-8 flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-400" />
              <span>Zone Board</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
              {leaders.board.map((member, idx) => (
                <div key={idx} className="bg-[#101c38]/20 hover:bg-[#101c38]/40 border border-slate-800 rounded-2xl overflow-hidden transition group">
                  <div className="relative">
                    <img src={member.img} alt={member.name} className="w-full aspect-square object-cover object-top grayscale group-hover:grayscale-0 transition duration-500" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition duration-200">
                      <a href="#" className="w-7 h-7 bg-sky-500 text-slate-950 rounded-lg flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shadow-sky-500/20">
                        <Linkedin size={12} />
                      </a>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-sky-400">{member.role}</p>
                    <h4 className="font-bold text-white text-sm mt-1">{member.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">{member.position}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">JCI India Zone 12</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coordinators Section */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-3 mb-8 flex items-center gap-2">
              <ShieldCheck size={18} className="text-sky-400" />
              <span>Zone Coordinators</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-xs sm:text-sm">
              {leaders.coordinators.map((member, idx) => (
                <div key={idx} className="bg-[#101c38]/20 hover:bg-[#101c38]/40 border border-slate-800 rounded-2xl overflow-hidden transition group">
                  <img src={member.img} alt={member.name} className="w-full aspect-square object-cover object-top grayscale group-hover:grayscale-0 transition duration-500" />
                  <div className="p-4">
                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-sky-400">{member.role}</p>
                    <h4 className="font-bold text-white text-sm mt-1">{member.name}</h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">{member.position}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">JCI India Zone 12</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
