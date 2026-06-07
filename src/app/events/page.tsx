'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Calendar, MapPin, Tag, Sparkles } from 'lucide-react';

export default function Events() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function loadEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const filters = [
    { key: 'all', name: 'All Events' },
    { key: 'conference', name: 'Conference' },
    { key: 'training', name: 'Training' },
    { key: 'awards', name: 'Awards' },
    { key: 'community', name: 'Community' }
  ];

  const filteredEvents = activeFilter === 'all' 
    ? events 
    : events.filter(e => e.category === activeFilter);

  const featuredEvent = events.find(e => e.featured);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          
          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20 mb-4">
              <Sparkles size={12} />
              Zone 12 Events
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Upcoming Events &amp; News</h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Explore upcoming conferences, professional training seminars, awards ceremonies, and community projects organized across JCI Zone 12.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-12 bg-slate-900/40 border border-slate-800 p-1.5 rounded-2xl max-w-2xl mx-auto">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition duration-150 ${
                  activeFilter === f.key
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/10'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Featured Event Card */}
          {!loading && featuredEvent && (activeFilter === 'all' || featuredEvent.category === activeFilter) && (
            <div className="bg-slate-900/30 border border-slate-800/80 rounded-3xl overflow-hidden mb-12 flex flex-col lg:flex-row gap-6 hover:border-slate-700 transition duration-300">
              <div className="lg:w-1/2 relative min-h-[250px]">
                <img src={featuredEvent.img || '/img/img10.jpeg'} alt={featuredEvent.title} className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition duration-500" />
                <span className="absolute top-4 left-4 bg-sky-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">Featured Event</span>
              </div>
              <div className="lg:w-1/2 p-8 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/20 w-fit">
                  <Calendar size={12} />
                  {featuredEvent.date}
                </span>
                <h3 className="text-2xl font-black text-white mt-4">{featuredEvent.title}</h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">{featuredEvent.desc}</p>
                <div className="flex flex-wrap gap-6 mt-6 text-xs text-slate-500 border-t border-slate-800/80 pt-4">
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> Location: {featuredEvent.location}</span>
                  <span className="flex items-center gap-1.5 capitalize"><Tag size={13} /> {featuredEvent.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs font-bold uppercase tracking-wider">Synchronizing events calendar...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20 text-slate-550 border border-slate-800/80 rounded-3xl bg-slate-900/10 font-bold text-xs uppercase tracking-widest">
              No events scheduled under this filter yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.filter(e => !e.featured).map((event, idx) => (
                <div key={event.id || idx} className="bg-slate-900/20 hover:bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden transition group flex flex-col justify-between">
                  <div>
                    <div className="relative">
                      <img src={event.img || '/img/img10.jpeg'} alt={event.title} className="w-full aspect-[16/10] object-cover object-center grayscale group-hover:grayscale-0 transition duration-500" />
                      <span className="absolute bottom-3 left-3 bg-slate-950/90 text-sky-400 border border-sky-500/20 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Calendar size={10} />
                        {event.date}
                      </span>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-white text-base group-hover:text-sky-400 transition">{event.title}</h4>
                      <p className="text-slate-400 text-xs mt-2.5 leading-relaxed">{event.desc}</p>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-500 bg-slate-950/10">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {event.location}</span>
                    <span className="flex items-center gap-1 capitalize"><Tag size={11} /> {event.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}
