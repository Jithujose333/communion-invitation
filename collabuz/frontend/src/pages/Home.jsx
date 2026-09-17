import React, { useState, useEffect } from 'react';
import { fetchApi } from '../services/api';
import { EventCard } from '../components/EventCard';
import { Search, Filter, Sparkles, Building2, Calendar, ShieldCheck, Ticket } from 'lucide-react';

export const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollege, setSelectedCollege] = useState('All');

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Management', 'Music'];
  const colleges = ['All', 'Stanford University', 'Massachusetts Institute of Technology (MIT)', 'Indian Institute of Technology (IIT)'];

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, selectedCollege]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      let query = `?category=${selectedCategory}&college=${selectedCollege}`;
      if (search) query += `&search=${encodeURIComponent(search)}`;
      
      const data = await fetchApi(`/events${query}`);
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEvents();
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-20 right-10 w-[300px] h-[200px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Official College Event & Program Booking Portal</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Discover & Book <br />
            <span className="gradient-text">College Fests & Hackathons</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            One platform for top university symposiums, technical hackathons, cultural nights, and esports tournaments. Instant Razorpay ticket verification.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl backdrop-blur-md">
            <div className="flex-1 flex items-center space-x-3 px-3">
              <Search className="w-5 h-5 text-indigo-400 shrink-0" />
              <input
                type="text"
                placeholder="Search events, colleges, hackathons, or workshops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="gradient-btn text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-md flex items-center space-x-1.5"
            >
              <span>Search</span>
            </button>
          </form>

        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          
          {/* Category Badges */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* College Filter Dropdown */}
          <div className="flex items-center space-x-2 shrink-0">
            <Building2 className="w-4 h-4 text-indigo-400" />
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              {colleges.map((col) => (
                <option key={col} value={col}>
                  {col === 'All' ? 'All Colleges' : col}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center space-y-3">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-200">No College Events Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your category or college filter to discover upcoming programs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
