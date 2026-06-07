'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, SlidersHorizontal, MapPin, Phone, Mail, 
  Globe, Briefcase, User, Sparkles, PlusCircle, ArrowUpDown 
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

interface DirectoryClientProps {
  initialBusinesses: Business[];
  cities: string[];
}

export default function DirectoryClient({ initialBusinesses, cities }: DirectoryClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc' | 'default'>('default');

  const categories = useMemo(() => {
    const list = initialBusinesses.map(b => b.category);
    return Array.from(new Set(list)).filter(Boolean);
  }, [initialBusinesses]);

  const filteredBusinesses = useMemo(() => {
    let result = [...initialBusinesses];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        b =>
          b.business_name.toLowerCase().includes(q) ||
          b.owner_name.toLowerCase().includes(q) ||
          (b.description && b.description.toLowerCase().includes(q)) ||
          b.city.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(b => b.category === selectedCategory);
    }

    // City filter
    if (selectedCity) {
      result = result.filter(b => b.city === selectedCity);
    }

    // Sort order
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.business_name.localeCompare(b.business_name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.business_name.localeCompare(a.business_name));
    }

    return result;
  }, [initialBusinesses, search, selectedCategory, selectedCity, sortBy]);

  return (
    <div className="space-y-8">
      <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
          <SlidersHorizontal size={14} />
          <span>Search &amp; Refine Listings</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Text Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by business, owner, city, keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-sky-500/80 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-2.5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:border-sky-500/80 transition cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Services">Services</option>
              <option value="Products">Products</option>
              <option value="Service Provider">Service Provider</option>
            </select>
          </div>

          {/* City Dropdown */}
          <div className="md:col-span-2.5">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:border-sky-500/80 transition cursor-pointer"
            >
              <option value="">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:border-sky-500/80 transition cursor-pointer"
            >
              <option value="default">Sort By</option>
              <option value="name-asc">Name (A - Z)</option>
              <option value="name-desc">Name (Z - A)</option>
            </select>
          </div>
        </div>

        {/* Info stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/40 text-xs text-slate-400">
          <div>
            Showing <strong className="text-sky-400">{filteredBusinesses.length}</strong> active listings
          </div>
          <div className="flex items-center gap-1">
            <Sparkles size={12} className="text-yellow-500" />
            <span>Click any card action to connect directly with the owner.</span>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredBusinesses.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 border border-slate-800/80 rounded-3xl space-y-4">
          <Briefcase className="mx-auto text-slate-600 animate-pulse" size={48} />
          <h3 className="text-lg font-bold text-white">No Listings Found</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            We couldn't find any business listings matching your current filters. Try resetting them or search for something else.
          </p>
          <div className="pt-2">
            <Link 
              href="/login" 
              className="inline-flex items-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-400/20 font-bold px-5 py-2.5 rounded-xl transition text-xs"
            >
              <PlusCircle size={14} />
              <span>Submit Your Business</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-800/60 transition duration-300 flex flex-col justify-between group shadow-lg"
            >
              {/* Top Row Category & City */}
              <div>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-sky-400/10 text-sky-400 border border-sky-400/20">
                    {biz.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <MapPin size={10} className="text-sky-400" />
                    {biz.city}
                  </span>
                </div>

                {/* Name & Owner */}
                <div className="mt-4">
                  <h3 className="text-lg font-extrabold text-white group-hover:text-sky-400 transition leading-snug">
                    {biz.business_name}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-1.5 flex items-center gap-1">
                    <User size={12} className="text-slate-500" />
                    <span>Owned by: <strong className="text-slate-300 font-semibold">{biz.owner_name}</strong></span>
                  </p>
                </div>

                {/* Description */}
                {biz.description && (
                  <p className="text-xs text-slate-400 leading-relaxed mt-3 line-clamp-2">
                    {biz.description}
                  </p>
                )}

                {/* Address */}
                {biz.address && (
                  <p className="text-[11px] text-slate-500 mt-2 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-slate-600" />
                    <span className="line-clamp-1">{biz.address}</span>
                  </p>
                )}
              </div>

              {/* Action and contact details footer */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                  <a
                    href={`tel:${biz.phone}`}
                    className="flex items-center gap-1.5 hover:text-white transition py-1"
                  >
                    <Phone size={12} className="text-sky-400" />
                    <span>Call Owner</span>
                  </a>
                  <a
                    href={`mailto:${biz.email}`}
                    className="flex items-center gap-1.5 hover:text-white transition py-1 justify-end"
                  >
                    <Mail size={12} className="text-sky-400" />
                    <span className="truncate max-w-[80px]">Email</span>
                  </a>
                </div>

                {biz.website ? (
                  <a
                    href={biz.website.startsWith('http') ? biz.website : `https://${biz.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white text-xs font-bold py-2.5 rounded-xl transition duration-200"
                  >
                    <Globe size={13} />
                    <span>Visit Website</span>
                  </a>
                ) : (
                  <a
                    href={`mailto:${biz.email}`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition duration-200"
                  >
                    <Mail size={13} />
                    <span>Inquire Profile</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
